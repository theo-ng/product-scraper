import React, { Component } from 'react';
import axios from 'axios';
import _get from 'lodash.get';
import './App.css';
import moment from 'moment-timezone';

class App extends Component {
    state = {
        products: [],
        error: '',
        asin: '',
        loading: false,
    }

    componentDidMount() {
        this._getProducts();
    }

    _handleInputChange = (e) => {
        this.setState({ asin: e.target.value });
    }

    _getProducts = async () => {
        this.setState({ loading: true });
        try {
            const data = await axios({
                method: 'get',
                url: 'http://localhost:8080/products'
            });

            if (_get(data, 'data.status') === 'Fail') {
                this.setState({
                    error: 'Error getting history',
                    loading: false,
                });
            } else {
                this.setState({
                    products: data.data,
                    loading: false,
                });
            }
        } catch (res) {
            this.setState({ error: 'Error connecting to server'});
        }
    };

    _searchForAsin = async () => {
        const { asin } = this.state;

        this.setState({ loading: true });

        try {
            const result = await axios({
                method: 'post',
                url: 'http://localhost:8080/products',
                data: { asin }
            });

            if (_get(result, 'data.status') === 'Fail') {
                this.setState({
                    error: 'Error getting product information',
                    loading: false,
                });
            } else {
                this._getProducts();
            }
        } catch (res) {
            this.setState({ error: 'Error connecting to server'})
        }
    }

    _removeProductHistory = async (asin) => {
        try {
            const result = await axios({
                method: 'delete',
                url: `http://localhost:8080/products/${asin}`,
            });

            if (_get(result, 'data.status') === 'Fail') {
                this.setState({
                    error: `Error removing product with asin: ${asin}`,
                });
            } else {
                this._getProducts();
            }
        } catch (res) {
            this.setState({ error: 'Error connecting to server'})
        }
    }

    render() {
        const { products, loading, error } = this.state;

        return (
            <div className="app">
                <h2>Amazon Product Scraper</h2>
                <div className="search">
                    {loading
                        ? <p>Processing...</p>
                        : [
                            <label>ASIN:</label>,
                            <input
                                onChange={this._handleInputChange}
                                ref={(asin) => {
                                    this._asin = asin;
                                }}
                            />,
                            <button onClick={this._searchForAsin}>Search</button>
                        ]
                    }
                </div>
                {error &&
                    <div className="error">{error}</div>
                }
                <div className="product-table">
                    <div className="headers">
                        <h4 className="asin">ASIN</h4>
                        <h4 className="cat">Category</h4>
                        <h4 className="rank">Rank</h4>
                        <h4 className="dim">Dimensions</h4>
                        <h4 className="timestamp">Last Updated</h4>
                    </div>
                    {products.length > 0
                        ? products.map((product) => (
                            <div className="product-row" key={product.asin}>
                                <span className="asin">{product.asin || 'N/A'}</span>
                                <span className="cat">{product.category || 'N/A'}</span>
                                <span className="rank">{product.rank || 'N/A'}</span>
                                <span className="dim">{product.dimensions || 'N/A'}</span>
                                <span className="timestamp">{moment(product.lastupdated).format('LLL')}</span>
                                <button className="delete-btn" onClick={() => this._removeProductHistory(product.asin)}>
                                    <i className="material-icons">delete</i>
                                </button>
                            </div>
                        ))
                        : (
                            <div className="product-row empty">
                                <span className="asin">N/A</span>
                                <span className="cat">N/A</span>
                                <span className="rank">N/A</span>
                                <span className="dim">N/A</span>
                                <span className="timestamp">N/A</span>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default App;