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
    })
});