const { pool } = require('../config/db')

exports.findAllAttraction = async () => {
    const { rows } = await pool.query('SELECT * FROM attraction ORDER BY id_attraction')

    return rows
}

exports.addAttraction = async ({
    name_attraction,
    slug_attraction,
    id_park,
    type_attraction,
    alt_attraction,
    parc_zone_attraction,
    intensity_level_attraction,
    family_friendly_attraction,
    short_description_attraction,
    speed_max_kmh_attraction,
    height_m_attraction,
    length_m_attraction,
    duration_min_attraction,
    inversion_attraction,
    minimum_height_cm_attraction,
    opening_year_attraction,
    description_attraction
}) => {

    const { rows } = await pool.query(
        `
        INSERT INTO attraction (
            name_attraction,
            slug_attraction,
            id_park,
            type_attraction,
            alt_attraction,
            parc_zone_attraction,
            intensity_level_attraction,
            family_friendly_attraction,
            short_description_attraction,
            speed_max_kmh_attraction,
            height_m_attraction,
            length_m_attraction,
            duration_min_attraction,
            inversion_attraction,
            minimum_height_cm_attraction,
            opening_year_attraction,
            description_attraction
        )
        VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11, $12,
            $13, $14, $15, $16, $17
        )
        RETURNING *
        `,
        [
            name_attraction,
            slug_attraction,
            id_park,
            type_attraction,
            alt_attraction,
            parc_zone_attraction,
            intensity_level_attraction,
            family_friendly_attraction,
            short_description_attraction,
            speed_max_kmh_attraction,
            height_m_attraction,
            length_m_attraction,
            duration_min_attraction,
            inversion_attraction,
            minimum_height_cm_attraction,
            opening_year_attraction,
            description_attraction
        ]
    )

    return rows[0]
}