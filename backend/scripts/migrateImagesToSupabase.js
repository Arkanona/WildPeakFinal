require('dotenv').config()

const fs = require('fs/promises')
const path = require('path')

const { pool } = require('../config/db')
const supabase = require('../config/supabase')

const BUCKET = 'wildpeak'

const isLocalUpload = (imagePath) => {
    return imagePath && imagePath.startsWith('/upload/')
}

const uploadImage = async (localImagePath, storageFolder) => {

    const cleanPath = localImagePath.replace(/^\/+/, '')

    const absolutePath = path.join(
        process.cwd(),
        cleanPath
    )

    const filename = path.basename(absolutePath)

    const storagePath = `${storageFolder}/${filename}`

    console.log(`Upload : ${localImagePath}`)

    const fileBuffer = await fs.readFile(absolutePath)

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(
            storagePath,
            fileBuffer,
            {
                contentType: 'image/webp',

                // Permet de relancer le script sans erreur
                upsert: true
            }
        )

    if (error) {
        throw error
    }

    const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(storagePath)

    return data.publicUrl
}

const migrateParks = async () => {

    console.log('\n--- MIGRATION DES PARCS ---\n')

    const { rows: parks } = await pool.query(`
        SELECT
            id_park,
            name_park,
            img_park,
            imgbg_park
        FROM park
        ORDER BY id_park
    `)

    for (const park of parks) {

        let cardUrl = park.img_park
        let backgroundUrl = park.imgbg_park

        let changed = false

        try {

            if (isLocalUpload(park.img_park)) {

                cardUrl = await uploadImage(
                    park.img_park,
                    'parks'
                )

                changed = true
            }

            if (isLocalUpload(park.imgbg_park)) {

                backgroundUrl = await uploadImage(
                    park.imgbg_park,
                    'parks'
                )

                changed = true
            }

            if (!changed) {
                console.log(
                    `Ignoré : ${park.name_park} (aucune image locale)`
                )

                continue
            }

            await pool.query(
                `
                    UPDATE park
                    SET
                        img_park = $1,
                        imgbg_park = $2
                    WHERE id_park = $3
                `,
                [
                    cardUrl,
                    backgroundUrl,
                    park.id_park
                ]
            )

            console.log(
                `✅ Parc migré : ${park.name_park}`
            )

        } catch (err) {

            console.error(
                `❌ Erreur parc ${park.name_park} :`,
                err.message
            )
        }
    }
}

const migrateAttractions = async () => {

    console.log('\n--- MIGRATION DES ATTRACTIONS ---\n')

    const { rows: attractions } = await pool.query(`
        SELECT
            id_attraction,
            name_attraction,
            img_attraction,
            imgbg_attraction
        FROM attraction
        ORDER BY id_attraction
    `)

    for (const attraction of attractions) {

        let cardUrl = attraction.img_attraction
        let backgroundUrl = attraction.imgbg_attraction

        let changed = false

        try {

            if (isLocalUpload(attraction.img_attraction)) {

                cardUrl = await uploadImage(
                    attraction.img_attraction,
                    'attractions'
                )

                changed = true
            }

            if (isLocalUpload(attraction.imgbg_attraction)) {

                backgroundUrl = await uploadImage(
                    attraction.imgbg_attraction,
                    'attractions'
                )

                changed = true
            }

            if (!changed) {
                console.log(
                    `Ignorée : ${attraction.name_attraction} (aucune image locale)`
                )

                continue
            }

            await pool.query(
                `
                    UPDATE attraction
                    SET
                        img_attraction = $1,
                        imgbg_attraction = $2
                    WHERE id_attraction = $3
                `,
                [
                    cardUrl,
                    backgroundUrl,
                    attraction.id_attraction
                ]
            )

            console.log(
                `✅ Attraction migrée : ${attraction.name_attraction}`
            )

        } catch (err) {

            console.error(
                `❌ Erreur attraction ${attraction.name_attraction} :`,
                err.message
            )
        }
    }
}

const migrate = async () => {

    try {

        console.log('================================')
        console.log('Migration WildPeak vers Supabase')
        console.log('================================')

        await migrateParks()
        await migrateAttractions()

        console.log('\n================================')
        console.log('✅ Migration terminée')
        console.log('================================')

    } catch (err) {

        console.error(
            '\n❌ Erreur générale :',
            err
        )

    } finally {

        await pool.end()
    }
}

migrate()