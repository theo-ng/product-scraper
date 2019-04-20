import 'dotenv/config';
const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

const getProducts = (callback) => {
    pool.query('SELECT * FROM products ORDER BY lastUpdated DESC', callback);
}

const createProduct = (req, res) => {
    const { asin, category, rank, dimensions } = req.body;

    pool.query(
        'INSERT INTO products (asin, category, rank, dimensions) VALUES ($1, $2, $3, $4)',
        [asin, category, rank, dimensions],
        (err, results) => {
            if (err) {
                throw err;
            }
            res.status(201).send(`Product added with ASIN: ${asin}`);
        }
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