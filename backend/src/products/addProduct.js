import { createProduct } from '../db/db';
import async from 'async';
import request from 'superagent';
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
    request(`${BASE_URL}${asin}`).then((res) => {
        callback(null, res);
    }).catch(err => {
        if (err) {
            callback({
                err,
                verbiage: err.status === 404 ? 'Invalid ASIN' : 'Error finding product',
            });
        }
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
    const $ = cheerio.load(html.text);
    let error;

    const _findCategory = () => {
        let cat = '';
        try {
            cat = $('#wayfinding-breadcrumbs_feature_div .a-link-normal').first().text().trim();
            console.log('Cat:', cat);
        } catch (err) {
            error = {
                error: err,
                verbiage: 'Error parsing category'
            };
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
            console.log('Rank:', rank);
        } catch (err) {
            error = {
                error: err,
                verbiage: 'Error parsing rank'
            };
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
            dims = $(container).text().match(DIM_REGEX)[0].replace(/^.*Dimensions\D*/gi, '').trim();
            console.log('Dims:', dims);
        } catch (err) {
            error = {
                error: err,
                verbiage: 'Error parsing dimensions'
            };
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

    if (error) {
        callback(error);
        return;
    }
    callback(null, product);
    return;
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
            res.status(500).send(err);
        } else {
            res.status(201).send(`Product added with ASIN: ${asin}`);
        }
    });
}