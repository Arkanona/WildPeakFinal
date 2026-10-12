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