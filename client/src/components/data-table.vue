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
            <span class="text-h5">Edit Profile</span>
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
                <v-col cols="12">
                  <v-text-field
                    v-model.trim="email"
                    label="Email*"
                    :customRules="userRules.email"
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
      :items="users"
      :search="search"
      :server-items-length="users.length"
      :items-per-page="5"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <div>
          <v-icon
            color="primary"
            icon="mdi-book-edit"
            @click="updateUser(item.selectable)"
          ></v-icon>
          <v-icon
            color="error"
            icon="mdi-delete"
            @click="deleteUser(item.selectable.id)"
          ></v-icon>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { computed, onMounted, onUpdated, ref } from 'vue';
import 'jquery/dist/jquery.min.js';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';

import { userValidate } from '../helper/user/user.rules';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'TheDataTable',
  props:{
  rolesItem:{
    type:Array
  }
},
  setup(props) {

    console.log(props.rolesItem);
    const users = ref([]);
    let form = ref('');
    let userData = ref([]);
    userData = users.value;
    let dialogFlag1 = ref(false);
    const itemsPerPage = ref(5);
    const page = ref(1);
    const valid = ref(false);
    const name = ref('');
    const email = ref('');
    let selectedId;
    const store = useStore();
    const router = useRouter();
    const search = ref('');
    const headers = ref([
      {
        align: 'start',
        key: 'id',
        title: 'User Id',
      },
      { title: 'Name', key: 'name' },
      { title: 'email', key: 'email' },
      { title: 'Roles', key: 'rolesId' },
      { title: 'Actions', key: 'actions', sortable: false },
    ]);
    /* hooks */

    onMounted(() => {
    
      axios.get(`${process.env.VUE_APP_URL}/users/getUsers`).then((data) => {
        users.value = data.data.data;
        users.value.map((user) => {
          if (user.rolesId == 1) user.rolesId = 'Admin';
          else if (user.rolesId == 2) user.rolesId = 'User';
          else user.rolesId = 'SubAdmin';
        });
      });
    });
    const userRules = computed(() => {
      return userValidate;
    });

    /* methods */
    function updateUser(data) {
      console.log(data);
      dialogFlag1.value = true;
      name.value = data.name;
      email.value = data.email;
      selectedId = data.id;
      // users/update
    }

    async function submit() {
      console.log('submit', selectedId);
      const validate = await form.value.validate();
      if (validate.valid) {
        const data = {
          name: name.value,
          email: email.value,
        };
        try {
          await axios.patch(
            `${process.env.VUE_APP_URL}/users/update/${selectedId}`,
            data,
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            },
          );
          Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: 'Updated User !',
            customClass: 'swal-wide',
            showConfirmButton: false,
            timer: 1000,
          });
          dialogFlag1.value = false;
        } catch (error) {
          if (error.response.status === 403) {
            console.log('error', error);
            store.dispatch('LOG_OUT_FUNCTION');
            return router.push('/login');
          }
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
    async function deleteUser(id) {
      try {
        await axios.delete(`${process.env.VUE_APP_URL}/users/remove/${id}`);
        Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: 'deleted User !',
          customClass: 'swal-wide',
          showConfirmButton: false,
          timer: 1000,
        });
      } catch (error) {
        console.log('id', error);

        if (error.response.status === 403) {
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

    // onUpdated(() => {
    //   updateUser;
    // });
    return {
      submit,
      form,
      search,
      valid,
      dialogFlag1,
      users,
      headers,
      userData,
      page,
      itemsPerPage,
      userRules,
      name,
      email,
      updateUser,
      deleteUser,
    };
  },
};
</script>

<style scoped></style>
