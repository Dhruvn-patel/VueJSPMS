<template>
  <div>
    <v-dialog v-model="dialog1" class="pa-4" width="750" height="100vh">
      <v-card>
        <v-form
          class="pt-6"
          @submit.prevent="submit"
          v-model="valid"
          ref="form"
        >
          <v-card-title class="text-center">
            <span class="text-h5">Edit Product</span>
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
                    v-if="flag"
                    ref="imgPath"
                    accept=".png, .jpg, .jpeg"
                    type="file"
                    :rules="productRules.files"
                  ></v-text-field>
                  <v-card class="mx-auto" max-width="300" v-else>
                    <v-card-text class="d-flex justify-space-between">
                      <v-btn icon="mdi-close" @click="colseImg"> </v-btn>
                    </v-card-text>
                    <v-img
                      width="300"
                      contain
                      :aspect-ratio="16 / 9"
                      class="my-5 ml-auto"
                      :src="imgPath"
                    >
                    </v-img>

                    <v-divider class="mx-4"></v-divider>
                  </v-card>
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
              @click="dialog1 = false"
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
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="products"
      :server-items-length="products.length"
      :items-per-page="3"
      :search="search"
    >
      <template v-slot:[`item.image`]="{ item }">
        <v-img :src="item.selectable.image"> </v-img>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <div>
          <v-icon
            color="primary"
            icon="mdi-book-edit"
            @click="updateProduct(item.selectable)"
          ></v-icon>
          <v-icon
            color="error"
            icon="mdi-delete"
            @click="deleteProduct(item.selectable.id)"
          ></v-icon>
        </div>
      </template>
      <template v-slot:[`item.price`]="{ item }">
        <span>{{
          item.selectable.price.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            style: 'currency',
            currency: 'INR',
          })
        }}</span>
      </template>
      <template v-slot:[`item.Categories`]="{ item }">
        <span v-for="label in item.selectable.categoryNames" :key="label">
          <v-chip class="ma-2" label>{{ label.name }} </v-chip>
        </span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
import axios from 'axios';
import { productValidate } from '../helper/products/product.rules';
import { userValidate } from '../helper/user/user.rules';
export default {
  name: 'product-table',

  setup() {
    const products = ref([]);
    let form = ref('');
    let productData = ref(products.value);
    let dialog1 = ref(false);
    let flag = ref(false);
    const itemsPerPage = ref(5);
    const page = ref(1);
    const productname = ref('');
    const productdesc = ref('');
    const imgPath = ref('');
    const qty = ref('');
    const valid = ref(false);
    const price = ref(0);
    const categories = ref([]);
    const category = ref([]);
    const search = ref('');
    let selectedId;
    const headers = ref([
      {
        align: 'start',
        key: 'id',
        title: 'Product Id',
      },
      {
        title: 'ProductName',
        key: 'ProductName',
      },
      { title: 'description', key: 'description' },
      { title: 'image', key: 'image', sortable: false },
      { title: 'price', key: 'price' },
      { title: 'quantity', key: 'quantity' },
      { title: 'Categories', key: 'Categories', sortable: false },
      { title: 'Actions', key: 'actions', sortable: false },
    ]);

    onMounted(async () => {
      axios
        .get(
          `${process.env.VUE_APP_URL}/products/allProducts?page=1&pageSize=5`,
        )
        .then((data) => {
          products.value = data.data.data;
        });
      const { data } = await axios.get(
        `${process.env.VUE_APP_URL}/category/getCategory`,
      );
      category.value = data.data;
    });

    /* rules computed */
    const userRules = computed(() => {
      return userValidate;
    });
    const productRules = computed(() => {
      return productValidate;
    });
    /* methods */
    function colseImg() {
      flag.value = !flag.value;
    }
    async function submit() {
      let selectedValues = '';
      categories.value.map((data) => {
        selectedValues += ',' + data.id;
      });
      selectedValues = selectedValues.slice(1);
      // products/newAddProduct
      const validate = await form.value.validate();
      if (validate.valid) {
        if (flag.value) {
          let file = imgPath.value.files.item(0);
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = async (base64) => {
            console.log('inside bhai');
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
              const result = await axios.put(
                `${process.env.VUE_APP_URL}/products/updateproduct/${selectedId}`,
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
                title: 'Updated Product',
                customClass: 'swal-wide',
                showConfirmButton: false,
                timer: 1000,
              });
              dialog1.value = false;
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
        } else {
          const data = {
            file: imgPath.value,
            ProductName: productname.value,
            description: productdesc.value,
            price: price.value,
            quantity: qty.value,
            catagory: selectedValues,
            Id: selectedId,
          };
          console.log(data);
          try {
            const result = await axios.post(
              `${process.env.VUE_APP_URL}/products/updateproduct`,
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
              title: 'Updated Product',
              customClass: 'swal-wide',
              showConfirmButton: false,
              timer: 1000,
            });
            dialog1.value = false;
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
        }
      }
    }

    /* updateProduct   */
    function updateProduct(data) {
      selectedId = data.id;
      console.log(data);
      productname.value = data.ProductName;
      productdesc.value = data.description;
      qty.value = data.quantity;
      imgPath.value = data.image;
      price.value = data.price;
      categories.value = data.categoryNames;
      dialog1.value = true;
    }

    /* deleteProduct */
    async function deleteProduct(id) {
      console.log(id);
      try {
        // /products/deleteProduct
        await axios.delete(
          `${process.env.VUE_APP_URL}/products/deleteProduct/${id}`,
        );
        Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: 'deleted Product !',
          customClass: 'swal-wide',
          showConfirmButton: false,
          timer: 1000,
        });
      } catch (error) {
        return Swal.fire({
          icon: 'warning',
          title: error.messsage,
          customClass: 'swal-wide',
          showConfirmButton: false,
          timer: 1000,
        });
      }
    }

    return {
      userRules,
      productname,
      productdesc,
      qty,
      category,
      colseImg,
      search,
      price,
      imgPath,
      productRules,
      categories,
      form,
      updateProduct,
      productData,
      deleteProduct,
      products,
      dialog1,
      itemsPerPage,
      page,
      valid,
      submit,
      headers,
      flag,
    };
  },
};
</script>

<style scoped></style>
