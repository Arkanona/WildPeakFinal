
/**
 * @module models/parkModel
 * @description
 * Modèle chargé de la gestion des parcs dans
 * la base de données PostgreSQL de WildPeak.
 *
 * Il permet de récupérer les parcs, de rechercher
 * un parc par son identifiant, d'ajouter, de modifier
 * et de supprimer des parcs.
 *
 * Il permet également de compter les attractions
 * associées à un parc avant sa suppression.
 */

const { pool } = require('../config/db')

/**
 * Récupère tous les parcs enregistrés dans la base de données.
 *
 * Exécute une requête SQL sur la table park et retourne
 * l'ensemble des parcs triés par identifiant croissant.
 *
 * @async
 * @function findAllPark
 * @returns {Promise<Object[]>} Tableau contenant les informations de tous les parcs.
 * @throws {Error} Si la requête SQL échoue.
 */
exports.findAllPark = async () => {
    const { rows } = await pool.query('SELECT * FROM park ORDER BY id_park')

    return rows
}

/**
 * Recherche un parc à partir de son identifiant.
 *
 * Exécute une requête SQL paramétrée sur la table park
 * afin de récupérer les informations du parc correspondant.
 *
 * Si aucun parc ne correspond à l'identifiant fourni,
 * la fonction retourne null.
 *
 * @async
 * @function findParkById
 * @param {number|string} idPark - Identifiant du parc recherché.
 * @returns {Promise<Object|null>} Informations du parc trouvé ou null si aucun résultat.
 * @throws {Error} Si la requête SQL échoue.
 */
exports.findParkById = async (idPark) => {
    const { rows } = await pool.query(
        `
        SELECT *
        FROM park
        WHERE id_park = $1
        `,
        [idPark]
    )

    return rows[0] || null
}

/**
 * Ajoute un nouveau parc dans la base de données.
 *
 * Insère les informations du parc dans la table park
 * à l'aide d'une requête SQL paramétrée.
 *
 * Le slug est généré en amont par le controller
 * et transmis au modèle avec les autres informations.
 *
 * La clause RETURNING permet de récupérer toutes
 * les données du parc après son insertion.
 *
 * @async
 * @function addPark
 * @param {Object} parkData - Informations du parc à créer.
 * @param {string} parkData.name_park - Nom du parc.
 * @param {string} parkData.slug_park - Identifiant textuel unique du parc.
 * @param {string} [parkData.country_park] - Pays du parc.
 * @param {string} [parkData.place_park] - Ville ou localisation du parc.
 * @param {number|null} [parkData.opening_year_park] - Année d'ouverture du parc.
 * @param {string} [parkData.description_park] - Description du parc.
 * @returns {Promise<Object|undefined>} Informations du parc nouvellement créé.
 * @throws {Error} Si l'insertion dans PostgreSQL échoue.
 */
exports.addPark = async ({
    name_park,
    slug_park,
    country_park,
    place_park,
    opening_year_park,
    description_park
}) => {
    const { rows } = await pool.query(
        `
        INSERT INTO park (
            name_park,
            slug_park,
            country_park,
            place_park,
            opening_year_park,
            description_park
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [
            name_park,
            slug_park,
            country_park,
            place_park,
            opening_year_park,
            description_park
        ]
    )

    return rows[0]
}

/**
 * Modifie les informations d'un parc existant.
 *
 * Met à jour les données du parc correspondant
 * à l'identifiant fourni dans la table park.
 *
 * Les champs du parc sont remplacés par les nouvelles
 * valeurs transmises depuis le controller.
 *
 * La clause RETURNING permet de récupérer
 * les informations du parc après sa modification.
 *
 * Si aucun parc ne correspond à l'identifiant,
 * la fonction retourne null.
 *
 * @async
 * @function updatePark
 * @param {number|string} id - Identifiant du parc à modifier.
 * @param {Object} parkData - Nouvelles informations du parc.
 * @param {string} parkData.name_park - Nouveau nom du parc.
 * @param {string} parkData.slug_park - Nouveau slug du parc.
 * @param {string} [parkData.country_park] - Pays du parc.
 * @param {string} [parkData.place_park] - Ville ou localisation du parc.
 * @param {number|null} [parkData.opening_year_park] - Année d'ouverture.
 * @param {string} [parkData.description_park] - Description du parc.
 * @returns {Promise<Object|null>} Parc modifié ou null si aucun parc ne correspond.
 * @throws {Error} Si la requête de modification échoue.
 */
exports.updatePark = async (id, {
    name_park,
    slug_park,
    country_park,
    place_park,
    opening_year_park,
    description_park
}) => {
    const { rows } = await pool.query(
        `
        UPDATE park
        SET
            name_park = $1,
            slug_park = $2,
            country_park = $3,
            place_park = $4,
            opening_year_park = $5,
            description_park = $6
        WHERE id_park = $7
        RETURNING *
        `,
        [
            name_park,
            slug_park,
            country_park,
            place_park,
            opening_year_park,
            description_park,
            id
        ]
    )

    return rows[0] || null
}

/**
 * Compte le nombre d'attractions associées à un parc.
 *
 * Exécute une requête SQL sur la table attraction
 * afin de compter les attractions dont l'identifiant
 * de parc correspond à celui fourni.
 *
 * Le résultat SQL est converti en entier grâce
 * à l'opérateur ::integer de PostgreSQL.
 *
 * Cette fonction est notamment utilisée avant
 * la suppression d'un parc pour vérifier qu'il
 * ne contient plus d'attractions.
 *
 * @async
 * @function countAttractions
 * @param {number|string} id - Identifiant du parc concerné.
 * @returns {Promise<number>} Nombre total d'attractions associées au parc.
 * @throws {Error} Si la requête SQL échoue.
 */
exports.countAttractions = async (id) => {
    const { rows } = await pool.query(
        `
        SELECT COUNT(*)::integer AS total
        FROM attraction
        WHERE id_park = $1
        `,
        [id]
    )

    return rows[0].total
}

/**
 * Supprime un parc de la base de données.
 *
 * Exécute une requête DELETE sur la table park
 * pour supprimer le parc correspondant à l'identifiant.
 *
 * La vérification de la présence d'attractions
 * associées est effectuée en amont par le controller.
 *
 * La clause RETURNING permet de récupérer les
 * informations du parc supprimé.
 *
 * Si aucun parc ne correspond à l'identifiant,
 * la fonction retourne null.
 *
 * @async
 * @function deletePark
 * @param {number|string} id - Identifiant du parc à supprimer.
 * @returns {Promise<Object|null>} Informations du parc supprimé ou null si aucun résultat.
 * @throws {Error} Si la suppression dans PostgreSQL échoue.
 */
exports.deletePark = async (id) => {
    const { rows } = await pool.query(
        `
        DELETE FROM park
        WHERE id_park = $1
        RETURNING *
        `,
        [id]
    )

    return rows[0] || null
}
