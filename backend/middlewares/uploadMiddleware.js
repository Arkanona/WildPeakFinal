
/**
 * @module middlewares/uploadMiddleware
 * @description
 * Middleware chargé de la gestion des fichiers images
 * envoyés vers le backend de WildPeak.
 *
 * Il utilise Multer pour traiter les fichiers
 * transmis dans les requêtes multipart/form-data.
 *
 * Les fichiers sont stockés temporairement en mémoire
 * avant leur traitement avec Sharp et leur envoi
 * vers le stockage Supabase.
 *
 * Seuls les formats JPEG, PNG et WebP sont acceptés.
 * La taille maximale autorisée est de 6 Mo par fichier.
 */

const multer = require('multer')

/**
 * Configure le stockage temporaire des fichiers en mémoire.
 *
 * Multer conserve les fichiers sous forme de Buffer
 * dans req.file.buffer, sans les enregistrer
 * directement sur le disque du serveur.
 *
 * @constant
 * @type {Object}
 */
const storage = multer.memoryStorage()

/**
 * Configure le middleware Multer utilisé pour
 * l'upload des images de WildPeak.
 *
 * La configuration applique les règles suivantes :
 * - Stockage temporaire en mémoire.
 * - Taille maximale de 6 Mo par fichier.
 * - Formats acceptés : JPEG, PNG et WebP.
 *
 * Les fichiers dont le type MIME n'est pas autorisé
 * sont rejetés avec une erreur.
 *
 * @constant
 * @type {Object}
 */
const upload = multer({
    storage,
    // Limitation à 6 Mo max
    limits: {
        fileSize: 6 * 1024 * 1024
    },

    /**
     * Vérifie que le type MIME du fichier envoyé est autorisé.
     *
     * Compare le type MIME du fichier avec la liste
     * des formats acceptés : image/jpeg, image/png
     * et image/webp.
     *
     * Si le format est invalide, une erreur est
     * transmise au callback.
     *
     * Si le format est accepté, le callback autorise
     * la poursuite du traitement.
     *
     * @function fileFilter
     * @param {Object} req - Requête HTTP Express.
     * @param {Object} file - Informations du fichier transmis.
     * @param {string} file.mimetype - Type MIME déclaré du fichier.
     * @param {Function} cb - Callback de validation Multer.
     * @returns {void} Autorise ou refuse le fichier via le callback.
     */
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ]

        if(!allowedTypes.includes(file.mimetype)) {
            return cb(
                new Error('Unsupported format. Use JPG, PNG, or WebP.')
            )
        }

        cb(null, true)
    }
})
module.exports = upload