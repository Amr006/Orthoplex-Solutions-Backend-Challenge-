const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});

const sql = `

    CREATE TYPE  user_role AS ENUM ('admin', 'user');

    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(100),
        number_of_logins INTEGER DEFAULT 0,
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        role user_role DEFAULT 'user',
        verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS verifyOtp (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100),
        otp VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

`;

(async () => {
    try {
        // Execute the SQL script
        await pool.query(sql);
        console.log('Tables created successfully.');
    } catch (err) {
        console.error('Error executing SQL', err.stack);
    } finally {
        // Close the pool
        await pool.end();
    }
})();