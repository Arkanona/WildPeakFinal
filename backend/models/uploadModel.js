const { pool } = require('../config/db')

exports.selectAttraction = async (id) => {
    const { rows } = await pool.query('SELECT id_attraction, img_attraction, imgbg_attraction FROM attraction WHERE id_attraction = $1', [id])

    return rows
}

exports.selectPark = async (id) => {
    const { rows } = await pool.query('SELECT id_park, img_park, imgbg_park FROM park WHERE id_park = $1', [id])

    return rows
}

exports.updateParkDb = async (cardImageUrl, backgroundImageUrl, id) => {
    const { rows } = await pool.query(`
        UPDATE park
        SET img_park = $1,
            imgbg_park = $2
        WHERE id_park = $3
        RETURNING *`,
        [ cardImageUrl,backgroundImageUrl, id])

    return rows[0] || null
}

exports.updateAttractionDb = async (cardImageUrl, backgroundImageUrl, id) => {
    const { rows } = await pool.query(`
        UPDATE attraction
        SET img_attraction = $1,
            imgbg_attraction = $2
        WHERE id_attraction = $3
        RETURNING *`,
        [ cardImageUrl,backgroundImageUrl,id ])

    return rows[0] || null
}