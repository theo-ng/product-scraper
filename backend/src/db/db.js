import 'dotenv/config';
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});

const getProducts = (callback) => {
    pool.query('SELECT * FROM products ORDER BY lastUpdated DESC', callback);
}

const createProduct = (product, callback) => {
    const { asin, category, rank, dimensions } = product;

    pool.query(
        `INSERT INTO products (asin, category, rank, dimensions)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (asin) DO UPDATE
        SET category = $2, rank = $3, dimensions = $4`,
        [asin, category, rank, dimensions],
        callback
    );
}

const deleteProduct = (asin, callback) => {
    pool.query('DELETE FROM products WHERE asin = $1', [asin], callback);
}

export {
    getProducts,
    createProduct,
    deleteProduct
}