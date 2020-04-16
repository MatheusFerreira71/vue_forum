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
import { mapActions } from 'vuex'
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
  methods: {
    ...mapActions(['fetchCategory', 'fetchForums'])
  },
  computed: {
    category () {
      return this.$store.state.categories[this.id]
    }
  },
  created () {
    console.clear()
    this.fetchCategory({ id: this.id }).then(category => this.fetchForums({ ids: category.forums }))
  }
}
</script>

<style scoped>
    .full-width {
        width: 100%;
    }
</style>
