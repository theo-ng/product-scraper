import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { getAllProducts, addProduct, deleteProduct } from './products/index';

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('combined'));

app.use(cors());

app.use('/status', require('express-healthcheck')());

app.get('/products', getAllProducts);
app.post('/products/', addProduct);
app.delete('/products/:asin', deleteProduct);

const server = app.listen(port, function() {
    console.log(`API is listening on port ${port}`);
});

module.exports = server;