const bcrypt = require('bcryptjs')
const {pool} = require('../config/db')

exports.createUser = async (name, email, password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    const result = await pool.query(
        `INSERT INTO "users" (name_user, email_user, pass_hash_user, role_user)
         VALUES ($1, $2, $3, $4)
         RETURNING id_user, name_user, email_user, role_user`,
        [name, email.toLowerCase().trim(), hashedPassword, 'user']
    )

    return result.rows[0];
}

exports.findUserByEmail = async (email) => {  
    const result = await pool.query(
        `SELECT * FROM "users" WHERE email_user = $1`,
        [email.toLowerCase().trim()]
    )

    return result.rows[0];
}

exports.comparePassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword)
}

