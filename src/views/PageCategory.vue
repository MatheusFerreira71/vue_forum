<template>
  <div class="full-width">
    <div class="col-full push-top">
      <h1>Discussions</h1>
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
import sourceData from '@/data.json'
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
      return sourceData.categories[this.id]
    }
  }
}
</script>

<style scoped>
    .full-width {
        width: 100%;
    }
</style>
