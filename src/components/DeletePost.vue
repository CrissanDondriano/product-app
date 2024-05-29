<template>
  <div >
    <!-- Modal -->
    <div v-if="openClose" class="modal fade show" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style="display:block">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Do you want to delete this post?</h5>                
                    <button type="button" @click="OpenCloseModal()" class="btn-close" ></button>
                </div>
                <div class="modal-body">
                    <!-- Input field for the title -->
                    <div class="form-group">
                        <label for="title">Title:</label>
                        <!-- the input is read-only to avoid editing the title. It is used to display the title thru this.$store.state.post.title  -->
                        <input type="text" class="form-control" readonly id="title" v-model="this.$store.state.post.title" >
                    </div>
                    <!-- Input field for the content -->
                    <div class="form-group mt-3">
                        <label for="content">Content:</label>
                        <!-- the textarea is read-only to avoid editing the content. It is used to display the content thru this.$store.state.post.body  -->
                        <textarea class="form-control" readonly id="content" rows="3" v-model="this.$store.state.post.body" ></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <!-- v-on:click="OpenCloseModal()" is used to close the modal dialog -->
                    <button type="button"  @click="OpenCloseModal()" class="btn btn-secondary" >Close</button>
                    <!-- v-on:click="DeletePost()" is used to delete the post -->
                    <button type="button"  @click="DeletePost()" class="btn btn-primary">Delete Post</button>
                </div>
            </div>
        </div>
    </div>
</div>

</template>

<script>
    import axios from 'axios';
    export default {
        data() {
            return {
                openClose: this.visible, // Initial value for openClose variable based on visible prop
                errors: null,
            }
        },
        props: {
            visible: Boolean, // Boolean prop for visibility of modal dialog
        },
        methods: {
             OpenCloseModal() {
                 this.openClose = !this.openClose
                //emit function is used to trigger custom events on a Vue instance or component. 
                //This allows you to communicate between child and parent components or between sibling components 
                //in a Vue.js application.
                this.$emit('update:visible', false); // Emit an event with the new value
                this.$emit('modal-closed'); // Emit an event indicating modal is closed
            },
            async DeletePost() {
                try {
                    const response = await axios.delete(this.$store.state.apiUrl + '/deletepost/'+this.$store.state.post.id, {                        
                    });
                    if (response.status === 204) {
                        this.openClose = !this.openClose
                        this.$emit('update:visible', false); // Emit an event with the new value
                        this.$emit('modal-closed'); // Emit an event indicating modal is closed
                    }
                } catch (error) {
                    alert(error.response.data.message);
                    // this.errors = error.response.data.message;
                }
            },
        },
        watch: { 
            visible: {
                // immediate: !this.openClose,
                handler(newVal) {
                    this.openClose = newVal;
                }
            }
        }
    }
</script>
