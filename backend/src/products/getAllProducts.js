import { getProducts } from '../db/db';

export function getAllProducts(req, res) {
    getProducts((err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).json(results.rows);
    })
}