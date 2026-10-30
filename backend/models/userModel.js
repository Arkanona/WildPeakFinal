const {pool} = require('../config/db')

exports.createUser = async (name, email, hashedPassword) => {
    
    const { rows } = await pool.query(
        `INSERT INTO "users" (name_user, email_user, pass_hash_user, role_user)
         VALUES ($1, $2, $3, $4)
         RETURNING id_user, name_user, email_user, role_user`,
        [name, email.toLowerCase().trim(), hashedPassword, 'user']
    )

    return rows[0];
}

exports.findUserByEmail = async (email) => {  
    const { rows } = await pool.query(
        `SELECT * FROM "users" WHERE email_user = $1`,
        [email.toLowerCase().trim()]
    )

    return rows[0] || null;
}

exports.findUserById = async (id) => {
    const { rows } = await pool.query(
        `SELECT * FROM "users" WHERE id_user = $1`,
        [id]
    )

    return rows[0] || null;
}

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

exports.findUserByResetToken = async (hashedToken) => {
    const query = `
    SELECT *
    FROM users
    WHERE reset_password_token = $1
    AND reset_password_expires > NOW()`

    const result = await pool.query(query, [hashedToken])

    return result.rows[0]
}

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