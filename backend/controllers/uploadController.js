/**
 * @module controllers/uploadController
 * @description
 * Contrôleur chargé du traitement et de la gestion
 * des images de WildPeak.
 *
 * Il permet de :
 * - redimensionner et convertir les images avec Sharp,
 * - envoyer les fichiers dans le bucket Supabase,
 * - générer les URLs publiques,
 * - supprimer d'anciennes images du stockage,
 * - mettre à jour les images des parcs,
 * - créer les images des parcs et des attractions.
 */

const sharp = require('sharp')
const Upload = require('../models/uploadModel')
const supabase = require('../config/supabase')

const BUCKET = 'wildpeak'

/**
 * Génère deux buffers d'image à partir d'un fichier source.
 *
 * La première image est destinée à un format carte
 * avec une taille de 600 x 400 pixels.
 *
 * La seconde image est destinée à un format bannière
 * avec une taille de 1900 x 400 pixels.
 *
 * Les deux images sont converties en WebP avec une
 * qualité de compression de 85.
 *
 * @async
 * @private
 * @function createImagesBuffers
 * @param {Buffer} fileBuffer - Buffer de l'image d'origine.
 * @returns {Promise<Object>} Objet contenant les buffers générés.
 * @returns {Buffer} returns.cardBuffer - Buffer de l'image carte.
 * @returns {Buffer} returns.backgroundBuffer - Buffer de l'image bannière.
 * @throws {Error} Si le traitement Sharp échoue.
 */
const createImagesBuffers = async (fileBuffer) => {

    const cardBuffer = await sharp(fileBuffer)
        .rotate()
        .resize({
            width: 600,
            height: 400,
            fit: 'cover'
        })
        .webp({
            quality: 85
        })
        .toBuffer()

    const backgroundBuffer = await sharp(fileBuffer)
        .rotate()
        .resize({
            width: 1900,
            height: 400,
            fit: 'cover'
        })
        .webp({
            quality: 85
        })
        .toBuffer()

    return {
        cardBuffer,
        backgroundBuffer
    }
}

/**
 * Envoie deux images dans le bucket Supabase.
 *
 * Génère des chemins de stockage sécurisés à partir
 * d'un identifiant et d'un horodatage, puis envoie
 * une image carte et une image de fond.
 *
 * Si l'envoi de l'image de fond échoue, l'image carte
 * déjà téléversée est supprimée pour éviter un état incohérent.
 *
 * Les URLs publiques des deux fichiers sont ensuite récupérées.
 *
 * @async
 * @private
 * @function uploadToSupabase
 * @param {Buffer} cardBuffer - Buffer de l'image carte.
 * @param {Buffer} backgroundBuffer - Buffer de l'image de fond.
 * @param {string} folder - Dossier cible dans le bucket.
 * @param {number|string} id - Identifiant utilisé dans le nom des fichiers.
 * @returns {Promise<Object>} Objet contenant les URLs publiques et les chemins de stockage.
 * @returns {string} returns.cardImageUrl - URL publique de l'image carte.
 * @returns {string} returns.backgroundImageUrl - URL publique de l'image de fond.
 * @returns {string} returns.cardPath - Chemin de stockage de l'image carte.
 * @returns {string} returns.backgroundPath - Chemin de stockage de l'image de fond.
 * @throws {Error} Si un upload vers Supabase échoue.
 */
const uploadToSupabase = async (
    cardBuffer,
    backgroundBuffer,
    folder,
    id
) => {

    const safeId = String(id).replace(/[^a-zA-Z0-9-_]/g, '')
    const timestamp = Date.now()

    const cardPath =
        `${folder}/${safeId}-${timestamp}-card.webp`

    const backgroundPath =
        `${folder}/${safeId}-${timestamp}-background.webp`

    const { error: cardError } = await supabase.storage
        .from(BUCKET)
        .upload(
            cardPath,
            cardBuffer,
            {
                contentType: 'image/webp',
                upsert: false
            }
        )

    if (cardError) {
        throw cardError
    }

    const { error: backgroundError } = await supabase.storage
        .from(BUCKET)
        .upload(
            backgroundPath,
            backgroundBuffer,
            {
                contentType: 'image/webp',
                upsert: false
            }
        )

    if (backgroundError) {

        // Si le background échoue, on supprime la card déjà uploadée
        await supabase.storage
            .from(BUCKET)
            .remove([cardPath])

        throw backgroundError
    }

    const { data: cardData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(cardPath)

    const { data: backgroundData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(backgroundPath)

    return {
        cardImageUrl: cardData.publicUrl,
        backgroundImageUrl: backgroundData.publicUrl,
        cardPath,
        backgroundPath
    }
}

/**
 * Extrait le chemin de stockage Supabase à partir d'une URL publique.
 *
 * Si l'URL est absente ou si elle ne contient pas le marqueur
 * attendu du bucket public, la fonction retourne null.
 *
 * @private
 * @function getStoragePathFromUrl
 * @param {string|null|undefined} url - URL publique d'une image stockée sur Supabase.
 * @returns {string|null} Chemin relatif dans le bucket ou null si non récupérable.
 */
const getStoragePathFromUrl = (url) => {

    if (!url) return null

    const marker =
        `/storage/v1/object/public/${BUCKET}/`

    const index = url.indexOf(marker)

    if (index === -1) {
        return null
    }

    return url.substring(
        index + marker.length
    )
}

/**
 * Supprime une liste d'anciennes images du bucket Supabase.
 *
 * Transforme les URLs publiques en chemins de stockage,
 * filtre les valeurs invalides puis demande leur suppression.
 *
 * Si aucune image valide n'est trouvée, la fonction s'arrête.
 *
 * En cas d'erreur Supabase, celle-ci est journalisée
 * sans être relancée.
 *
 * @async
 * @function deleteOldImages
 * @param {Array<string|null|undefined>} images - Liste d'URLs publiques d'images à supprimer.
 * @returns {Promise<void>} Ne retourne aucune donnée.
 */
const deleteOldImages = async (images) => {
    const paths = images
        .map(getStoragePathFromUrl)
        .filter(Boolean)

    if (paths.length === 0) return

    const { error } = await supabase.storage
        .from(BUCKET)
        .remove(paths)

    if (error) {
        console.error(
            'Erreur lors de la suppression des anciennes images :',
            error.message
        )
    }
}

exports.deleteOldImages = deleteOldImages

/**
 * Met à jour les images d'un parc existant.
 *
 * Vérifie la présence d'un fichier image et l'existence
 * du parc avant de générer de nouvelles images.
 *
 * Les nouvelles images sont téléversées sur Supabase,
 * puis leurs URLs sont enregistrées en base de données.
 *
 * Si la mise à jour en base échoue après l'upload,
 * les nouvelles images sont supprimées pour éviter
 * les fichiers orphelins.
 *
 * Une fois la mise à jour validée, les anciennes images
 * du parc sont supprimées du stockage.
 *
 * @async
 * @function updateParkImage
 * @param {Object} req - Requête HTTP Express.
 * @param {Object} req.params - Paramètres de l'URL.
 * @param {string} req.params.id - Identifiant du parc.
 * @param {Object} req.file - Fichier image transmis par Multer.
 * @param {Buffer} req.file.buffer - Buffer du fichier image.
 * @param {Object} res - Réponse HTTP Express.
 * @returns {Promise<Object>} Réponse HTTP contenant le parc mis à jour ou une erreur.
 *
 * @description Codes HTTP :
 * - 200 : Image du parc modifiée avec succès.
 * - 400 : Image absente.
 * - 404 : Parc non trouvé.
 * - 500 : Erreur lors de la modification de l'image.
 */
exports.updateParkImage = async (req, res) => {
    try {

        const { id } = req.params

        if (!req.file) {
            return res.status(400).json({
                title: 'Image non trouvée',
                status: 400
            })
        }

        const result = await Upload.selectPark(id)

        if (result.length === 0) {
            return res.status(404).json({
                title: 'Parc non trouvé',
                status: 404
            })
        }

        const park = result[0]

        const {
            cardBuffer,
            backgroundBuffer
        } = await createImagesBuffers(
            req.file.buffer
        )

        const {
            cardImageUrl,
            backgroundImageUrl,
            cardPath,
            backgroundPath
        } = await uploadToSupabase(
            cardBuffer,
            backgroundBuffer,
            'parks',
            id
        )

        try {

            const updatePark =
                await Upload.updateParkDb(
                    cardImageUrl,
                    backgroundImageUrl,
                    id
                )

            await deleteOldImages([
                park.img_park,
                park.imgbg_park
            ])

            return res.status(200).json({
                title: "L'image du parc a été modifiée",
                status: 200,
                park: updatePark
            })

        } catch (err) {

            // Si la mise à jour BDD échoue, on supprime les nouvelles images
            await supabase.storage
                .from(BUCKET)
                .remove([
                    cardPath,
                    backgroundPath
                ])

            throw err
        }

    } catch (err) {

        console.error(
            'ERREUR UPLOAD PARC :',
            err
        )

        return res.status(500).json({
            title: "Erreur lors de la modification de l'image",
            status: 500,
            error: err.message
        })
    }
}

/**
 * Crée les images d'une attraction et les envoie sur Supabase.
 *
 * Si aucun fichier n'est fourni, la fonction retourne
 * des URLs nulles.
 *
 * Sinon, elle génère les deux versions de l'image
 * puis les téléverse dans le dossier "attractions".
 *
 * @async
 * @function createAttractionImages
 * @param {Object} file - Fichier image transmis par Multer.
 * @param {Buffer} file.buffer - Buffer du fichier image.
 * @param {number|string} id - Identifiant de l'attraction.
 * @returns {Promise<Object>} Objet contenant les URLs publiques des images créées.
 * @returns {string|null} returns.cardImageUrl - URL publique de l'image carte.
 * @returns {string|null} returns.backgroundImageUrl - URL publique de l'image de fond.
 * @throws {Error} Si le traitement ou l'upload des images échoue.
 */
exports.createAttractionImages = async (
    file,
    id
) => {

    if (!file) {
        return {
            cardImageUrl: null,
            backgroundImageUrl: null
        }
    }

    const {
        cardBuffer,
        backgroundBuffer
    } = await createImagesBuffers(
        file.buffer
    )

    const {
        cardImageUrl,
        backgroundImageUrl
    } = await uploadToSupabase(
        cardBuffer,
        backgroundBuffer,
        'attractions',
        id
    )

    return {
        cardImageUrl,
        backgroundImageUrl
    }
}

/**
 * Crée les images d'un parc et les envoie sur Supabase.
 *
 * Si aucun fichier n'est fourni, la fonction retourne
 * des URLs nulles.
 *
 * Sinon, elle génère les deux versions de l'image
 * puis les téléverse dans le dossier "parks".
 *
 * @async
 * @function createParkImages
 * @param {Object} file - Fichier image transmis par Multer.
 * @param {Buffer} file.buffer - Buffer du fichier image.
 * @param {number|string} id - Identifiant du parc.
 * @returns {Promise<Object>} Objet contenant les URLs publiques des images créées.
 * @returns {string|null} returns.cardImageUrl - URL publique de l'image carte.
 * @returns {string|null} returns.backgroundImageUrl - URL publique de l'image de fond.
 * @throws {Error} Si le traitement ou l'upload des images échoue.
 */
exports.createParkImages = async (file, id) => {

    if (!file) {
        return {
            cardImageUrl: null,
            backgroundImageUrl: null
        }
    }

    const {
        cardBuffer,
        backgroundBuffer
    } = await createImagesBuffers(file.buffer)

    const {
        cardImageUrl,
        backgroundImageUrl
    } = await uploadToSupabase(
        cardBuffer,
        backgroundBuffer,
        'parks',
        id
    )

    return {
        cardImageUrl,
        backgroundImageUrl
    }
}