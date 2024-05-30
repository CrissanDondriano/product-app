<template>
  <div class="container">
    <div class="row mt-2">
      <ul class="col-12 d-flex justify-content-end">
        <router-link to="/logout">Logout</router-link>
      </ul>
    </div>
    <div class="row mt-2">
      <div class="col-md-6">
        <a @click="toggleCreateProducts" class="btn btn-primary">Create New Product</a>
      </div>
      <div class="col-md-6 d-flex justify-content-end">
        <input type="text" v-model="searchQuery" placeholder="Search..." @keyup.enter="searchProducts">
      </div>
    </div>
    <div class="row mt-2 table-container">
      <table class="table table-striped">
        <thead>
          <tr>
            <th class="text-center" width="25%">Product Name</th>
            <th class="text-center" width="30%">Description</th>
            <th class="text-center" width="20%">Quantity</th>
            <th class="text-center" width="25%">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedProducts" :key="product.id">
            <td class="text-center">{{ product.product_name }}</td>
            <td class="text-center">{{ product.product_description }}</td>
            <td class="text-center">{{ product.quantity }}</td>
            <td class="text-center">{{ product.price }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination-buttons">
        <button class="btn btn-primary" @click="previousPage" :disabled="currentPage === 1">Previous</button>
        <button class="btn btn-primary" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
    <CreateProduct :visible="showCreateProducts" @update:visible="toggleCreateProducts" />
  </div>
</template>

<script>
import CreateProduct from './CreateProduct.vue';
export default {
  name: 'HomePage',
  components: {
    CreateProduct
  },
  data() {
    return {
      showCreateProducts: false,
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: ''
    }
  },
  mounted() {
    this.fetchData();
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
.table-container {
  display: flex;
  flex-direction: column;
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
