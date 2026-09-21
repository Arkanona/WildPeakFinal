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
