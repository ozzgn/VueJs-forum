<template>

<div class="col-full push-top">
  <h1>Welcome to the Forum</h1>
  <CategoryList :categories="categories"/>
</div>

</template>

<script>
  import CategoryList from '@/components/CategoryList'

  export default {
    components: {
      CategoryList
    },

    computed: {
      categories() {
        return Object.values(this.$store.state.categories)
      }
    },

    beforeCreate() {
      console.log('😊 beforeCreate! ozz', this.categories)
    },

    created() {
      console.log('😊 created', this.categories)
    },

    beforeMount() {
      console.log('😊 beforeMount', this.categories)
    },

    mounted() {
      console.log('😊 mounted', this.categories, this.$el.innerText)
    },

    beforeDestroy() {
      console.log('😊 beforeDestroy - turn off listeners', this.categories)
    },

    destroyed() {
      console.log('😊 destroyed', this.categories)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
