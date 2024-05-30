<template>
    <div>
      <!-- Modal -->
      <div v-if="openClose" class="modal fade show" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style="display:block">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Edit Product</h5>
              <button type="button" @click="openCloseModal()" class="btn-close"></button>
            </div>
            <div class="modal-body">
              <!-- Input field for the product name -->
              <div class="form-group">
                <label for="productName">Product Name:</label>
                <input type="text" class="form-control" id="productName" v-model="editedProduct.product_name">
              </div>
              <!-- Input field for the description -->
              <div class="form-group mt-3">
                <label for="description">Description:</label>
                <input type="text" class="form-control" id="description" v-model="editedProduct.product_description">
              </div>
              <!-- Input field for the quantity -->
              <div class="form-group mt-3">
                <label for="quantity">Quantity:</label>
                <input type="number" class="form-control" id="quantity" v-model="editedProduct.quantity">
              </div>
              <!-- Input field for the price -->
              <div class="form-group mt-3">
                <label for="price">Price:</label>
                <input type="number" class="form-control" id="price" v-model="editedProduct.price">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" @click="openCloseModal()" class="btn btn-secondary">Close</button>
              <button type="button" @click="updateProduct()" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script>
import axios from 'axios';

export default {
    name: 'EditProduct',
    props: {
        visible: Boolean,
        product: Object,
    },
    data() {
        return {
        openClose: this.visible,
        editedProduct: { ...this.product }, // Create a local copy of the product prop
        errors: null,
        };
    },
    methods: {
        openCloseModal() {
        this.openClose = !this.openClose;
        this.$emit('update:visible', this.openClose);
        this.$emit('modal-closed');
        },
        async updateProduct() {
        try {
            const response = await axios.put(`${this.$store.state.apiUrl}/update/Products/${this.editedProduct.id}`, {
            product_name: this.editedProduct.product_name,
            product_description: this.editedProduct.product_description,
            quantity: this.editedProduct.quantity,
            price: this.editedProduct.price,
            });
            if (response.status === 200) {
            this.openClose = false;
            this.$emit('update:visible', this.openClose);
            this.$emit('modal-closed');
            this.$store.dispatch('refreshProducts');
            }
        } catch (error) {
            alert(error.response.data.message);
            this.errors = error.response.data.message;
        }
        },
    },
    watch: {
        visible(newVal) {
        this.openClose = newVal;
        // Update the editedProduct when the prop changes
        this.editedProduct = { ...this.product };
        },
    },
};
</script>

  