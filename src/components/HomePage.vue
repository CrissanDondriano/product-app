<template>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <a class="navbar-brand" >
            <router-link to="/home" class="nav-link">Product Management</router-link>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <router-link to="/manage-users" class="nav-link">Manage Users</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/logout" class="nav-link">Logout</router-link>
                </li>
            </ul>
        </div>
    </div>
</nav>
<div class="container">
    <div class="row">
        <h1 class="title">PRODUCT DESCRIPTION</h1>
    </div>
    <br>
    <div class="row mt-2">
        <div class="col-md-6">
            <a @click="toggleCreateProducts" class="btn btn-primary">Create New Product</a>
        </div>
        <div class="col-md-6 d-flex justify-content-end">
            <input type="text" v-model="searchQuery" placeholder="Search..." @keyup.enter="searchProducts">
        </div>
    </div>
    <!-- Product table -->
    <div class="row mt-2 table-container">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th class="text-center" width="25%">Product Name</th>
                    <th class="text-center" width="30%">Description</th>
                    <th class="text-center" width="20%">Quantity</th>
                    <th class="text-center" width="25%">Price</th>
                    <th class="text-center" width="20%">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in paginatedProducts" :key="product.id">
                    <td class="text-center">{{ product.product_name }}</td>
                    <td class="text-center">{{ product.product_description }}</td>
                    <td class="text-center">{{ product.quantity }}</td>
                    <td class="text-center">{{ product.price }}</td>
                    <td class="text-center">
                        <button @click="editProductModal(product)" class="btn btn-primary">Edit</button>
                        <button @click="deleteProduct(product)" class="btn btn-danger">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Pagination buttons -->
        <div class="pagination-buttons">
            <button class="btn btn-primary" @click="previousPage" :disabled="currentPage === 1">Previous</button>
            <button class="btn btn-primary" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
    </div>
    <!-- Create, edit, delete modals -->
    <CreateProduct :visible="showCreateProducts" @update:visible="toggleCreateProducts" />
    <EditProduct :visible="showEditProductModal" :product="productToEdit" @update:visible="toggleEditProductModal" />
</div>
</template>

<script>
import CreateProduct from './CreateProduct.vue';
import EditProduct from './EditProduct.vue';
import axios from 'axios';

export default {
    name: 'HomePage',
    components: {
        CreateProduct,
        EditProduct,
    },
    data() {
        return {
            showCreateProducts: false,
            showEditProductModal: false,
            productToEdit: null,
            currentPage: 1,
            itemsPerPage: 10,
            searchQuery: ''
        }
    },
    computed: {
        products() {
            return this.$store.state.products;
        },
        totalPages() {
            return Math.ceil(this.products.length / this.itemsPerPage);
        },
        paginatedProducts() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = this.currentPage * this.itemsPerPage;
            return this.products.slice(startIndex, endIndex);
        }
    },
    methods: {
        fetchData() {
            this.$store.dispatch('refreshProducts');
        },
        searchProducts() {
            this.$store.dispatch('filteredProducts', this.searchQuery);
            this.currentPage = 1;
        },
        toggleCreateProducts() {
            this.showCreateProducts = !this.showCreateProducts;
            if (!this.showCreateProducts) {
                this.fetchData();
            }
        },
        toggleEditProductModal() {
            this.showEditProductModal = !this.showEditProductModal;
        },
        editProductModal(product) {
            this.productToEdit = product;
            this.showEditProductModal = true;
        },
        deleteProduct(product) {
            axios.delete(`${this.$store.state.apiUrl}/deleteProducts/${product.id}`)
                .then(() => {
                    this.fetchData();
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                    alert('Error deleting product. Please try again.');
                });
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        }
    }
}
</script>

<style scoped>
.navbar {
    background: linear-gradient(to right, #4facfe, #37cad1);
}

.navbar-brand {
    color: #ffffff;
    font-weight: bold;
}

.nav-link {
    color: #ffffff;
    font-weight: bold;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.nav-link:hover {
    background-color: #e9ecef;
}

.title {
    text-align: center;
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
    font-weight: bold;
}

.container {
    margin-top: 20px;
}

.logout-btn {
    color: #fff;
    background-color: #dc3545;
    padding: 10px 20px;
    border-radius: 5px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    display: inline-block;
    transition: background-color 0.3s;
}

.logout-btn:hover {
    background-color: #c82333;
}

.table-container {
    display: flex;
    flex-direction: column;
}

.table-custom {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.table-custom th,
.table-custom td {
    padding: 12px 15px;
    text-align: center;
    border: 1px solid #ddd;
}

.table-custom th {
    background-color: #f8f9fa;
    font-weight: bold;
}

.table-custom tr:nth-child(even) {
    background-color: #f2f2f2;
}

.table-custom tr:hover {
    background-color: #e9ecef;
}

.pagination-buttons {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.pagination-buttons button {
    margin: 0 5px;
}
</style>
