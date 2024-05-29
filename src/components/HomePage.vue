<template>
  <div class="container">
      <div class="row mt-2">
        <ul class="col-12 d-flex justify-content-end">
            <router-link to="/logout">Logout</router-link>
        </ul> 
      </div>
      <div class="row mt-2">
        <div class="col-md-6">
          <a @click="toggleCreatePost" class="btn btn-primary">Create New Post</a>
        </div>
        <div class="col-md-6 d-flex justify-content-end">
          <input type="text" v-model="searchQuery" placeholder="Search..." @keyup.enter="searchPosts"> 
        </div>
      </div>
      <div class="row mt-2 table-container">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th class="text-center" width="25%">Title</th>
                    <th class="text-center" width="30%">Author</th>
                    <th class="text-center" width="20%">Created At</th>
                    <th class="text-center" width="25%">Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- Loop through the posts and display them in the table -->
                <!-- v-for is a v-for directive that iterates over the paginatedPosts array and displays each post in the table -->
                <tr v-for="post in paginatedPosts" :key="post.id">
                    <td class="text-center">{{ post.title }}</td>
                    <td class="text-center">{{ post.user.name }}</td>
                    <td class="text-center">{{ formatDate(post.created_at) }}</td>
                    <td class="text-center">
                        <!-- Edit and Delete buttons -->
                        <!-- @click is a v-on directive that binds the click event to the toggleEditPost function -->
                        <a @click="toggleEditPost(post.id)" class="btn btn-primary ms-2">Edit</a>
                        
                        <!-- @click is a v-on directive that binds the click event to the toggleDeletePost function -->
                        <a @click="toggleDeletePost(post.id)" class="btn btn-danger ms-2">Delete</a>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="pagination-buttons">
          <button class="btn btn-primary" @click="previousPage" :disabled="currentPage === 1">Previous</button>
          <button class="btn btn-primary" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
      </div>
      <!-- Modal components -->
      <!-- the create post modal have a prop of visible and a prop of update:visible that is used to toggle the modal -->
      <CreatePost :visible="showCreatePost" @update:visible="toggleCreatePost"/>
      
      <!-- the edit post modal have a prop of visible and a prop of update:visible that is used to toggle the modal -->
      <EditPost :visible="showEditPost" @update:visible="toggleEditPost"/>
      
      <!-- the delete post modal have a prop of visible and a prop of update:visible that is used to toggle the modal -->
      <DeletePost :visible="showDeletePost" @update:visible="toggleDeletePost"/>

    </div>
  <!-- the router view is where all the routes are rendered -->
  <router-view/> 
</template>

<script>
import CreatePost from './CreatePost.vue';
import EditPost from './EditPost.vue';
import DeletePost from './DeletePost.vue';
export default {
  name: 'HomePage',
  components: {
    CreatePost,EditPost, DeletePost
  },
  data() {
    return {
      showCreatePost: false, // Boolean flag to control the visibility of the create post modal
      showEditPost: false, // Boolean flag to control the visibility of the edit post modal   
      showDeletePost: false, // Boolean flag to control the visibility of the delete post modal 
      currentPage: 1, // Current page number
      itemsPerPage: 10, // Number of items per page
      searchQuery: ''
    }
  },
  mounted() {
    // Fetch the posts on component upon mount
    this.fetchData();
  },
  computed: {
    posts() {
      // Return the posts array from the store
      return this.$store.state.posts
    },
    totalPages() {
      // Calculate the total number of pages
      return Math.ceil(this.$store.state.posts.length / this.itemsPerPage);
    },
    paginatedPosts() {
      // Calculate the start and end indices for the current page
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = this.currentPage * this.itemsPerPage;
      return this.$store.state.posts.slice(startIndex, endIndex);
    },
  },
  methods: {
    fetchData() {
      this.$store.getters.getPosts
          .then(posts => {
              this.posts = posts;
          })
          .catch(error => {
              console.error("Error fetching posts:", error);
          });      
    },
    searchPosts() {
      this.$store.dispatch('filteredPosts', this.searchQuery); // Dispatch the filteredPosts action. Action is defined in store.js
      this.currentPage = 1; //to reset the current page to 1
    },
    formatDate(dateString) {
      //this is a function that takes a date string and returns a formatted date
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    },
    toggleCreatePost() {
      this.showCreatePost = !this.showCreatePost;
      if (this.showCreatePost==false) {
        // If the modal is closed, refetch the posts data
        this.$store.dispatch('refreshPosts'); // Dispatch the refreshPosts action. Action is defined in store.js
      }
    },
    toggleEditPost(id) {
      this.$store.getters.getPost(id);
      this.showEditPost = !this.showEditPost;
      if (this.showEditPost==false) {
        // If the modal is closed, refetch the posts data
        this.$store.dispatch('refreshPosts'); // Dispatch the refreshPosts action. Action is defined in store.js
      }
    },
    toggleDeletePost(id) {
      this.$store.getters.getPost(id);
      this.showDeletePost = !this.showDeletePost;
      if (this.showDeletePost==false) {
        // If the modal is closed, refetch the posts data
        this.$store.dispatch('refreshPosts'); // Dispatch the refreshPosts action. Action is defined in store.js
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--; // Decrement the current page number
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++; // Increment the current page number
      }
    },
  }
}
</script>

<style scoped>
/* this style is scoped to the component and will apply to paginate the table */
.table-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-buttons {
  display: flex;
}

.pagination-buttons button {
  margin-right: 10px;
}
</style>

