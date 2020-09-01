<template>
  <div id="app">
    <TheNavbar/>
    <div class="container">

      <router-view v-show="showPage" @ready="showPage = true"/>

      <AppSpiner v-show="!showPage" />

    </div>
    
  </div>
</template>

<script>
  import TheNavbar from '@/components/TheNavbar'
  import AppSpiner from '@/components/AppSpiner'

  export default {
    components: {
      TheNavbar,
      AppSpiner
    },

    data() {
      return {
        showPage: false
      }
    },

    created() {
      this.$router.beforeEach((to, from, next) => {
        this.showPage = false
        next()
      })
    }
  }
</script>

<style>

@import "assets/css/style.css";

</style>
