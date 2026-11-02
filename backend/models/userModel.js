
/**
 * @module models/userModel
 * @description
 * Modèle chargé de la gestion des utilisateurs dans
 * la base de données PostgreSQL de WildPeak.
 *
 * Il permet la création et la recherche des utilisateurs,
 * la gestion des tokens de réinitialisation des mots
 * de passe et la suppression définitive des comptes.
 */

const {pool} = require('../config/db')

/**
 * Crée un nouvel utilisateur dans la base de données.
 *
 * L'adresse e-mail est convertie en minuscules et
 * les espaces en début et fin sont supprimés.
 * Le rôle "user" est attribué par défaut.
 *
 * Le mot de passe reçu doit déjà être haché.
 *
 * @async
 * @function createUser
 * @param {string} name - Nom de l'utilisateur.
 * @param {string} email - Adresse e-mail de l'utilisateur.
 * @param {string} hashedPassword - Mot de passe haché avec bcrypt.
 * @returns {Promise<Object>} Informations de l'utilisateur créé (identifiant, nom, e-mail et rôle).
 * @throws {Error} Si l'insertion en base de données échoue.
 */
exports.createUser = async (name, email, hashedPassword) => {
    
    const { rows } = await pool.query(
        `INSERT INTO "users" (name_user, email_user, pass_hash_user, role_user)
         VALUES ($1, $2, $3, $4)
         RETURNING id_user, name_user, email_user, role_user`,
        [name, email.toLowerCase().trim(), hashedPassword, 'user']
    )

    return rows[0];
}

/**
 * Recherche un utilisateur à partir de son adresse e-mail.
 *
 * L'adresse e-mail est normalisée en minuscules
 * et les espaces inutiles sont supprimés avant
 * l'exécution de la requête SQL.
 *
 * @async
 * @function findUserByEmail
 * @param {string} email - Adresse e-mail de l'utilisateur recherché.
 * @returns {Promise<Object|null>} Utilisateur trouvé ou null si aucun compte ne correspond.
 * @throws {Error} Si la requête SQL échoue.
 */
exports.findUserByEmail = async (email) => {  
    const { rows } = await pool.query(
        `SELECT * FROM "users" WHERE email_user = $1`,
        [email.toLowerCase().trim()]
    )

    return rows[0] || null;
}

/**
 * Recherche un utilisateur à partir de son identifiant.
 *
 * Exécute une requête sur la table users
 * pour récupérer les informations du compte.
 *
 * @async
 * @function findUserById
 * @param {number} id - Identifiant de l'utilisateur recherché.
 * @returns {Promise<Object|null>} Utilisateur trouvé ou null si aucun compte ne correspond.
 * @throws {Error} Si la requête SQL échoue.
 */
exports.findUserById = async (id) => {
    const { rows } = await pool.query(
        `SELECT * FROM "users" WHERE id_user = $1`,
        [id]
    )

    return rows[0] || null;
}

/**
 * Enregistre un token de réinitialisation de mot de passe.
 *
 * Met à jour le compte utilisateur avec le hash
 * du token de réinitialisation et sa date d'expiration.
 *
 * Le token transmis à cette fonction doit déjà
 * avoir été haché par le controller.
 *
 * @async
 * @function saveResetToken
 * @param {number} userId - Identifiant de l'utilisateur.
 * @param {string} hashedToken - Empreinte SHA-256 du token de réinitialisation.
 * @param {Date} expiresAt - Date et heure d'expiration du token.
 * @returns {Promise<Object|undefined>} Objet contenant id_user si la mise à jour a réussi, sinon undefined.
 * @throws {Error} Si la requête SQL échoue.
 */
exports.saveResetToken = async (userId, hashedToken, expiresAt) => {
    const query = `
        UPDATE users
        SET 
            reset_password_token = $1,
            reset_password_expires = $2
        WHERE id_user = $3
        RETURNING id_user
    `

    const values = [
        hashedToken,
        expiresAt,
        userId
    ]

    const result = await pool.query(query, values)

    return result.rows[0]
}

/**
 * Recherche un utilisateur à partir d'un token de réinitialisation.
 *
 * Compare le hash du token fourni avec celui
 * enregistré en base de données.
 *
 * La recherche vérifie également que la date
 * d'expiration du token n'est pas dépassée.
 *
 * @async
 * @function findUserByResetToken
 * @param {string} hashedToken - Empreinte SHA-256 du token de réinitialisation.
 * @returns {Promise<Object|undefined>} Utilisateur associé au token valide ou undefined si aucun résultat.
 * @throws {Error} Si la requête SQL échoue.
 */
exports.findUserByResetToken = async (hashedToken) => {
    const query = `
    SELECT *
    FROM users
    WHERE reset_password_token = $1
    AND reset_password_expires > NOW()`

    const result = await pool.query(query, [hashedToken])

    return result.rows[0]
}

/**
 * Met à jour le mot de passe d'un utilisateur.
 *
 * Remplace le hash du mot de passe enregistré
 * dans la table users par le nouveau hash fourni.
 *
 * Le nouveau mot de passe doit déjà avoir été
 * haché avec bcrypt avant l'appel de cette fonction.
 *
 * @async
 * @function updatePassword
 * @param {number} userId - Identifiant de l'utilisateur.
 * @param {string} hashedPassword - Nouveau mot de passe haché.
 * @returns {Promise<void>} Ne retourne aucune donnée.
 * @throws {Error} Si la requête SQL échoue.
 */
exports.updatePassword = async (userId, hashedPassword) => {
    const query = `
        UPDATE users
        SET pass_hash_user = $1
        WHERE id_user = $2
    `

    await pool.query(query, [
        hashedPassword,
        userId
    ])
}

/**
 * Supprime le token de réinitialisation d'un utilisateur.
 *
 * Réinitialise les colonnes reset_password_token
 * et reset_password_expires à NULL.
 *
 * Cette opération permet notamment d'empêcher
 * la réutilisation d'un token après la modification
 * du mot de passe.
 *
 * @async
 * @function clearResetToken
 * @param {number} userId - Identifiant de l'utilisateur.
 * @returns {Promise<void>} Ne retourne aucune donnée.
 * @throws {Error} Si la requête SQL échoue.
 */
exports.clearResetToken = async (userId) => {
    const query = `
        UPDATE users
        SET
            reset_password_token = NULL,
            reset_password_expires = NULL
        WHERE id_user = $1
    `

    await pool.query(query, [userId])
}

/**
 * Supprime définitivement un compte utilisateur.
 *
 * La suppression est réalisée dans une transaction
 * PostgreSQL afin de garantir la cohérence des données.
 *
 * La ligne utilisateur est verrouillée avec FOR UPDATE
 * pendant l'opération pour éviter les modifications
 * concurrentes du compte.
 *
 * Le mot de passe est vérifié à l'aide d'une fonction
 * asynchrone fournie par le controller.
 *
 * Si le compte existe et que le mot de passe est valide,
 * les favoris associés sont supprimés avant le compte.
 *
 * La transaction est validée avec COMMIT en cas de succès.
 * En cas d'erreur ou de vérification échouée, un ROLLBACK
 * annule les modifications de la transaction.
 *
 * La connexion PostgreSQL est libérée dans tous les cas
 * grâce au bloc finally.
 *
 * @async
 * @function deleteUserAccount
 * @param {number} idUser - Identifiant du compte à supprimer.
 * @param {function(string): Promise<boolean>} verifyPassword - Fonction asynchrone vérifiant le mot de passe à partir de son hash.
 * @returns {Promise<Object>} Résultat de l'opération de suppression.
 *
 * @description Résultats possibles :
 * - { success: true } : compte supprimé.
 * - { success: false, reason: 'USER_NOT_FOUND' } : compte introuvable.
 * - { success: false, reason: 'INVALID_PASSWORD' } : mot de passe incorrect.
 *
 * @throws {Error} Si une opération PostgreSQL ou la vérification du mot de passe échoue.
 */
exports.deleteUserAccount = async (idUser, verifyPassword) => {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        // Verrouiller la ligne utilisateur pendant l'opération
        const { rows } = await client.query(
            `
            SELECT id_user, pass_hash_user
            FROM users
            WHERE id_user = $1
            FOR UPDATE
            `,
            [idUser]
        )

        const user = rows[0]

        if (!user) {
            await client.query('ROLLBACK')

            return {
                success: false,
                reason: 'USER_NOT_FOUND'
            }
        }

        // La fonction de vérification est fournie par le controller
        const passwordValid = await verifyPassword(
            user.pass_hash_user
        )

        if (!passwordValid) {
            await client.query('ROLLBACK')

            return {
                success: false,
                reason: 'INVALID_PASSWORD'
            }
        }

        // Supprimer les favoris
        await client.query(
            `
            DELETE FROM favorites
            WHERE id_user = $1
            `,
            [idUser]
        )

        // Supprimer le compte
        await client.query(
            `
            DELETE FROM users
            WHERE id_user = $1
            `,
            [idUser]
        )

        await client.query('COMMIT')

        return {
            success: true
        }

    } catch (error) {
        await client.query('ROLLBACK')
        throw error

    } finally {
        client.release()
    }
}
