<template>
  <v-app>
    <v-header>
      <Header />
      <v-main>
        <v-container>
          <v-card
            class="d-flex flex-column border mb-2"
            v-for="order in res"
            :key="order"
          >
            <v-container class="d-flex">
              <span>Order Id : {{ order[0].id }}</span>
            </v-container>

            <v-card
              class="d-flex justify-content-between align-items-center"
              v-for="product in order"
              :key="product"
            >
              <v-container class="d-flex flex-row justify-content-end">
                <v-img
                  :src="product.image"
                  :width="200"
                  :height="200"
                  aspect-ratio="16/9"
                  contain
                >
                </v-img>
              </v-container>
              <v-container class="d-flex flex-column">
                <div>
                  <h2>{{ product.name }}</h2>
                </div>
                <div>
                  <B>Description:</B>
                  <p>{{ product.description }}</p>
                </div>
                <v-spacer></v-spacer>
                <div>
                  <B>Qty:</B>
                  <p>{{ product.qty }}</p>
                </div>
                <v-spacer></v-spacer>
                <div>
                  <B>Price:</B>
                  <p>
                    {{
                      product.price.toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                        style: 'currency',
                        currency: 'INR',
                      })
                    }}
                  </p>
                </div>
                <v-divider></v-divider>
                <div class="mt-2">
                  <B>TotalPrice:</B>
                  <p>
                    {{
                      product.total.toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                        style: 'currency',
                        currency: 'INR',
                      })
                    }}
                  </p>
                </div>
              </v-container>
            </v-card>
          </v-card>
        </v-container>
      </v-main>
    </v-header>
    <v-main>
      <v-card> </v-card>
    </v-main>
  </v-app>
</template>

<script>
import { onMounted, ref } from 'vue';
import Header from '../../components/header.vue';
import axios from 'axios';
import Swal from 'sweetalert2';
export default {
  name: 'OrderHistory',
  components: { Header },
  setup() {
    const orderData = ref([]);
    const productDetails = ref([]);
    const res = ref([]);
    onMounted(async () => {
      try {
        const { data } = await axios.get(
          `${process.env.VUE_APP_URL}/cart/history`,
        );
        console.log(data);
        orderData.value = data.data;
        const order = orderData.value;
        const prod = data.productdeatils;

        for (let i = 0; i < order.length; i++) {
          const ans = [];
          for (let j = 0; j < prod.length; j++) {
            if (order[i].id == prod[j].orderId) {
              const data = {
                id: order[i].id,
                orderId: prod[j].orderId,
                name: prod[j].Product.ProductName,
                description: prod[j].Product.description,
                image: prod[j].Product.image,
                price: prod[j].Product.price,
                qty: prod[j].quantity,
                total: prod[j].Product.price * prod[j].quantity,
                Totalorder: order[i].totalPrice,
              };
              ans.push(data);
            }
          }
          res.value.push(ans);
        }
        console.log(res.value);
        productDetails.value = data.productdeatils;
      } catch (error) {
        return Swal.fire({
          position: 'top-center',
          icon: 'warning',
          title: error.response.data.data,
          customClass: 'swal-wide',
          showConfirmButton: false,
          timer: 1000,
        });
      }
    });
    return {
      res,
      orderData,
      productDetails,
    };
  },
};
</script>

<style></style>
