
/**
 * Contrôleur de gestion des favoris de WildPeak.
 * Permet aux utilisateurs connectés de consulter,
 * ajouter et supprimer leurs attractions favorites.
 *
 * @module controllers/favoriteController
 */

const Favorite = require('../models/favoriteModel')

/**
 * Récupère les attractions favorites de l'utilisateur connecté.
 *
 * Les attractions sont retournées par ordre d'ajout
 * décroissant, de la plus récente à la plus ancienne.
 *
 * @async
 * @param {Object} req - Requête HTTP Express.
 * @param {Object} req.user - Utilisateur authentifié.
 * @param {number} req.user.id_user - Identifiant de l'utilisateur.
 * @param {Object} res - Réponse HTTP Express.
 * @returns {Promise<void>} Envoie les favoris en JSON (200) ou une erreur (500).
 */
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

/**
 * Ajoute une attraction aux favoris de l'utilisateur connecté.
 *
 * L'insertion ignore les doublons grâce à la contrainte
 * d'unicité présente dans la base de données.
 * Si le favori existe déjà, le modèle retourne null.
 *
 * @async
 * @param {Object} req - Requête HTTP Express.
 * @param {Object} req.user - Utilisateur authentifié.
 * @param {number} req.user.id_user - Identifiant de l'utilisateur.
 * @param {Object} req.params - Paramètres de l'URL.
 * @param {string} req.params.idAttraction - Identifiant de l'attraction.
 * @param {Object} res - Réponse HTTP Express.
 * @returns {Promise<void>} Envoie une réponse 201 ou une erreur 500.
 */
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

/**
 * Supprime une attraction des favoris de l'utilisateur connecté.
 *
 * Si l'attraction n'est pas présente dans les favoris,
 * le modèle retourne null.
 *
 * @async
 * @param {Object} req - Requête HTTP Express.
 * @param {Object} req.user - Utilisateur authentifié.
 * @param {number} req.user.id_user - Identifiant de l'utilisateur.
 * @param {Object} req.params - Paramètres de l'URL.
 * @param {string} req.params.idAttraction - Identifiant de l'attraction.
 * @param {Object} res - Réponse HTTP Express.
 * @returns {Promise<void>} Envoie une réponse 200 ou une erreur 500.
 */
exports.removeFavorite = async (req, res) => {
    try {
        const userId = req.user.id_user
        const { idAttraction } = req.params

        const removeFav = await Favorite.removeFavorite(userId, idAttraction)

        res.status(200).json({
            title: "Attraction supprimée des favoris",
            status: 200,
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
