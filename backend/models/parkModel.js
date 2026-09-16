const { pool } = require('../config/db')

exports.findAllPark = async () => {
    const { rows } = await pool.query('SELECT * FROM park ORDER BY id_park')

    return rows
}