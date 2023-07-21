<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
a {
  color: inherit;
  text-decoration: none;
}
.v-table {
  font-size: 20px !important;
  padding: 12px;
  height: 100vh !important;
}
</style>
