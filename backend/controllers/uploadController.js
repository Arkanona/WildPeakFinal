const { pool } = require('../config/db')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs/promises')

exports.updateParkImage = async (req, res) => {
    try {

        const { id } = req.params

        if (!req.file) {
            return res.status(400).json({message: 'Image not found'})}

        // On récupère le parc
        const result = await pool.query(
            'SELECT id_park, img_park, imgbg_park FROM park WHERE id_park = $1',
            [id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({message: 'Park not found'})
        }

        const park = result.rows[0]

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
        const updatePark = await pool.query(
            `UPDATE park
            SET img_park = $1,
                imgbg_park = $2
            WHERE id_park = $3
            RETURNING id_park, name_park, img_park, imgbg_park`,
            [ cardImageUrl,backgroundImageUrl,id ]
        )

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

        return res.status(200).json({message: 'Park image updated', park: updatePark.rows[0]})

    } catch (err) {
        console.error('ERREUR UPLOAD :', err)

        return res.status(500).json({message: 'Error while modifying the image', error: err.message})
    }
}

exports.updateAttractionImage = async (req, res) => {
    try {

        const { id } = req.params

        if (!req.file) {
            return res.status(400).json({message: 'Image not found'})}

        // On récupère le parc
        const result = await pool.query(
            'SELECT id_attraction, img_attraction, imgbg_attraction FROM attraction WHERE id_attraction = $1',
            [id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({message: 'Attraction not found'})
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
        const updateAttraction = await pool.query(
            `UPDATE attraction
            SET img_attraction = $1,
                imgbg_attraction = $2
            WHERE id_attraction = $3
            RETURNING id_attraction, name_attraction, img_attraction, imgbg_attraction`,
            [ cardImageUrl,backgroundImageUrl,id ]
        )

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

        return res.status(200).json({message: 'Attraction image updated', attraction: updateAttraction.rows[0]})

    } catch (err) {
        console.error('ERREUR UPLOAD :', err)

        return res.status(500).json({message: 'Error while modifying the image', error: err.message})
    }
}