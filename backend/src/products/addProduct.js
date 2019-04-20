import { createProduct } from '../db/db';
import async from 'async';
import request from 'request';
import cheerio from 'cheerio';

const BASE_URL = 'https://amazon.com/dp/';

/**
 * Get HTML for Amazon product by ASIN
 * @param {String} asin
 * @param {function} callback
 * @private
 */
function _requestProductByAsin(asin, callback) {
    request(`${BASE_URL}${asin}`, (err, res, html) => {
        if (err) {
            callback(err);
        }
        callback(null, html);
    });
}

/**
 * Parses the html body for useful information
 * @param {String} html
 * @param {function} callback
 */
function _parseResponse(html, callback) {
    const $ = cheerio.load(html);
    
}

export function addProducts(req, res) {
    async.waterfall([
        (next) => {
            _requestProductByAsin(asin, next)
        },
        (html, next) => {
            _parseResponse(html, next);
        }
    ], (err, conn) => {

    });
}