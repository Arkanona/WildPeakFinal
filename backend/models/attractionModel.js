const { pool } = require('../config/db')

exports.findAllAttraction = async () => {
    const { rows } = await pool.query('SELECT * FROM attraction ORDER BY id_attraction')

    return rows
}