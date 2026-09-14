const bcrypt = require('bcryptjs')
const pool = require('../config/db')

exports.createUser = async (name, email, password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const result = await pool.query(
        `INSERT INTO user (name, email, password)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, created_at`,
        [name, email.toLowerCase().trim(), hashedPassword]
    )

    return result.rows[0];
}

exports.findUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT * FROM user WHERE email = $1`,
        [email.toLowerCase().trim()]
    )

    return result.rows[0];
}

exports.comparePassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword)
}

