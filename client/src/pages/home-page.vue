<template>
  <v-app>
    <!-- Header -->
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
      <v-text-field
        hide-details
        prepend-icon="mdi-magnify"
        single-line
        v-model="serachValue"
        @input="searchValueFunction"
      ></v-text-field>
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
        <v-btn flat :to="{ name: 'orderHistory' }" class="text-none" stacked>
          <v-icon
            color="primary"
            icon="mdi-order-bool-descending-variant"
            class=""
          >
          </v-icon>
        </v-btn>

        <v-btn flat @click="SignOutFunction" v-if="isLogin == true"
          >Log Out
        </v-btn>
        <v-btn flat :to="{ name: 'Login' }" v-else>Sign In </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-layout>
      <v-navigation-drawer>
        <v-divider></v-divider>
        <v-list nav dense>
          <v-list-item>
            <v-list-item-title class="title text-h6">Filters</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-radio-group v-model="selectedValue" @change="sortFunction">
              <v-radio label="Ascending" value="asc" selected></v-radio>
              <v-radio label="Descending" value="desc"></v-radio>
            </v-radio-group>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-title class="text-h6 py-3">Category</v-list-item-title>
            <v-checkbox
              class="pa-0 ma-0"
              v-for="availableWeekday in category"
              v-model="categories"
              :key="availableWeekday"
              :value="availableWeekday.id"
              :label="availableWeekday.name"
              @update:modelValue="categoryWiseProduct"
            ></v-checkbox>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item class="mt-2">
            <v-list-item-title class="text-h6 py-3">Price</v-list-item-title>

            <v-range-slider
              v-model="price"
              step="100"
              :min="100"
              :max="300000"
              thumb-label="always"
              class="pa-3"
              @update:modelValue="priceWiseProduct"
            ></v-range-slider>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <v-content>
          <v-container class="ma-8 d-flex flex-wrap" v-if="products.length > 0">
            <v-card
              application
              class="mx-5 my-3 d-flex flex-column ma-2 pa-2"
              max-width="500"
              v-for="product in products"
              :key="product"
            >
              <v-img
                contain
                class="mx-auto"
                :src="product.image"
                aspect-ratio="1"
                :width="250"
                :height="250"
              ></v-img>

              <v-card-item>
                <v-card-title>{{ product.ProductName }}</v-card-title>
              </v-card-item>

              <v-card-text>
                <div class="my-4 text-subtitle-1">
                  {{
                    product.price.toLocaleString('en-IN', {
                      maximumFractionDigits: 2,
                      style: 'currency',
                      currency: 'INR',
                    })
                  }}
                </div>
                <div>{{ product.description }}</div>
              </v-card-text>
              <v-divider class="mx-4 mb-1"></v-divider>
              <v-card-title>Categories</v-card-title>
              <div class="px-4">
                <v-chip-group>
                  <v-chip
                    v-for="category in product.categoryNames"
                    :key="category"
                  >
                    {{ category }}
                  </v-chip>
                </v-chip-group>
              </div>

              <v-card-actions class="my-3">
                <v-btn @click="addToCart(product)" width="100%" color="primary">
                  Add To Cart
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-container>
          <v-container v-else class="d-flex justify-center align-center">
            <div class="text-center">Not Found Data</div>
          </v-container>
        </v-content>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import { computed, onMounted, onUpdated, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useTheme } from 'vuetify/lib/framework.mjs';

export default {
  name: 'TheHomePage',
  setup() {
    let price = ref([100, 200000]);
    const store = useStore();
    const router = useRouter();
    const categories = ref();
    const serachValue = ref([]);
    const category = ref([]);
    const products = ref([]);
    let filterArr = ref([]);
    const selectedValue = ref('asc');
    let cart = ref([]);
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
        try {
          await axios.post(
            `${process.env.VUE_APP_URL}/cart/addIntoCart`,
            data,
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            },
          );
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
      store.dispatch('LOG_OUT_FUNCTION');
      return router.push('/login');
    };
    const isLogin = computed(() => {
      return store.getters.isLogin;
    });
    const content = computed(() => {
      return store.getters['cartModule/cartItems'];
    });

    /* methods */
    const searchValueFunction = async () => {
      /*
        searchvalue frontend
      console.log(serachValue.value);
      filterArr.value = products.value.filter((freight) => {
        var values = Object.values(freight);
        values.splice(3, 1); // remove img
        var flag = false;
        values.forEach((val) => {
          // console.log(val);
          if (val.toString().indexOf(serachValue.value) > -1) {
            flag = true;
            return;
          }
        });
        if (flag) return freight;
      });
      console.log('filteredList', filterArr.value); */

      try {
        const productData = await axios.get(
          `${process.env.VUE_APP_URL}/products/listProduct`,
          {
            params: {
              sortType: selectedValue.value,
              searchValue: serachValue.value,
              id: categories.value ? categories.value.id : 0,
              priceStart: price.value[0],
              priceStop: price.value[1],
            },
          },
        );
        products.value = productData.data.data.products;
      } catch (error) {
        return error;
      }
    };

    const increase = (id) => {
      store.dispatch('cartModule/INC', id);
    };
    const descrease = (id) => {
      console.log('desc');
      store.dispatch('cartModule/DESC', id);
    };

    /* store */

    cart = store.getters['cartModule/addToCart'];
    console.log('cart', cart);
    const addToCart = (values) => {
      if (values) {
        try {
          values = {
            ...values,
            quantity: 1,
          };
          store.dispatch('cartModule/ADD_CART', values);
          Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: 'Added into Cart',
            customClass: 'swal-wide',
            showConfirmButton: false,
            timer: 1000,
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            position: 'top-center',
            icon: 'warning',
            title: error.message,
            customClass: 'swal-wide',
            showConfirmButton: false,
            timer: 1000,
          });
        }
      }
    };

    /* hooks */
    onMounted(async () => {
      try {
        const { data } = await axios.get(
          `${process.env.VUE_APP_URL}/category/getCategory`,
        );
        console.log(data);
        category.value = data.data;
      } catch (error) {
        console.log(error);
        return Swal.fire({
          position: 'top-center',
          icon: 'warning',
          title: error.response.data.data,
          customClass: 'swal-wide',
          showConfirmButton: false,
          timer: 1000,
        });
      }

      /* cart restore */
      //   const resultData = await axios.get(
      //     `${process.env.VUE_APP_URL}/cart/getCartData`,
      //   );

      //   if (resultData.data.data.listCartData.length > 0) {
      //     console.log('resultData', resultData.data);
      //     window.localStorage.setItem(
      //       'cart',
      //       JSON.stringify(resultData.data.data.listCartData),
      //     );
      //     window.localStorage.setItem(
      //       'cartCount',
      //       JSON.stringify(resultData.data.data.listCartData.length),
      //     );

      //     window.localStorage.setItem(
      //       'totalPay',
      //       JSON.stringify(resultData.data.data.totalRestoreCart),
      //     );
      //   }
      const productData = await axios.get(
        `${process.env.VUE_APP_URL}/products/listProduct`,
        {
          params: {
            sortType: 'asc',
            searchValue: '',
            id: 0,
            priceStart: price.value[0],
            priceStop: price.value[1],
          },
        },
      );
      products.value = productData.data.data.products;
      console.log('productData', productData.data.data.products);
    });

    onUpdated(() => {
      // console.log('adas', categories);
      categoryWiseProduct();
      sortFunction();
      searchValueFunction();
      priceWiseProduct();
    });

    /* sort frontend */
    const sortFunction = async () => {
      try {
        const productData = await axios.get(
          `${process.env.VUE_APP_URL}/products/listProduct`,
          {
            params: {
              sortType: selectedValue.value,
              searchValue: '',
              id: categories.value,
              priceStart: price.value[0],
              priceStop: price.value[1],
            },
          },
        );
        products.value = productData.data.data.products;
      } catch (error) {
        console.log(error);
        return error;
      }
    };
    const categoryWiseProduct = async () => {
      try {
        console.log('categories ==>', categories.value);
        const productData = await axios.get(
          `${process.env.VUE_APP_URL}/products/listProduct`,
          {
            params: {
              sortType: 'asc',
              searchValue: '',
              id: categories.value,
              priceStart: price.value[0],
              priceStop: price.value[1],
            },
          },
        );
        products.value = productData.data.data.products;
        console.log('productData', productData.data.data.products);
      } catch (error) {
        return error;
      }
    };
    const priceWiseProduct = async () => {
      try {
        console.log('price ==>', price.value);
        const productData = await axios.get(
          `${process.env.VUE_APP_URL}/products/listProduct`,
          {
            params: {
              sortType: 'asc',
              searchValue: '',
              id: categories.value,
              priceStart: price.value[0],
              priceStop: price.value[1],
            },
          },
        );
        products.value = productData.data.data.products;
        console.log('productData', productData.data.data.products);
      } catch (error) {
        return error;
      }
    };
    return {
      priceWiseProduct,
      category,
      categories,
      products,
      cart,
      serachValue,
      addToCart,
      increase,
      descrease,
      categoryWiseProduct,
      searchValueFunction,
      sortFunction,
      filterArr,
      selectedValue,
      isLogin,
      appTitle,
      sidebar,
      darkMode,
      toggleTheme,
      SignOutFunction,
      content,
      price,
    };
  },
};
</script>

<style scoped></style>
