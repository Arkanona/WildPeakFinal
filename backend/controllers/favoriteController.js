const {pool} = require('../config/db')

exports.getFavorites = async (req, res) => {
    try {
        const userId = req.user.id_user

        const result = await pool.query(
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

        res.status(200).json(result.rows)
    } catch (error) {
        console.error(error)

        res.status(500).json({message: "Erreur lors de la récupération des favoris"})
    }
}

exports.addFavorite = async (req, res) => {
    try {
        const userId = req.user.id_user
        const { idAttraction } = req.params

        const result = await pool.query(
            `
            INSERT INTO favorites (id_user, id_attraction)
            VALUES ($1, $2)
            ON CONFLICT (id_user, id_attraction)
            DO NOTHING
            RETURNING *
            `,
            [userId, idAttraction]
        )
        
        res.status(201).json({
            message: "Attraction ajoutée aux favoris",
            favorite: result.rows[0]
        })
    } catch (error) {
        console.error(error)
        console.error('ERREUR AJOUT FAVORI :', error)

        res.status(500).json({message: "Erreur lors de l'ajout aux favoris"})
    }
}

exports.removeFavorite = async (req, res) => {
    try {
        const userId = req.user.id_user
        const { idAttraction } = req.params

        await pool.query(
            `
            DELETE FROM favorites
            WHERE id_user = $1
            AND id_attraction = $2
            `,
            [userId, idAttraction]
        )

        res.status(200).json({message: "Attraction supprimée des favoris"})
    } catch (error) {
        console.error(error)

        res.status(500).json({message: "Erreur lors de la suppression du favori"})
    }
}