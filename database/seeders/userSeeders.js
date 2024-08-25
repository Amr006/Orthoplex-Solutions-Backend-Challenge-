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
INSERT INTO users (name, email, password, number_of_logins, last_login, role, verified, created_at, updated_at)
    VALUES 
    ('Admin', 'admin@gmail.com', '$2a$10$edH6/oXBNTjDN/4jVGvFkukhMGVudWfBPNJgnlOP/ovCztlQW.uy2', 10,  NOW() - INTERVAL '5 hours', 'admin', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Bob', 'bob@example.com', '$2a$10$edH6/oXBNTjDN/4jVGvFkukhMGVudWfBPNJgnlOP/ovCztlQW.uy2', 5,  NOW() - INTERVAL '2 months', 'user', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Charlie', 'charlie@example.com', '$2a$10$edH6/oXBNTjDN/4jVGvFkukhMGVudWfBPNJgnlOP/ovCztlQW.uy2', 30,  NOW() - INTERVAL '5 hours', 'user', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (email) DO NOTHING;

`;

(async () => {
    try {
        // Execute the SQL script
        await pool.query(sql);
        console.log('database seeded successfully.');
    } catch (err) {
        console.error('Error executing SQL', err.stack);
    } finally {
        // Close the pool
        await pool.end();
    }
})();