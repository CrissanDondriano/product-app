<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand">
                <router-link to="/home" class="nav-link no-hover">PRODUCT MANAGEMENT</router-link>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <router-link to="/manage-users" class="nav-link no-hover">
                            <img :src="userImgUrl" alt="User Image" class="user-img">
                            <i class="fas fa-user"></i>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/logout" class="nav-link logout-link">
                            <img :src="logoutImgUrl" alt="Logout Image" class="logout-img">
                          
                        </router-link>
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
            <table class="table table-custom">
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
                            <div class="action-buttons">
                                <button @click="editProductModal(product)" class="edit-btn"> EDIT </button>
                                <button @click="deleteProduct(product)" class="delete-btn"> DELETE </button>


                            </div>
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
            searchQuery: '',
            userImgUrl: 'https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png', // replace with the actual path to the user image
            logoutImgUrl: 'https://cdn-icons-png.freepik.com/256/992/992680.png?semt=ais_hybrid' // replace with the actual path to the logout image
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

.navbar-nav {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

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
    display: flex;
    align-items: center; /* Center icon and text vertically */
}

.nav-link i {
    margin-right: 8px; /* Space between icon and text */
}

.no-hover:hover {
    background-color: inherit;
}

.user-img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 8px; /* Space between image and text */
}

.logout-link {
    display: flex;
    align-items: center;
}

.logout-img {
    width: 20px;
    height: 20px;
    margin-right: 8px; /* Space between image and text */
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

.button-icon {
    width: 20px;
    height: 20px;
    margin-right: 5px; /* Adjust spacing between icon and text */
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
    border: 1px solid #ddd; /* Add border to the table */
}

.table-custom th,
.table-custom td {
    padding: 12px 15px;
    text-align: center;
    border: 2px solid #000000; /* Add border to table cells */
}

.table-custom th {
    background-color: #99c2eb;
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

.action-buttons {
    display: flex;
    gap: 10px; 
}

.button-icon {
    width: 20px;
    height: 20px;
    margin-right: 5px; 
    filter: invert(100%); 
}

.button-icon {
    width: 40px;
    height: 40px;
    margin-right: 2px; 
    filter: invert(100%); 
}


.edit-btn:hover {
    background-color: #27a2dc; 
}


.delete-btn:hover {
    background-color: #f40303; 
}

.edit-btn,
.delete-btn {
    background-color: transparent; 
    border: 2px solid transparent; 
    padding: 5px 15px; 
    position: relative; 
}

.edit-btn:hover,
.delete-btn:hover {
    border-color: #ccc; 
}


.edit-btn::before,
.delete-btn::before {
    content: ''; 
    position: absolute; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%; 
    border: 2px solid transparent; 
    transition: border-color 0.3s; 
}

.edit-btn:hover::before,
.delete-btn:hover::before {
    border-color: #ffffff;
}

</style>
