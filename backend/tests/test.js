const request = require('supertest');

describe('Products', function() {
    let server;

    beforeEach(function() {
        server = require('../src/server');
    });

    after(function (done) {
        server.close(done);
    });

    it('responds to /status', function testHealth(done) {
        request(server)
            .get('/status')
            .expect(200, done);
    });

    it('responds to GET /products', function testGet(done) {
        request(server)
            .get('/products')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('responds to POST /products', function testPost(done) {
        let data = {
            asin: 'B0781Z7Y3S',
            category: 'test',
            rank: 1,
            dimensions: '1x1x1 inches'
        };

        request(server)
            .post('/products')
            .send(data)
            .set('Accept', 'application/json')
            .expect(201)
            .end((err) => {
                done(err);
            });
    });

    it('responds to DELETE /products/:asin', function testDelete(done) {
        request(server)
            .delete('/products/B0781Z7Y3S')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
});