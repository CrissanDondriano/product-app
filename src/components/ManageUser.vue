<template>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <a class="navbar-brand">
            <router-link to="/home" class="nav-link">Product Management</router-link>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <router-link to="/manage-users" class="nav-link">Manage Users</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/logout" class="nav-link">Logout</router-link>
                </li>
            </ul>
        </div>
    </div>
</nav>
<div class="container">

</div>
</template>

<script>
export default {
    name: 'HomePage',

}
</script>

<style scoped>
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
}

.nav-link:hover {
    background-color: #e9ecef;
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
}

.table-custom th,
.table-custom td {
    padding: 12px 15px;
    text-align: center;
    border: 1px solid #ddd;
}

.table-custom th {
    background-color: #f8f9fa;
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
</style>
