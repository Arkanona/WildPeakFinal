const Favorite = require('../models/favoriteModel')

exports.getFavorites = async (req, res) => {
    try {
        const userId = req.user.id_user

        const favorites = await Favorite.getFavorites(userId)

        res.status(200).json(favorites)
    } catch (error) {
        console.error(error)

        res.status(500).json({
            title: "Erreur lors de la récupération des favoris",
            status: 500
        })
    }
}

exports.addFavorite = async (req, res) => {
    try {
        const userId = req.user.id_user
        const { idAttraction } = req.params

        const addFav = await Favorite.addFavorite(userId, idAttraction)

        res.status(201).json({
            title: "Attraction ajoutée aux favoris",
            status: 201,
            favorite: addFav
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            title: "Erreur lors de l'ajout aux favoris",
            status: 500
        })
    }
}

exports.removeFavorite = async (req, res) => {
    try {
        const userId = req.user.id_user
        const { idAttraction } = req.params

        const removeFav = await Favorite.removeFavorite(userId, idAttraction)

        res.status(200).json({
            title: "Attraction supprimée des favoris",
            status: 201,
            favorite: removeFav
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            title: "Erreur lors de la suppression du favori",
            status: 500
        })
    }
}