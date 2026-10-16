const sharp = require('sharp')
const Upload = require('../models/uploadModel')
const supabase = require('../config/supabase')

const BUCKET = 'wildpeak'

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

exports.deleteOldImages = async (images) => {
    const paths = images
        .map(getStoragePathFromUrl)
        .filter(Boolean)

    if (paths.length === 0) {
        return
    }

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
                park: updatePark[0]
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