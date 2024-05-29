<template>
  <div >
    <!-- Modal -->
    <div v-if="openClose" class="modal fade show" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style="display:block">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Edit Post</h5>                
                    <button type="button" @click="OpenCloseModal()" class="btn-close" ></button>
                </div>
                <div class="modal-body">
                    <!-- Input field for the title -->
                    <div class="form-group">
                        <label for="title">Title:</label>
                        <!-- Input field for the title and by default it will be the title of the post -->
                        <!-- v-model is used to bind the value of the input field to the title of the post -->
                        <!-- @input is used to update the title of the post -->
                        <input type="text" class="form-control" id="title" v-model="this.$store.state.post.title" @input="updateTitle" >
                    </div>
                    <!-- Input field for the content -->
                    <div class="form-group mt-3">
                        <label for="content">Content:</label>
                        <!-- Input field for the content and by default it will be the content of the post -->
                        <!-- v-model is used to bind the value of the input field to the content of the post -->
                        <!-- @input is used to update the content of the post -->
                        <textarea class="form-control" id="content" rows="3" v-model="this.$store.state.post.body" @input="updateContent" ></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <!-- the @click="OpenCloseModal()" is used to close the modal when the close button is clicked -->
                    <button type="button"  @click="OpenCloseModal()" class="btn btn-secondary" >Close</button>
                    <!-- the @click="UpdatePost()" is used to update the post when the save button is clicked -->
                    <button type="button"  @click="UpdatePost()" class="btn btn-primary">Save changes</button>
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
                openClose: this.visible,
                title: this.$store.state.post.title, // Bind the title of the post to the input field
                content: this.$store.state.post.body, // Bind the content of the post to the input field
                errors: null,
            }
        },
        props: {
            visible: Boolean, // Prop for the visibility of the modal
        },
        methods: {
            updateTitle() {
                //the updateTitle method is used to update the title of the post thru dispatching an action to the store
                this.$store.dispatch('updateTitle', this.$store.state.post.title)
            },
            updateContent() {
                //the updateContent method is used to update the content of the post thru dispatching an action to the store
                this.$store.dispatch('updateContent', this.$store.state.post.body)
            },
             OpenCloseModal() {
                 this.openClose = !this.openClose
                //emit function is used to trigger custom events on a Vue instance or component. 
                //This allows you to communicate between child and parent components or between sibling components 
                //in a Vue.js application.
                this.$emit('update:visible', false); // Emit an event with the new value
                this.$emit('modal-closed'); // Emit an event indicating modal is closed
            },
            async UpdatePost() {
                try {
                    //the axios.put method is used to update the post
                    //it will call the endpoint /updatepost/{id} with the title and content of the post
                    const response = await axios.put(this.$store.state.apiUrl + '/updatepost/'+this.$store.state.post.id, {
                        title: this.$store.state.post.title,
                        body: this.$store.state.post.body,
                        user_id: localStorage.getItem('user_id')
                    });
                    //the response status will be 200 if the post is updated. 200 is usually a success status for updating a post
                    if (response.status === 200) {
                        console.log(this.title, this.content)
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
