<template>
  <v-app>
    <v-container class="ma-8">
      <v-row class="mb-7">
        <v-dialog v-model="dialog" class="pa-4" width="750" height="100vh">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" class="ma-auto" v-bind="props">
              Create product
            </v-btn>
          </template>
          <v-card>
            <v-form
              class="pt-6"
              @submit.prevent="submit"
              v-model="valid"
              ref="form"
            >
              <v-card-title class="text-center">
                <span class="text-h5">Add Product</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model.trim="productname"
                        label="productname*"
                        :rules="productRules.name"
                        required
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model.trim="productdesc"
                        label="Description*"
                        :customRules="productRules.description"
                        required
                      >
                      </v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        ref="imgPath"
                        accept=".png, .jpg, .jpeg"
                        type="file"
                        :rules="productRules.files"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model.trim="price"
                        type="number"
                        label="Price*"
                        :rules="productRules.amount"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model.trim="qty"
                        :rules="productRules.qty"
                        type="number"
                        label="qty*"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        multiple
                        label="Select Categories*"
                        :rules="productRules.select"
                        v-model="categories"
                        :items="category"
                        item-title="name"
                        item-value="id"
                        name="category"
                        required
                        persistent-hint
                        return-object
                        single-line
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="dialog = false"
                >
                  Close
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" type="submit">
                  Save
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify="center">
        <productDataTableVue />
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { productValidate } from '../../helper/products/product.rules';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

import productDataTableVue from '../../components/product-data-table.vue';
export default {
  name: 'TheProducts',
  components: {
    productDataTableVue,
  },
  setup() {
    const productname = ref('');
    const productdesc = ref('');
    const dialog = ref(false);
    const imgPath = ref('');
    const qty = ref('');
    const valid = ref(false);
    const categories = ref([]);
    const price = ref(0);
    const form = ref('');
    const router = useRouter();
    let category = ref([]);

    /*computed */

    onMounted(async () => {
      const { data } = await axios.get(
        `${process.env.VUE_APP_URL}/category/getCategory`,
      );

      category.value = data.data;
      console.log(category.value);
    });
    /* rules computed */
    const productRules = computed(() => {
      return productValidate;
    });

    async function submit() {
      // console.log(
      //   'categories',
      //   productname.value,
      //   productdesc.value,
      //   imgPath.value,
      //   qty.value,
      //   categories.value,
      //   price.value,
      // );

      let selectedValues = '';
      categories.value.map((data) => {
        selectedValues += ',' + data.id;
      });
      selectedValues = selectedValues.slice(1);
      console.log(selectedValues);

      // products/newAddProduct
      const validate = await form.value.validate();
      if (validate.valid) {
        let file = imgPath.value.files.item(0);
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async (base64) => {
          const base64String = reader.result;
          const img = base64.currentTarget.result;
          const data = {
            file: img,
            ProductName: productname.value,
            description: productdesc.value,
            price: price.value,
            quantity: qty.value,
            catagory: selectedValues,
          };

          try {
            const result = await axios.post(
              `${process.env.VUE_APP_URL}/products/newproduct`,
              data,
              {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
              },
            );
            console.log('result', result);
            Swal.fire({
              position: 'top-center',
              icon: 'success',
              title: 'Created Product',
              customClass: 'swal-wide',
              showConfirmButton: false,
              timer: 1000,
            });
            dialog.value = false;
          } catch (error) {
            if (error.response.status === 409) {
              valid.value = true;
              return Swal.fire({
                icon: 'warning',
                title: error.response.data.errmsg,
                customClass: 'swal-wide',
                showConfirmButton: false,
                timer: 1000,
              });
            }
          }
        };
      }
    }

    /* methods */

    return {
      dialog,
      productname,
      productdesc,
      imgPath,
      qty,
      categories,
      price,
      form,
      productRules,
      submit,
      category,
    };
  },
};
</script>

<style></style>
