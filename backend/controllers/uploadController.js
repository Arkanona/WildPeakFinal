const { pool } = require('../config/db')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs/promises')

exports.updateParkImage = async (req, res) => {
    try {

        const { id } = req.params

        if (!req.file) {
            return res.status(400).json({message: 'Image not found'})}

        const park = await pool.query(
            'SELECT id_park, img_park FROM park WHERE id_park = $1',
            [id]
        )

        if (park.rowCount === 0) {
            return res.status(404).json({message: 'Park not found'})
        }

        const uploadFolder = path.join(
            process.cwd(),
            'upload',
            'park'
        )

        await fs.mkdir(uploadFolder, {
            recursive: true
        })


        const safeId = id.replace(/[^a-zA-Z0-9-_]/g, '')

        const timestamp = Date.now()

        const cardFilename = `${safeId}-${timestamp}-card.webp`
        const backgroundFilename = `${safeId}-${timestamp}-background.webp`

        const cardPath = path.join(uploadFolder, cardFilename)
        const backgroundPath = path.join(uploadFolder, backgroundFilename)

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

        await sharp(req.file.buffer)
            .rotate()
            .resize({
                width: 1920,
                height: 1080,
                fit: 'cover'
            })
            .webp({
                quality: 85
            })
            .toFile(backgroundPath)


        const cardImageUrl = `/upload/park/${cardFilename}`

        const backgroundImageUrl = `/upload/park/${backgroundFilename}`

        const updatePark = await pool.query(
            `UPDATE park
            SET img_park = $1,
                imgbg_park = $2
            WHERE id_park = $3
            RETURNING id_park, name_park, img_park, imgbg_park`,
            [ cardImageUrl,backgroundImageUrl,id ]
        )

        return res.status(200).json({message: 'Park image updated', park: updatePark.rows[0]})

    } catch (err) {
        console.error('ERREUR UPLOAD :', err)

        return res.status(500).json({message: 'Error while modifying the image', error: err.message})
    }
}