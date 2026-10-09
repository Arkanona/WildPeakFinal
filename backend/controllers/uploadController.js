const sharp = require('sharp')
const path = require('path')
const fs = require('fs/promises')
const Upload = require('../models/uploadModel')

exports.updateParkImage = async (req, res) => {
    try {

        const { id } = req.params

        if (!req.file) {
            return res.status(404).json({
                title: 'Image non trouvée',
                status: 404
            })}

        // On récupère le parc
        const result = await Upload.selectAttraction(id)

        if (result.rowCount === 0) {
            return res.status(404).json({
                title: 'Parc non trouvé',
                status: 404
            })
        }

        // const park = result.rows[0]

        // dossier upload
        const uploadFolder = path.join(
            process.cwd(),
            'upload',
            'park'
        )

        await fs.mkdir(uploadFolder, {
            recursive: true
        })

        // Noms des nouvelles images
        const safeId = id.replace(/[^a-zA-Z0-9-_]/g, '')

        const timestamp = Date.now()

        const cardFilename = `${safeId}-${timestamp}-card.webp`
        const backgroundFilename = `${safeId}-${timestamp}-background.webp`

        const cardPath = path.join(uploadFolder, cardFilename)
        const backgroundPath = path.join(uploadFolder, backgroundFilename)

        // Création de l'image card
        await sharp(req.file.buffer)
            .rotate()
            .resize({
                width: 600,
                height: 400,
                fit: 'cover'
            })
            .webp({
                quality: 85
            })
            .toFile(cardPath)

        // Création de l'image background
        await sharp(req.file.buffer)
            .rotate()
            .resize({
                width: 1900,
                height: 400,
                fit: 'cover'
            })
            .webp({
                quality: 85
            })
            .toFile(backgroundPath)

        // URL enregistrées en BDD
        const cardImageUrl = `/upload/park/${cardFilename}`
        const backgroundImageUrl = `/upload/park/${backgroundFilename}`

        // mise à jour BDD
        const updatePark = await Upload.updateParkDb(cardImageUrl, backgroundImageUrl, id)

        // 8. Suppression des anciennes images
        const oldImages = [
            park.img_park,
            park.imgbg_park
        ]

        for (const oldImage of oldImages) {

            if (!oldImage) continue

            const oldImagePath = path.join(
                process.cwd(),
                oldImage.replace(/^\/+/, '')
            )

            try {
                await fs.unlink(oldImagePath)
            } catch (err) {

                if (err.code !== 'ENOENT') {
                    throw err
                }
            }
        }

        return res.status(200).json({
            title: "L'image du parc à été modifiée",
            status: 200,
            park: updatePark
        })

    } catch (err) {
        console.error('ERREUR UPLOAD :', err)

        return res.status(500).json({
            title: "Erreur à la modification de l'image",
            status: 500,
            error: err.message
        })
    }
}

exports.updateAttractionImage = async (req, res) => {
    try {

        const { id } = req.params

        if (!req.file) {
            return res.status(404).json({
                title: 'Image non trouvée',
                status: 404
            })}

        // On récupère le parc
        const result = await Upload.selectAttraction(id)

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: 'Attraction non trouvé',
                status: 404
            })
        }

        const attraction = result.rows[0]

        // dossier upload
        const uploadFolder = path.join(
            process.cwd(),
            'upload',
            'attraction'
        )

        await fs.mkdir(uploadFolder, {
            recursive: true
        })

        // Noms des nouvelles images
        const safeId = id.replace(/[^a-zA-Z0-9-_]/g, '')

        const timestamp = Date.now()

        const cardFilename = `${safeId}-${timestamp}-card.webp`
        const backgroundFilename = `${safeId}-${timestamp}-background.webp`

        const cardPath = path.join(uploadFolder, cardFilename)
        const backgroundPath = path.join(uploadFolder, backgroundFilename)

        // Création de l'image card
        await sharp(req.file.buffer)
            .rotate()
            .resize({
                width: 600,
                height: 400,
                fit: 'cover'
            })
            .webp({
                quality: 85
            })
            .toFile(cardPath)

        // Création de l'image background
        await sharp(req.file.buffer)
            .rotate()
            .resize({
                width: 1900,
                height: 400,
                fit: 'cover'
            })
            .webp({
                quality: 85
            })
            .toFile(backgroundPath)

        // URL enregistrées en BDD
        const cardImageUrl = `/upload/attraction/${cardFilename}`
        const backgroundImageUrl = `/upload/attraction/${backgroundFilename}`

        // mise à jour BDD
        const updateAttraction = await Upload.updateAttractionDb(cardImageUrl, backgroundImageUrl, id)

        // 8. Suppression des anciennes images
        const oldImages = [
            attraction.img_attraction,
            attraction.imgbg_attraction
        ]

        for (const oldImage of oldImages) {

            if (!oldImage) continue

            const oldImagePath = path.join(
                process.cwd(),
                oldImage.replace(/^\/+/, '')
            )

            try {
                await fs.unlink(oldImagePath)
            } catch (err) {

                if (err.code !== 'ENOENT') {
                    throw err
                }
            }
        }

        return res.status(200).json({
            title: "L'image de l'attraction à été modifiée",
            status: 200,
            attraction: updateAttraction.rows[0]})

    } catch (err) {
        console.error('ERREUR UPLOAD :', err)

        return res.status(500).json({
            title: "Erreur à la modification de l'image",
            status: 500,
            error: err.message})
    }
}