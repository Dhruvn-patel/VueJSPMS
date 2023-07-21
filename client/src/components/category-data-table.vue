<template>
  <div>
    <v-dialog v-model="dialogFlag1" class="pa-4" width="700" height="100vh">
      <v-card>
        <v-form
          class="pt-6"
          @submit.prevent="submit"
          v-model="valid"
          ref="form"
        >
          <v-card-title class="text-center">
            <span class="text-h5">Edit Category</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model.trim="name"
                    label="Name*"
                    :rules="userRules.name"
                    required
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="dialogFlag1 = false"
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
      :items="category"
      :search="search"
      :server-items-length="category.length"
      :items-per-page="5"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <div>
          <v-icon
            color="primary"
            icon="mdi-book-edit"
            @click="updateCategory(item.selectable)"
          >
          </v-icon>
          <v-icon
            color="error"
            icon="mdi-delete"
            @click="deleteCategory(item.selectable.id)"
          ></v-icon>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import 'jquery/dist/jquery.min.js';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import { userValidate } from '../helper/user/user.rules';
import Swal from 'sweetalert2';
import axios from 'axios';
export default {
  name: 'category-data-table',
  setup() {
    const category = ref([]);
    let form = ref('');
    let dialogFlag1 = ref(false);
    const itemsPerPage = ref(5);
    const page = ref(1);
    const valid = ref(false);
    const name = ref('');
    const search = ref('');
    let selectedId;
    const headers = ref([
      {
        align: 'start',
        key: 'id',
        title: 'User Id',
      },
      { title: 'CategoryName', key: 'name' },
      { title: 'Actions', key: 'actions', sortable: false },
    ]);

    /* hooks */

    onMounted(() => {
      axios
        .get(`${process.env.VUE_APP_URL}/category/AllCategories`)
        .then((data) => {
          category.value = data.data.data;
        });
    });
    const userRules = computed(() => {
      return userValidate;
    });

    function updateCategory(data) {
      console.log(data);
      dialogFlag1.value = true;
      name.value = data.name;
      selectedId = data.id;
    }
    async function deleteCategory(id) {
      try {
        await axios.delete(
          `${process.env.VUE_APP_URL}/category/deleteCategory/${id}`,
        );

        Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: 'deleted Category !',
          customClass: 'swal-wide',
          showConfirmButton: false,
          timer: 1000,
        });
      } catch (error) {
        return Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: 'Something wrong  !',
          customClass: 'swal-wide',
          showConfirmButton: false,
          timer: 1000,
        });
      }
    }

    async function submit() {
      console.log('submit', selectedId);
      const validate = await form.value.validate();
      if (validate.valid) {
        const data = {
          name: name.value,
        };
        try {
          axios.patch(
            `${process.env.VUE_APP_URL}/category/updateCategory/${selectedId}`,
            data,
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            },
          );
          Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: 'Updated Category !',
            customClass: 'swal-wide',
            showConfirmButton: false,
            timer: 1000,
          });
          dialogFlag1.value = false;
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
    }
    return {
      submit,
      form,
      valid,
      dialogFlag1,
      headers,
      userRules,
      name,
      search,
      updateCategory,
      deleteCategory,
      category,
    };
  },
};
</script>

<style></style>
