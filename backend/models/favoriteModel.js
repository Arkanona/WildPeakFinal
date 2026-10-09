const { pool } = require('../config/db')

exports.getFavorites = async (userId) => {

    const { rows } = await pool.query(
        `
        SELECT a.*
        FROM favorites f
        JOIN attraction a
            ON a.id_attraction = f.id_attraction
        WHERE f.id_user = $1
        ORDER BY f.id_favorite DESC
        `,
        [userId]
    )
    return rows
}

exports.addFavorite = async (userId, idAttraction) => {
    
    const { rows } = await pool.query(
        `
        INSERT INTO favorites (id_user, id_attraction)
        VALUES ($1, $2)
        ON CONFLICT (id_user, id_attraction)
        DO NOTHING
        RETURNING *
        `,
        [userId, idAttraction]
    )
    return rows[0] || null
}

exports.removeFavorite = async (userId, idAttraction) => {

    const { rows } = await pool.query(
        `
        DELETE FROM favorites
        WHERE id_user = $1
        AND id_attraction = $2
        RETURNING *
        `,
        [userId, idAttraction]
    )
    return rows[0] || null
}