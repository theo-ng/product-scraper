import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { getProducts, createProduct, updateProduct, deleteProduct } from './db/db';

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('combined'));

app.use(cors());

app.get('/status', require('express-healthcheck')());

app.get('/products', getProducts);
app.post('/products/', createProduct);
app.put('/products/:asin', updateProduct);
app.delete('/products/:asin', deleteProduct);

const server = app.listen(port, function() {
    console.log(`API is listening on port ${port}`);
});

export default server;