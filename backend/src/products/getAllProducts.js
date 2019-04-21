import { getProducts } from '../db/db';

export function getAllProducts(req, res) {
    getProducts((err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        }
        res.status(200).json(results.rows);
    })
}