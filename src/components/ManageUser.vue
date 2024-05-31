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
            <h1 class="title">MANAGE USER</h1>
        </div>
        <br>
        <div class="row mt-2">
            <div class="col-md-6">
                <a @click="toggleCreateProducts" class="btn btn-primary">Create New User</a>
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
                        <th class="text-center" width="25%">Name</th>
                        <th class="text-center" width="30%">Email</th>
                        <th class="text-center" width="20%">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in paginatedProducts" :key="user.id">
                        <td class="text-center">{{ user.name }}</td>
                        <td class="text-center">{{ user.email }}</td>
                        <td class="text-center">
                            <div class="action-buttons">
                                <button @click="editUserModal(user)" class="edit-btn">EDIT</button>
                                <button @click="deleteUser(user)" class="delete-btn">DELETE</button>
                                <button @click="viewUserModal(user)" class="view-btn">VIEW</button>
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
    
        <div v-if="showCreateUser" class="modal">
            <div class="modal-content">
                <span class="close" @click="toggleCreateUser">&times;</span>
                <h2>Create New User</h2>
                <form @submit.prevent="createUser">
                    <div class="form-group">
                        <label for="name">Name:</label>
                        <input type="text" id="name" v-model="newUser.name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" v-model="newUser.email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password:</label>
                        <input type="password" id="password" v-model="newUser.password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Create</button>
                </form>
            </div>
        </div>

        <div v-if="showEditUserModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="toggleEditUserModal">&times;</span>
                <h2>Edit User</h2>
                <form @submit.prevent="updateUser">
                    <div class="form-group">
                        <label for="edit-name">Name:</label>
                        <input type="text" id="edit-name" v-model="userToEdit.name" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-email">Email:</label>
                        <input type="email" id="edit-email" v-model="userToEdit.email" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-password">Password:</label>
                        <input type="password" id="edit-password" v-model="userToEdit.password">
                    </div>
                    <button type="submit" class="btn btn-primary">Update</button>
                </form>
            </div>
        </div>

        <div v-if="showViewUserModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="toggleViewUserModal">&times;</span>
                <h2>View User</h2>
                <p><strong>Name:</strong> {{ userToView.name }}</p>
                <p><strong>Email:</strong> {{ userToView.email }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ManageUser',
    data() {
        return {
            showCreateUser: false,
            showEditUserModal: false,
            showViewUserModal: false,
            newUser: {
                name: '',
                email: '',
                password: ''
            },
            userToEdit: null,
            userToView: null,
            currentPage: 1,
            itemsPerPage: 10,
            searchQuery: '',
            userImgUrl: 'https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png',
            logoutImgUrl: 'https://cdn-icons-png.freepik.com/256/992/992680.png?semt=ais_hybrid'
        }
    },
    computed: {
        users() {
            return this.$store.state.users || [];
        },
        totalPages() {
            return Math.ceil(this.users.length / this.itemsPerPage);
        },
        paginatedUsers() {
            if (!this.users) return [];
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = this.currentPage * this.itemsPerPage;
            return this.users.slice(startIndex, endIndex);
        }
    },
    methods: {
        fetchData() {
            this.$store.dispatch('refreshUsers');
        },
        searchUsers() {
            this.$store.dispatch('filteredUsers', this.searchQuery);
            this.currentPage = 1;
        },
        toggleCreateUser() {
            this.showCreateUser = !this.showCreateUser;
            if (!this.showCreateUser) {
                this.fetchData();
            }
        },
        toggleEditUserModal() {
            this.showEditUserModal = !this.showEditUserModal;
        },
        toggleViewUserModal() {
            this.showViewUserModal = !this.showViewUserModal;
        },
        createUser() {
            axios.post(`${this.$store.state.apiUrl}/store`, this.newUser)
                .then(() => {
                    this.toggleCreateUser();
                    this.fetchData();
                })
                .catch(error => {
                    console.error('Error creating user:', error);
                    alert('Error creating user. Please try again.');
                });
        },
        updateUser() {
            axios.put(`${this.$store.state.apiUrl}/update/${this.userToEdit.id}`, this.userToEdit)
                .then(() => {
                    this.toggleEditUserModal();
                    this.fetchData();
                })
                .catch(error => {
                    console.error('Error updating user:', error);
                    alert('Error updating user. Please try again.');
                });
        },
        editUserModal(user) {
            this.userToEdit = { ...user };
            this.showEditUserModal = true;
        },
        viewUserModal(user) {
            this.userToView = { ...user };
            this.showViewUserModal = true;
        },
        deleteUser(user) {
            axios.delete(`${this.$store.state.apiUrl}/destroy/${user.id}`)
                .then(() => {
                    this.fetchData();
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                    alert('Error deleting user. Please try again.');
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
    },
    mounted() {
        this.fetchData();
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
