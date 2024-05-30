<template>
<div class="registration-container">
    <div class="registration-card">
        <h4>Registration Form</h4>
        <form @submit.prevent="registerUser">
            <div class="form-group">
                <input type="text" class="form-control" id="name" v-model="name" @input="clearErrors('name')" placeholder="Enter name" required>
            </div>
            <div class="form-group">
                <input type="email" class="form-control" id="email" v-model="email" @input="clearErrors('email')" placeholder="Enter email" required>
                <!-- this is the error message will be shown when the user types invalid email -->
                <small class="text-danger" v-if="errors.email">{{ errors.email[0] }}</small>
            </div>
            <div class="form-group">
                <input type="password" class="form-control" id="password" v-model="password" @input="clearErrors('password')" placeholder="Password" required>
                <!-- this is the error message will be shown when the user types invalid password or not confirm -->
                <small class="text-danger" v-if="errors.password">{{ errors.password[0] }}</small>
            </div>
            <div class="form-group">
                <input type="password" class="form-control" id="confirm" v-model="confirm" placeholder="Confirm Password" required>
            </div>
            <button type="submit" class="btn">Register</button>
        </form>
        <p class="login-link">Already have an account? <router-link to="/">Login here!</router-link>
        </p>
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            name: '',
            email: '',
            password: '',
            confirm: '',
            errors: {} // Initialize an empty object to store error messages
        };
    },
    methods: {
        async registerUser() {
            try {
                // Call the register API endpoint using Axios
                // the /register is an API route that define in the backend using Laravel
                const response = await axios.post(this.$store.state.apiUrl + '/register', {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    password_confirmation: this.confirm
                });
                if (response.status === 201) {
                    // After successful registration, handle redirection or other actions
                    // Clear the form fields after successful registration
                    this.name = '';
                    this.email = '';
                    this.password = '';
                    this.confirm = '';
                    alert('Registration successful');
                    // Redirect to the login page
                    this.$router.push('/');
                }
            } catch (error) {
                // Handle registration error, show error message to the user
                this.errors = error.response.data.errors;
            }
        },
        //the field param is the name of the input field that triggered the error
        clearErrors(field) {
            // Clear error message for the specified field
            // this method is called when the user types in the input field triggering the event handler 
            this.errors[field] = null;
        }
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.registration-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to right, #4facfe, #00f2fe);
    font-family: 'Roboto', sans-serif;
}

.registration-card {
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

.text-danger {
    font-size: 0.85rem;
    color: #e74c3c;
}

.login-link {
    margin-top: 1.5rem;
    font-size: 0.9rem;
}

.login-link a {
    color: #4facfe;
    text-decoration: none;
    font-weight: 700;
    transition: color 0.3s, text-decoration 0.3s;
}

.login-link a:hover {
    color: #00f2fe;
    text-decoration: underline;
}

</style>
