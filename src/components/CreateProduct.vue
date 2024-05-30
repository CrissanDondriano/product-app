<template>
    <div>
      <div v-if="openClose" class="modal fade show" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style="display:block">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Create Product</h5>
              <button type="button" @click="OpenCloseModal" class="btn-close"></button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="productName">Product Name:</label>
                <input type="text" class="form-control" id="productName" v-model="productName">
              </div>
              <div class="form-group mt-3">
                <label for="description">Description:</label>
                <input type="text" class="form-control" id="description" v-model="description">
              </div>
              <div class="form-group mt-3">
                <label for="quantity">Quantity:</label>
                <input type="text" class="form-control" id="quantity" v-model="quantity">
              </div>
              <div class="form-group mt-3">
                <label for="price">Price:</label>
                <input type="text" class="form-control" id="price" v-model="price">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" @click="OpenCloseModal" class="btn btn-secondary">Close</button>
              <button type="button" @click="SaveNewProduct" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: "CreateProduct",
    data() {
      return {
        openClose: this.visible,
        productName: '',
        description: '',
        quantity: '',
        price: '',
        errors: null
      }
    },
    props: {
      visible: Boolean
    },
    methods: {
      OpenCloseModal() {
        this.openClose = !this.openClose;
        this.$emit('update:visible', this.openClose);
        this.$emit('modal-closed');
        this.resetForm();
      },
      async SaveNewProduct() {
        try {
          const response = await axios.post(`${this.$store.state.apiUrl}/newProducts`, {
            product_name: this.productName,
            product_description: this.description,
            quantity: this.quantity,
            price: this.price,
            user_id: localStorage.getItem('user_id')
          });
          if (response.status === 201) {
            this.openClose = false;
            this.$emit('update:visible', this.openClose);
            this.$emit('modal-closed');
            this.$store.dispatch('refreshProducts');
            this.resetForm();
          }
        } catch (error) {
          alert(error.response.data.message);
          this.errors = error.response.data.message;
        }
      },
      resetForm() {
        this.productName = '';
        this.description = '';
        this.quantity = '';
        this.price = '';
      }
    },
    watch: {
      visible(newVal) {
        this.openClose = newVal;
      }
    }
  }
  </script>
  