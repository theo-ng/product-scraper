const expect = require('chai').expect;
import server from '../src/server';

let req = {
    body: {},
}

let res = {
    sendCalledWith: '',
    send: function(arg) {
        this.sendCalledWith = arg;
    }
};

describe('Products', function() {
    describe('Get Products', function() {
        it('Should return a list of all products', function() {
            //
        });
    });
});