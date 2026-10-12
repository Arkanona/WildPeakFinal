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

exports.updateAttraction = async (
    id,
    {
        name_attraction,
        slug_attraction,
        alt_attraction,
        id_park,
        type_attraction,
        speed_max_kmh_attraction,
        height_m_attraction,
        length_m_attraction,
        duration_min_attraction,
        inversion_attraction,
        minimum_height_cm_attraction,
        opening_year_attraction,
        description_attraction,
        parc_zone_attraction,
        intensity_level_attraction,
        family_friendly_attraction,
        short_description_attraction
    }
) => {
    const { rows } = await pool.query(
        `
        UPDATE attraction
        SET
            name_attraction = $1,
            slug_attraction = $2,
            alt_attraction = $3,
            id_park = $4,
            type_attraction = $5,
            speed_max_kmh_attraction = $6,
            height_m_attraction = $7,
            length_m_attraction = $8,
            duration_min_attraction = $9,
            inversion_attraction = $10,
            minimum_height_cm_attraction = $11,
            opening_year_attraction = $12,
            description_attraction = $13,
            parc_zone_attraction = $14,
            intensity_level_attraction = $15,
            family_friendly_attraction = $16,
            short_description_attraction = $17
        WHERE id_attraction = $18
        RETURNING *
        `,
        [
            name_attraction,
            slug_attraction,
            alt_attraction,
            id_park,
            type_attraction,
            speed_max_kmh_attraction,
            height_m_attraction,
            length_m_attraction,
            duration_min_attraction,
            inversion_attraction,
            minimum_height_cm_attraction,
            opening_year_attraction,
            description_attraction,
            parc_zone_attraction,
            intensity_level_attraction,
            family_friendly_attraction,
            short_description_attraction,
            id
        ]
    )

    return rows[0] || null
}

exports.deleteAttraction = async (id) => {
    const { rows } = await pool.query(
        `
        DELETE FROM attraction
        WHERE id_attraction = $1
        RETURNING *
        `,
        [id]
    )

    return rows[0] || null
}