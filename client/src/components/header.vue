<template>
  <v-toolbar app>
    <span class="d-flex d-sm-none">
      <v-toolbar-side-icon @click="sidebar = !sidebar"> </v-toolbar-side-icon>
    </span>
    <v-toolbar-title>
      <router-link :to="{ name: 'Home' }" class="ma-5 pa-5">
        <h1>
          {{ appTitle }}
        </h1>
      </router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>
    <v-toolbar-items class="d-none d-sm-flex">
      <v-row class="d-flex pr-5" flat>
        <v-col cols="auto mt-1">
          <v-switch
            inset
            color="info"
            v-model="darkMode"
            @change="toggleTheme()"
            :label="`It's ${darkMode ? 'Dark' : 'Light'}!`"
          ></v-switch>
        </v-col>
      </v-row>
      <v-btn flat :to="{ name: 'Cart' }" class="text-none" stacked>
        <v-badge color="info" :content="content">
          <v-icon color="primary" icon="mdi-cart-minus" class=""> </v-icon>
        </v-badge>
      </v-btn>
      <!-- <v-btn flat to="/"></v-btn> -->
      <v-btn flat @click="SignOutFunction" v-if="isLogin == true"
        >Log Out
      </v-btn>
      <v-btn flat :to="{ name: 'Login' }" v-else>Sign In </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { useStore } from 'vuex';
import axios from 'axios';
export default {
  name: 'TheHeader',
  setup() {
    const store = useStore();
    const router = useRouter();
    const appTitle = ref('TheShop');
    const sidebar = ref(false);
    const theme = useTheme();
    const darkMode = ref(false);

    const toggleTheme = () => {
      theme.global.name.value = darkMode.value ? 'dark' : 'light';
    };
    /* methods */
    const SignOutFunction = async () => {
      if (
        localStorage.getItem('cart') &&
        localStorage.getItem('cart').length > 0
      ) {
        const dataCart = JSON.parse(localStorage.getItem('cart'));
        const userId = JSON.parse(localStorage.getItem('loginUser')).userId;
        const data = { dataCart, userId, type: false };
        await axios.post(`${process.env.VUE_APP_URL}/cart/addIntoCart`, data, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
      }

      store.dispatch('LOG_OUT_FUNCTION');
      return router.push('/login');
    };
    const isLogin = computed(() => {
      return store.getters.isLogin;
    });

    const content = computed(() => {
      return store.getters['cartModule/cartItems'];
    });
    return {
      isLogin,
      appTitle,
      sidebar,
      darkMode,
      toggleTheme,
      SignOutFunction,
      content,
    };
  },
};
</script>

<style></style>
