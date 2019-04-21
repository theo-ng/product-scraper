import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
    componentDidMount() {
        this._getProducts();
    }

    _getProducts = async () => {
        const data = await axios({
            method: 'get',
            url: 'http://localhost:8080/products'
        });

        this.setState({ products: data.products });
    };

    render() {
        return (
            <div>
                <input></input>
                <button></button>
            </div>
        );
    }
}

export default App;