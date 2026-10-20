const { pool } = require('../config/db')

exports.findAllPark = async () => {
    const { rows } = await pool.query('SELECT * FROM park ORDER BY id_park')

    return rows
}

exports.findParkById = async (idPark) => {
    const { rows } = await pool.query(
        `
        SELECT *
        FROM park
        WHERE id_park = $1
        `,
        [idPark]
    )

    return rows[0] || null
}

exports.addPark = async ({
    name_park,
    slug_park,
    country_park,
    place_park,
    opening_year_park,
    description_park
}) => {
    const { rows } = await pool.query(
        `
        INSERT INTO park (
            name_park,
            slug_park,
            country_park,
            place_park,
            opening_year_park,
            description_park
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [
            name_park,
            slug_park,
            country_park,
            place_park,
            opening_year_park,
            description_park
        ]
    )

    return rows[0]
}

exports.updatePark = async (id, {
    name_park,
    slug_park,
    country_park,
    place_park,
    opening_year_park,
    description_park
}) => {
    const { rows } = await pool.query(
        `
        UPDATE park
        SET
            name_park = $1,
            slug_park = $2,
            country_park = $3,
            place_park = $4,
            opening_year_park = $5,
            description_park = $6
        WHERE id_park = $7
        RETURNING *
        `,
        [
            name_park,
            slug_park,
            country_park,
            place_park,
            opening_year_park,
            description_park,
            id
        ]
    )

    return rows[0] || null
}

exports.countAttractions = async (id) => {
    const { rows } = await pool.query(
        `
        SELECT COUNT(*)::integer AS total
        FROM attraction
        WHERE id_park = $1
        `,
        [id]
    )

    return rows[0].total
}

exports.deletePark = async (id) => {
    const { rows } = await pool.query(
        `
        DELETE FROM park
        WHERE id_park = $1
        RETURNING *
        `,
        [id]
    )

    return rows[0] || null
}