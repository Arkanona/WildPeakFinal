const pg = require('pg')

const { Pool } = pg

const pool = new Pool({
    connectionString: process.env.DATABASE_URI
})

export default pool