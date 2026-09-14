const { pool } = require('../config/db')

exports.getParks = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM park ORDER BY id_park')

        return res.status(200).json(result.rows)

    } catch (err) {
        console.error('ERREUR GET PARKS :', err)

        return res.status(500).json({message: 'Error retrieving parks', error: err.message})
    }
}