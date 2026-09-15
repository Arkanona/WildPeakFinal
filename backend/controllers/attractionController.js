const { pool } = require('../config/db')

exports.getAttraction = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM attraction ORDER BY id_attraction')

        return res.status(200).json(result.rows)

    } catch (err) {
        console.error('ERREUR GET ATTRACRTIONS :', err)

        return res.status(500).json({message: 'Error retrieving attractions', error: err.message})
    }
}