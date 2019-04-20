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
        'INSERT INTO products (asin, category, rank, dimensions) VALUES ($1, $2, $3, $4)',
        [asin, category, rank, dimensions],
        callback
    );
}

const updateProduct = (req, res) => {
    const asin = req.params.asin;
    const { category, rank, dimensions } = req.body;

    pool.query(
        'UPDATE products SET category = $2, rank = $3, dimensions = $4 WHERE asin = $1',
        [asin, category, rank, dimensions],
        (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).send(`Product updated with ASIN: ${asin}`);
        }
    );
}

const deleteProduct = (req, res) => {
    const asin = req.params.asin;

    pool.query(
        'DELETE FROM products WHERE asin = $1', [asin], (err, results) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`Product deleted with ASIN: ${asin}`);
        }
    );
}

export {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
}