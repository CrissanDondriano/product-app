import Vuex from 'vuex'
import axios from 'axios'

export const store = new Vuex.Store({
    state: {
        apiUrl: 'http://127.0.0.1:8000/api',
        products: [],
        product: {},
        searchQuery: '',
    },

    getters: {
        getProducts(state) {
            return state.products;
        },
        getProduct: (state) => (id) => {
            return state.products.find(product => product.id === id);
        }
    },

    mutations: {
        setProducts(state, products) {
            state.products = products;
        },
        setProduct(state, product) {
            state.product = product;
        },
        updateProduct(state, product) {
            const index = state.products.findIndex(p => p.id === product.id);
            if (index !== -1) {
                state.products.splice(index, 1, product);
            }
        }
    },
    actions: {
        async refreshProducts({ commit }) {
            try {
                const response = await axios.get(`${this.state.apiUrl}/products`);
                commit('setProducts', response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        },
        async filteredProducts({ commit }, searchQuery) {
            try {
                const response = await axios.get(`${this.state.apiUrl}/products?search=${searchQuery}`);
                commit('setProducts', response.data);
            } catch (error) {
                console.error("Error filtering products:", error);
            }
        },
    }
});