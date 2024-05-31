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
    <div class="row mt-2">
        <div class="col-md-6">
            <button @click="createUser" class="btn btn-primary">Create New User</button>
        </div>
        <div class="col-md-6 d-flex justify-content-end">
            <input type="text" v-model="searchQuery" placeholder="Search..." @keyup.enter="searchUsers">
        </div>
    </div>
    <div class="container mt-5">

        <table class="table table-custom">
            <thead>
                <tr>
                    <th class="text-center" width="25%">Name</th>
                    <th class="text-center" width="30%">Email</th>
                    <th class="text-center" width="20%">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td class="text-center">{{ user.name }}</td>
                    <td class="text-center">{{ user.email }}</td>
                    <td class="text-center">
                        <div class="action-buttons">
                            <button @click="editUser(user)" class="edit-btn"> EDIT </button>
                            <button @click="deleteUser(user.id)" class="delete-btn"> DELETE </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal for creating/updating post -->
        <div v-if="showUserModal" class="modal show d-block" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ editingUser ? 'Edit User' : 'New User' }}</h5>
                        <button type="button" class="btn-close" @click="closeUserModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveUser">
                            <div class="mb-3">
                                <label for="name" class="form-label">Name</label>
                                <input type="text" v-model="userForm.name" class="form-control" id="postTitle" required>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="text" v-model="userForm.email" class="form-control" id="postTitle" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="text" v-model="userForm.password" class="form-control" id="postTitle" required>
                            </div>
                            <button type="submit" class="btn btn-primary">{{ editingUser ? 'Update' : 'Create' }}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Alert for successful creation -->
        <div v-if="showCreateSuccess" class="alert alert-success alert-dismissible fade show" role="alert">
            User created successfully!
            <button type="button" class="btn-close" @click="dismissCreateAlert" aria-label="Close"></button>
        </div>

        <!-- Alert for successful editing -->
        <div v-if="showEditSuccess" class="alert alert-success alert-dismissible fade show" role="alert">
            User edited successfully!
            <button type="button" class="btn-close" @click="dismissEditAlert" aria-label="Close"></button>
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
            users: [],
            showUserModal: false,
            editingUser: false,
            showCreateSuccess: false,
            showEditSuccess: false,
            showDeleteConfirm: false,
            deletingUserId: null,
            userForm: {
                name: '',
                email: '',
                password: '',
            },
            userImgUrl: 'https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png',
            logoutImgUrl: 'https://cdn-icons-png.freepik.com/256/992/992680.png?semt=ais_hybrid'
        };
    },
    async created() {
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            try {
                const response = await axios.get(this.$root.$data.apiUrl + '/user');
                this.users = response.data;
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        },
        createUser() {
            this.editingUser = false;
            this.userForm = {
                name: '',
                email: '',
                password: '',
            };
            this.showUserModal = true;
        },
        editUser(post) {
            this.editingUser = true;
            this.userForm = {
                id: post.id,
                name: post.name,
                email: post.email,
                password: post.password,
            };
            this.showUserModal = true;
        },
        async saveUser() {
            try {
                if (this.editingUser) {
                    await axios.put(this.$root.$data.apiUrl + '/update/User/' + this.userForm.id, this.userForm);
                    this.showEditSuccess = true;
                } else {
                    await axios.post(this.$root.$data.apiUrl + '/newUser', this.userForm);
                    this.showCreateSuccess = true;
                }
                this.closeUserModal();
                this.fetchUsers();
            } catch (error) {
                console.error('Error saving post:', error);
            }
        },
        async deleteUser(userId) {
            try {
                await axios.delete(this.$root.$data.apiUrl + '/deleteUser/' + userId);
                this.fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        },
        closeUserModal() {
            this.showUserModal = false;
        },
        dismissCreateAlert() {
            this.showCreateSuccess = false;
        },
        dismissEditAlert() {
            this.showEditSuccess = false;
        }
    },
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
    align-items: center;
    /* Center icon and text vertically */
}

.nav-link i {
    margin-right: 8px;
    /* Space between icon and text */
}

.no-hover:hover {
    background-color: inherit;
}

.user-img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 8px;
    /* Space between image and text */
}

.logout-link {
    display: flex;
    align-items: center;
}

.logout-img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    /* Space between image and text */
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
    margin-right: 5px;
    /* Adjust spacing between icon and text */
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
    border: 1px solid #ddd;
    /* Add border to the table */
}

.table-custom th,
.table-custom td {
    padding: 12px 15px;
    text-align: center;
    border: 2px solid #000000;
    /* Add border to table cells */
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
