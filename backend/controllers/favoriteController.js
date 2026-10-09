const Favorite = require('../models/favoriteModel')

exports.getFavorites = async (req, res) => {
    try {
        const userId = req.user.id_user

        const favorites = await Favorite.getFavorites(userId)

        res.status(200).json(favorites)
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: "Erreur lors de la récupération des favoris"
        })
    }
}

exports.addFavorite = async (req, res) => {
    try {
        const userId = req.user.id_user
        const { idAttraction } = req.params

        const addFav = await Favorite.addFavorite(userId, idAttraction)

        res.status(201).json({
            message: "Attraction ajoutée aux favoris",
            favorite: addFav
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: "Erreur lors de l'ajout aux favoris"
        })
    }
}

exports.removeFavorite = async (req, res) => {
    try {
        const userId = req.user.id_user
        const { idAttraction } = req.params

        const removeFav = await Favorite.removeFavorite(userId, idAttraction)

        res.status(200).json({
            message: "Attraction supprimée des favoris",
            favorite: removeFav
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: "Erreur lors de la suppression du favori"
        })
    }
}