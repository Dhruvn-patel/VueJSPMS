<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer expand-on-hover>
        <v-list>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            title="Sandra Adams"
            subtitle="sandra_a88@gmailcom"
          ></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-account-group">
            <router-link :to="{ name: 'users' }"> Users </router-link>
          </v-list-item>
          <v-list-item prepend-icon="mdi-playlist-edit">
            <router-link to="/Products"> Products</router-link>
          </v-list-item>
          <v-list-item prepend-icon="mdi-shape-plus-outline">
            <router-link to="/Category">Category </router-link>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-container>
          <v-btn @click="logoutFunction">LogOut</v-btn>
        </v-container>
      </v-navigation-drawer>

      <v-main>
        <v-container class="ma-auto">
          <router-view name="admin"> </router-view>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
export default {
  name: 'TheDashBoard',
  setup() {
    const router=useRouter()
    async function logoutFunction() {
      try {
        localStorage.clear();
        await axios.get(`${process.env.VUE_APP_URL}/signout`);
        Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: 'logout Successfylly !',
          customClass: 'swal-wide',
          showConfirmButton: false,
          timer: 1000,
        });
        return router.push('/login');
      } catch (error) {
        return Swal.fire({
          position: 'top-center',
          icon: 'warning',
          title: error.message,
          customClass: 'swal-wide',
          showConfirmButton: false,
          timer: 1000,
        });
      }
    }
    return { logoutFunction };
  },
};
</script>

<style></style>
