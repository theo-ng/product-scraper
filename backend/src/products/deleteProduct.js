import { deleteProduct as dbDeleteProduct } from '../db/db';

export function deleteProduct(req, res) {
    const asin = req.params.asin;

    dbDeleteProduct(asin, (err) => {
        if (err) {
            console.error(err);
        }
        res.status(200).send(`Product deleted with ASIN: ${asin}`);
    })
}