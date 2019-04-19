import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import handlers from './handlers/index';

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan('combined'));
app.use(cors());

app.get('/status', require('express-healthcheck')());

app.get('/products', handlers.getProducts);
app.post('/products/:asin', handles.createProduct);
app.put('/products/:asin', handlers.updateProduct);
app.delete('/products/:asin', handlers.removeProduct);

const server = app.listen(port, function() {
    console.log(`API is listening on port ${port}`);
});

export default app;