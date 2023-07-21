<template>
  <div>
    <Header />
    <v-app class="">
      <v-main class="mx-auto">
        <v-container class="pa-6 my-5 border d-flex flex-column">
          <div>
            <h1 class="text-uppercase font-weight-normal">shopping bag</h1>
          </div>
          <div class="font-weight-normal">items: {{ cartItem }}</div>
          <v-spacer></v-spacer>
          <div>
            Total Sum :
            {{
              totalPay.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                style: 'currency',
                currency: 'INR',
              })
            }}
          </div>
          <div v-if="cart.length > 0">
            <div
              class="d-flex flex-row justify-content-between align-items-center pa-10 border-bottom mobile"
              v-for="product in cart"
              :key="product"
            >
              <div class="d-flex border">
                <div class="row">
                  <v-icon
                    color="primary"
                    icon="mdi-window-close"
                    @click="removeToCart(product.id)"
                  >
                  </v-icon>
                </div>
                <!-- <v-btn @click="removeToCart(product.id)"> &times;</v-btn> -->
                <div class="d-flex flex-row align-items-center">
                  <v-img :src="product.image" :width="150" contain />
                  <div class="d-flex flex-column mx-7 border pa-5 ma-4">
                    <div class="py-2">
                      <div>{{ product.ProductName }}</div>
                    </div>

                    <div>
                      Price :
                      {{
                        product.price.toLocaleString('en-IN', {
                          maximumFractionDigits: 2,
                          style: 'currency',
                          currency: 'INR',
                        })
                      }}
                    </div>
                    <div class="py-2">
                      <v-icon
                        color="primary"
                        icon="mdi-minus"
                        @click="descrease(product.id)"
                      >
                      </v-icon>
                      <!-- <v-btn @click="">-</v-btn> -->
                      <span class="px-md-3 px-1" id="quantity">
                        <span class="quantity">{{ product.quantity }}</span>
                      </span>
                      <!-- <v-btn @click="increase(product.id)"> + </v-btn> -->
                      <v-icon
                        color="primary"
                        icon="mdi-plus"
                        @click="increase(product.id)"
                      >
                      </v-icon>
                    </div>
                    <div class="py-2">
                      Total: ₹<span
                        >{{ product.price * product.quantity }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <v-btn color="primary" @click="addIntoCart">Place Order</v-btn>
            </div>
          </div>
          <div v-else class="empty">
            <div class="text-center">
              <p class="mx-auto h-25">Cart is Empty</p>
            </div>
          </div>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import Header from '../../components/header.vue';
import { useStore } from 'vuex';
import { computed, onMounted, onUpdated, ref } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
export default {
  name: 'TheCart',
  components: {
    Header,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    let cart = ref([]);
    let cartItem = ref(0);
    let totalPay = ref(0);
    /* store */
    cart = computed(() => {
      return store.getters['cartModule/addToCart'];
    });
    cartItem = computed(() => {
      return store.getters['cartModule/cartItems'];
    });
    totalPay = computed(() => {
      return store.getters['cartModule/cartTotal'];
    });
    const increase = (id) => {
      store.dispatch('cartModule/INC', id);
    };

    const descrease = (id) => {
      store.dispatch('cartModule/DESC', id);
    };
    const removeToCart = (id) => {
      store.dispatch('cartModule/REMOVE_FROM_CART', id);
    };

    const addIntoCart = async () => {
      if (localStorage.getItem('cart') != null) {
        const dataCart = JSON.parse(localStorage.getItem('cart'));
        const userId = JSON.parse(localStorage.getItem('loginUser')).userId;
        const data = { dataCart, userId, type: true };

        await axios.post(`${process.env.VUE_APP_URL}/cart/addIntoCart`, data, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        const totalPrice = localStorage.getItem('totalPay');
        localStorage.setItem('order', JSON.stringify(dataCart));
        localStorage.setItem('orderTotalPrice', JSON.stringify(totalPrice));
        localStorage.setItem('cart', JSON.stringify([]));
        localStorage.setItem('cartCount', JSON.stringify(0));
        localStorage.setItem('totalPay', JSON.stringify(0));
        Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: 'add into cart',
          customClass: 'swal-wide',
          showConfirmButton: false,
          timer: 1000,
        });

        router.push('/order');
      }
    };
    return {
      cart,
      increase,
      descrease,
      cartItem,
      totalPay,
      removeToCart,

      addIntoCart,
    };
  },
};
</script>

<style scoped>
.empty {
  height: 100vh;
  width: 30vw;
}
</style>
