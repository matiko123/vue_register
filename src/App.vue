<template>
  <div id="app">
   <!-- form starts -->
   <form @submit.prevent="register">
   <div class="container mb-4 shadow">
  <div class="row">
    <div class="col-md-6">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" id="name" v-model="name" placeholder="Enter your name">
      </div>
    </div>
    <div class="col-md-6">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" v-model="email" placeholder="Enter your email">
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6">
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" v-model="password" placeholder="Enter your password">
      </div>
    </div>
    <div class="col-md-6">
      <div class="mb-3">
        <label for="password_confirmation" class="form-label">Confirm Password</label>
        <input type="password" class="form-control" v-model="password_confirmation" id="password_confirmation" placeholder="Confirm your password">
      </div>
    </div>
  </div>
  <button type="submit" class="btn btn-primary mb-2">Submit</button>
</div>
</form>
    <!-- form ends -->
    <table class="table table-bordered container shadow table-hover">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Email</th>
      <th>Created At</th>
      <th>Updated At</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="user in users" :key="user">
      <td>{{ user.id }}</td>
      <td>{{ user.name }}</td>
      <td>{{ user.email }}</td>
      <td>{{user.created_at}}</td>
      <td>{{ user.updated_at }}</td>
    </tr>

  </tbody>
</table>

  <!-- toast notificaiton starts -->
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 11">
      <div
        class="toast align-items-center text-dark border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        ref="toast"
        style="background-color: #afe8fa"
      >
        <div class="d-flex">
          <div class="toast-body">
            Registration successful! Redirecting to user/home...
          </div>
          <button
            type="button"
            class="btn-close btn-close-dark me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>   
    <!-- toast notification ends -->
  </div>


</template>

<script>

import axios from "axios";
import * as bootstrap from 'bootstrap';
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});
export default {
  name: 'App',
  components: {

  },

  data() {
    return {
      users: [],
      name:'',
      email:'',
      password:'',
      password_confirmation:''
    };
  },

  methods:{
    fetchUsers() {
      axiosInstance
        .get(`/users`)
        .then((response) => {
          if (Array.isArray(response.data.data)) {
            this.users = response.data.data;
            console.log('Users list :',this.users)
          } else {
            console.error("Invalid response format");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error.message);
        })
        .finally(() => {
    
        });
    },

    async register() {
      this.loading_spinner = true;
      try {
        const response = await axiosInstance.post("register",
          {
            name: this.name,
            email: this.email,
            password: this.password,
            password_confirmation: this.password_confirmation,
          }
        );

        if (response.data.success) {
          this.showToast("Registration successful! ");
        }
      } catch (error) {
    if (error.response && error.response.status === 422) {
      // Format the error messages
      let errorMessage = 'Oups! :';
      for (let field in error.response.data.errors) {
        errorMessage += `${error.response.data.errors[field].join(', ')}. `;
      }
      this.showToast(errorMessage); // Show formatted error message
    } else {
      console.error("Error:", error);
      this.showToast("An unexpected error occurred.");
    } 
      }finally {
        this.fetchUsers();
      }

    },
    showToast(message) {
     const toastElement = this.$refs.toast;
     toastElement.querySelector(".toast-body").innerText = message;
     const toast = new bootstrap.Toast(toastElement); // Use imported bootstrap
     toast.show();
    },
  },

  mounted() {
    this.fetchUsers();
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
