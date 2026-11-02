
/**
 * @module models/favoriteModel
 * @description
 * Modèle chargé de la gestion des favoris des utilisateurs
 * dans la base de données PostgreSQL de WildPeak.
 *
 * Il permet de récupérer les attractions favorites
 * d'un utilisateur, d'ajouter une attraction à ses favoris
 * et de supprimer un favori existant.
 *
 * Les opérations utilisent des requêtes SQL paramétrées
 * pour sécuriser la transmission des données à PostgreSQL.
 */

const { pool } = require('../config/db')

/**
 * Récupère toutes les attractions favorites d'un utilisateur.
 *
 * Effectue une jointure entre les tables favorites et attraction
 * afin de récupérer les informations complètes des attractions
 * enregistrées dans les favoris de l'utilisateur.
 *
 * Les résultats sont triés par ordre décroissant
 * d'identifiant de favori, du plus récent au plus ancien.
 *
 * Si l'utilisateur ne possède aucun favori,
 * la fonction retourne un tableau vide.
 *
 * @async
 * @function getFavorites
 * @param {number} userId - Identifiant de l'utilisateur connecté.
 * @returns {Promise<Object[]>} Tableau contenant les attractions favorites de l'utilisateur.
 * @throws {Error} Si la requête SQL échoue.
 */
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

/**
 * Ajoute une attraction aux favoris d'un utilisateur.
 *
 * Insère une nouvelle association entre l'utilisateur
 * et l'attraction dans la table favorites.
 *
 * La clause ON CONFLICT permet d'éviter les doublons
 * lorsqu'une association entre l'utilisateur et
 * l'attraction existe déjà.
 *
 * Si le favori existe déjà, aucune nouvelle ligne
 * n'est insérée et la fonction retourne null.
 *
 * La clause RETURNING permet de récupérer les informations
 * du favori nouvellement créé.
 *
 * @async
 * @function addFavorite
 * @param {number} userId - Identifiant de l'utilisateur connecté.
 * @param {number|string} idAttraction - Identifiant de l'attraction à ajouter.
 * @returns {Promise<Object|null>} Favori créé ou null si l'association existe déjà.
 * @throws {Error} Si l'insertion dans PostgreSQL échoue.
 */
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

/**
 * Supprime une attraction des favoris d'un utilisateur.
 *
 * Exécute une requête DELETE sur la table favorites
 * pour supprimer l'association entre l'utilisateur
 * et l'attraction correspondant aux identifiants fournis.
 *
 * La suppression concerne uniquement les favoris
 * de l'utilisateur indiqué et ne supprime pas
 * l'attraction de la base de données.
 *
 * La clause RETURNING permet de récupérer
 * les informations du favori supprimé.
 *
 * Si aucune association ne correspond aux identifiants,
 * la fonction retourne null.
 *
 * @async
 * @function removeFavorite
 * @param {number} userId - Identifiant de l'utilisateur connecté.
 * @param {number|string} idAttraction - Identifiant de l'attraction à retirer des favoris.
 * @returns {Promise<Object|null>} Favori supprimé ou null si aucun favori ne correspond.
 * @throws {Error} Si la suppression dans PostgreSQL échoue.
 */
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
