
/**
 * @module models/uploadModel
 * @description
 * Modèle chargé de la gestion des images des parcs
 * et des attractions dans PostgreSQL pour WildPeak.
 *
 * Il permet de récupérer les URLs des images existantes
 * et de mettre à jour les chemins des images après
 * leur traitement et leur stockage sur Supabase.
 *
 * Les requêtes SQL sont paramétrées afin de sécuriser
 * les échanges avec la base de données.
 */

const { pool } = require('../config/db')

/**
 * Récupère les informations et les images d'une attraction.
 *
 * Recherche une attraction à partir de son identifiant
 * et retourne son identifiant ainsi que les URLs
 * de son image principale et de son image de fond.
 *
 * Cette fonction est notamment utilisée avant
 * la modification d'une attraction pour récupérer
 * les anciennes images.
 *
 * Si aucune attraction ne correspond à l'identifiant,
 * la fonction retourne un tableau vide.
 *
 * @async
 * @function selectAttraction
 * @param {number|string} id - Identifiant de l'attraction recherchée.
 * @returns {Promise<Object[]>} Tableau contenant l'identifiant et les URLs des images de l'attraction.
 * @throws {Error} Si la requête SQL échoue.
 */
exports.selectAttraction = async (id) => {
    const { rows } = await pool.query('SELECT id_attraction, img_attraction, imgbg_attraction FROM attraction WHERE id_attraction = $1', [id])

    return rows
}

/**
 * Récupère les informations et les images d'un parc.
 *
 * Recherche un parc à partir de son identifiant
 * et retourne son identifiant ainsi que les URLs
 * de son image principale et de son image de fond.
 *
 * Cette fonction est notamment utilisée avant
 * le remplacement des images d'un parc afin
 * de conserver les anciennes URLs.
 *
 * Si aucun parc ne correspond à l'identifiant,
 * la fonction retourne un tableau vide.
 *
 * @async
 * @function selectPark
 * @param {number|string} id - Identifiant du parc recherché.
 * @returns {Promise<Object[]>} Tableau contenant l'identifiant et les URLs des images du parc.
 * @throws {Error} Si la requête SQL échoue.
 */
exports.selectPark = async (id) => {
    const { rows } = await pool.query('SELECT id_park, img_park, imgbg_park FROM park WHERE id_park = $1', [id])

    return rows
}

/**
 * Met à jour les URLs des images d'un parc.
 *
 * Enregistre les nouvelles URLs de l'image principale
 * et de l'image de fond dans la table park.
 *
 * Les URLs sont générées en amont après le traitement
 * des images et leur envoi vers Supabase.
 *
 * La clause RETURNING permet de récupérer toutes
 * les informations du parc après la modification.
 *
 * Si aucun parc ne correspond à l'identifiant,
 * la fonction retourne null.
 *
 * @async
 * @function updateParkDb
 * @param {string} cardImageUrl - URL publique de l'image principale du parc.
 * @param {string} backgroundImageUrl - URL publique de l'image de fond du parc.
 * @param {number|string} id - Identifiant du parc à modifier.
 * @returns {Promise<Object|null>} Parc mis à jour ou null si aucun parc ne correspond.
 * @throws {Error} Si la requête SQL échoue.
 */
exports.updateParkDb = async (cardImageUrl, backgroundImageUrl, id) => {
    const { rows } = await pool.query(`
        UPDATE park
        SET img_park = $1,
            imgbg_park = $2
        WHERE id_park = $3
        RETURNING *`,
        [ cardImageUrl,backgroundImageUrl, id])

    return rows[0] || null
}

/**
 * Met à jour les URLs des images d'une attraction.
 *
 * Enregistre les nouvelles URLs de l'image principale
 * et de l'image de fond dans la table attraction.
 *
 * Les URLs sont générées en amont après le traitement
 * des images avec Sharp et leur stockage sur Supabase.
 *
 * La clause RETURNING permet de récupérer toutes
 * les informations de l'attraction après la modification.
 *
 * Si aucune attraction ne correspond à l'identifiant,
 * la fonction retourne null.
 *
 * @async
 * @function updateAttractionDb
 * @param {string} cardImageUrl - URL publique de l'image principale de l'attraction.
 * @param {string} backgroundImageUrl - URL publique de l'image de fond de l'attraction.
 * @param {number|string} id - Identifiant de l'attraction à modifier.
 * @returns {Promise<Object|null>} Attraction mise à jour ou null si aucune attraction ne correspond.
 * @throws {Error} Si la requête SQL échoue.
 */
exports.updateAttractionDb = async (cardImageUrl, backgroundImageUrl, id) => {
    const { rows } = await pool.query(`
        UPDATE attraction
        SET img_attraction = $1,
            imgbg_attraction = $2
        WHERE id_attraction = $3
        RETURNING *`,
        [ cardImageUrl,backgroundImageUrl,id ])

    return rows[0] || null
}
