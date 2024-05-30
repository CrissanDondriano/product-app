<template>
  <div >
    <!-- Modal -->
    <div v-if="openClose" class="modal fade show" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style="display:block">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Create Post</h5>                
                    <button type="button" @click="OpenCloseModal()" class="btn-close" ></button>
                </div>
                <div class="modal-body">
                    <!-- Input field for the title -->
                    <div class="form-group">
                        <label for="title">Title:</label>
                        <input type="text" class="form-control" id="title" v-model="title">
                    </div>
                    <!-- Input field for the content -->
                    <div class="form-group mt-3">
                        <label for="content">Content:</label>
                        <textarea class="form-control" id="content" rows="3" v-model="content"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button"  @click="OpenCloseModal()" class="btn btn-secondary" >Close</button>
                    <button type="button"  @click="SaveNewPost()" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</div>

</template>

<script>
    import axios from 'axios';
    export default {
        name: "CreatePost",
        data() {
            return {
                openClose: this.visible,
                title: '',
                content: '',
                errors: null
            }
        },
        props: {
            visible: Boolean
        },
        methods: {
             OpenCloseModal() {
                this.openClose = !this.openClose
                this.$emit('update:visible', false); // Emit an event with the new value
                this.$emit('modal-closed'); // Emit an event indicating modal is closed
                // console.log("child " +this.openClose)
            },
            async SaveNewPost() {
                try {
                    // it will call the endpoint /newpost and create a new post. 
                    // The data will be sent in the body of the request  
                    const response = await axios.post(this.$store.state.apiUrl + '/newpost', {
                        title: this.title,
                        body: this.content,
                        user_id: localStorage.getItem('user_id')
                    });
                    // if the response status is 201 (created), it means the post was created successfully
                    if (response.status === 201) {
                        this.openClose = !this.openClose
                        this.$emit('update:visible', false); // Emit an event with the new value
                        this.$emit('modal-closed'); // Emit an event indicating modal is closed
                    }
                } catch (error) {
                    // Handle login error, show error message to the user
                    // the errors will be displayed in the template using v-if directives
                    alert(error.response.data.message);
                    this.errors = error.response.data.message;
                }
            }
        },
        watch: { 
            // watch for changes in the visible prop
            // and update the openClose variable accordingly
            visible: {
                // immediate: !this.openClose,
                handler(newVal, oldVal) {
                    this.openClose = newVal;
                    console.log('new ' +newVal+ '==' +oldVal)
                }
            }
        }
    }
</script>

<style scoped>
.modal-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
}

.modal-title {
    font-weight: bold;
    color: #343a40;
}


</style>