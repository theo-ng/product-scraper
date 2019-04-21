import React, { Component } from 'react';
import axios from 'axios';
import _get from 'lodash.get';

class App extends Component {
    state = {
        products: [],
        error: {},
    }

    componentDidMount() {
        this._getProducts();
    }

    _getProducts = async () => {
        try {
            const data = await axios({
                method: 'get',
                url: 'http://localhost:8080/products'
            });

            if (_get(data, 'data.status') === 'Fail') {
                this.setState({ error: 'Error getting history'});
            } else {
                this.setState({ products: data.data });
            }
        } catch (res) {
            this.setState({ error: 'Error connecting to server'});
        }
    };

    _searchForAsin = async () => {
        try {
            const result = await axios({
                method: 'post',
                url: 'http://localhost:8080/products',
                data: { asin: this._asin }
            });

            if (_get(result, 'data.status') === 'Fail') {
                this.setState({ error: 'Error getting product information'});
            } else {
                this._getProducts();
            }
        } catch (res) {
            this.setState({ error: 'Error connecting to server'})
        }
    }

    render() {
        const { products } = this.state;

        return (
            <div>
                <div className="search">
                    <label>ASIN:</label>
                    <input
                        ref={(asin) => {
                            this._asin = asin;
                        }}
                    />
                    <button onClick={this._searchForAsin}>Search</button>
                </div>
                <div className="product-table">
                    <div className="headers">
                        <span>ASIN</span>
                        <span>Category</span>
                        <span>Rank</span>
                        <span>Dimensions</span>
                        <span>Last Updated</span>
                    </div>
                    {products.length > 0 &&
                        products.map((product) => (
                            <div className="product-row">
                                <span>{product.asin}</span>
                                <span>{product.category}</span>
                                <span>{product.rank}</span>
                                <span>{product.dimensions}</span>
                                <span>{product.lastupdated}</span>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default App;