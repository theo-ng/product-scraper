import { createProduct } from '../db/db';
import async from 'async';
import request from 'request';
import cheerio from 'cheerio';

const BASE_URL = 'https://amazon.com/dp/';
const RANK_REGEX = /#[\d,]+/gi;
const DIM_REGEX = /Product Dimensions.*\s*(.*inches)\s/gi;

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
 * @param {String} asin
 * @param {String} html
 * @param {function} callback
 * @private
 */
function _parseResponse(asin, html, callback) {
    const $ = cheerio.load(html);

    const _findCategory = () => {
        let cat = '';
        try {
            cat = $('#wayfinding-breadcrumbs_feature_div .a-link-normal').first().text().trim();
        } catch (err) {
            callback({
                err,
                verbiage: 'Could not find category',
            });
        }
        return cat;
    }

    const _findRank = () => {
        let rank = '';

        try {
            if ($('#SalesRank').length > 0) {
                rank = $('#SalesRank').text().match(RANK_REGEX)[0].replace(/[#,]/gi, '');
            } else {
                rank = $('#productDetails_detailBullets_sections1').text().match(RANK_REGEX)[0].replace(/[#,]/gi, '');
            }
        } catch (err) {
            callback({
                err,
                verbiage: 'Could not find rank',
            });
        }
        return rank;
    }

    const _findDimensions = () => {
        let dims = '';
        let container = '#prodDetails';

        if ($(container).length === 0) {
            container = '#detailBullets';
        }

        try {
            dims = $(container).text().match(DIM_REGEX)[0].replace(/^.*Dimensions.*\D/gi, '').trim();
        } catch (err) {
            callback({
                err,
                verbiage: 'Could not find dimensions',
            });
        }
        return dims;
    }

    const category = _findCategory();
    const rank = _findRank();
    const dimensions = _findDimensions();

    const product = {
        asin,
        rank,
        category,
        dimensions
    };

    callback(null, product);
}

export function addProduct(req, res) {
    const asin = req.body.asin;

    async.waterfall([
        (next) => {
            _requestProductByAsin(asin, next)
        },
        (html, next) => {
            _parseResponse(asin, html, next);
        },
        (product, next) => {
            createProduct(product, next);
        }
    ], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500);
        }
        res.status(201).send(`Product added with ASIN: ${asin}`);
    });
}