<template>
  <div class="full-width" v-if="category">
    <div class="col-full push-top">
      <h1>{{ category.name }}</h1>
    </div>
    <div class="col-full">
      <CategoryListItem
      :category="category"
      />
    </div>
  </div>
</template>

<script>
import CategoryListItem from '@/components/CategoryListItem'
export default {
  components: {
    CategoryListItem
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    category () {
      return this.$store.state.categories[this.id]
    }
  },
  created () {
    console.clear()
    this.$store.dispatch('fetchCategory', { id: this.id }).then(category => {
      this.$store.dispatch('fetchForums', { ids: category.forums })
    })
  }
}
</script>

<style scoped>
    .full-width {
        width: 100%;
    }
</style>
