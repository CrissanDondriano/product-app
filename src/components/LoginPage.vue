<template>
<div class="login-container">
    <div class="login-card">
        <h4>Enter your email and password</h4>
        <form @submit.prevent="loginUser" class="form">
            <div class="form-group">
                <input type="email" class="form-control" id="email" v-model="email" placeholder="Enter email" required @input="clearErrors">
                <small class="text-danger" v-if="errors">{{ errors }}</small>
            </div>
            <div class="form-group">
                <input type="password" class="form-control" id="password" v-model="password" placeholder="Password" required @input="clearErrors">
            </div>
            <button type="submit" class="btn">Login</button>
        </form>
        <p class="register-link">Don't have an account? <router-link to="/register">Register here!</router-link>
        </p>
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            email: '',
            password: '',
            errors: null
        };
    },
    methods: {
        async loginUser() {
            try {
                // Call login API
                const response = await axios.post(this.$store.state.apiUrl + '/login', {
                    email: this.email,
                    password: this.password
                });
                if (response.status === 201) {
                    // Successful login, handle token storage and redirection
                    localStorage.setItem('user_id', response.data.user_id);
                    localStorage.setItem('token', response.data.token);
                    // Fetch products upon successful login
                    await this.fetchProducts();
                    this.$router.push('/home');
                }
            } catch (error) {
                this.errors = error.response.data.message;
            }
        },
        async fetchProducts() {
            try {
                // Fetch products from backend
                const response = await axios.get(`${this.$store.state.apiUrl}/products`);
                // Update Vuex store with fetched products
                this.$store.commit('setProducts', response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        },
        clearErrors() {
            // Clear error message for the specified field
            // this method is called when the user types in the input field triggering the event handler 
            this.errors = null;
        }
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to right, #4facfe, #00f2fe);
    font-family: 'Roboto', sans-serif;
}

.login-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
}

h4 {
    margin-bottom: 1.5rem;
    font-weight: 700;
    color: #333;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.form-control:focus {
    border-color: #4facfe;
    box-shadow: 0 0 0 0.2rem rgba(79, 172, 254, 0.25);
}

.form-control:hover {
    border-color: #00f2fe;
}

.btn {
    width: 100%;
    padding: 0.75rem;
    background-color: #4facfe;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
}

.btn:hover {
    background-color: #00f2fe;
    transform: scale(1.05);
}

.register-link {
    margin-top: 1.5rem;
    font-size: 0.9rem;
}

.register-link a {
    color: #4facfe;
    text-decoration: none;
    font-weight: 700;
    transition: color 0.3s, text-decoration 0.3s;
}

.register-link a:hover {
    color: #00f2fe;
    text-decoration: underline;
}

.text-danger {
    font-size: 0.85rem;
    color: #e74c3c;
}
</style>
