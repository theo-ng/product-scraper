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
    request(`${BASE_URL}${asin}`, (err, res, body) => {
        if (err) {
            callback({
                err,
                verbiage: 'Error finding a product for that ASIN',
            });
        }
        callback(null, body);
    });
}

/**
 * Parses the html body for useful information
 * @param {String} html
 * @param {function} callback
 * @private
 */
function _parseResponse(html, callback) {
    const $ = cheerio.load(html);

    const _findCategory = () => {
        return $('#wayfinding-breadcrumbs_feature_div .a-link-normal').first().text().trim();
    }

    const _findRank = () => {
        return $('#SalesRank .value').text().match(/#\d+\sin[\w\s]+/gi)[0].trim();
    }

    const _findDimensions = () => {
        return $('.size-weight .value').last().text();
    }

    const category = _findCategory();
    const rank = _findRank();
    const dimensions = _findDimensions();

    console.log(category);
    console.log(rank);
    console.log(dimensions);
}

export function addProduct(req, res) {
    const asin = req.body.asin;

    async.waterfall([
        (next) => {
            _requestProductByAsin(asin, next)
        },
        (html, next) => {
            _parseResponse(html, next);
        },
        // (product, next) => {
        //     createProduct(product, next);
        // }
    ], (err, results) => {
        if (err) {
            throw err;
        }
        console.log('bleepbloop')
        // res.status(201).send(`Product added with ASIN: ${asin}`);
    });
}