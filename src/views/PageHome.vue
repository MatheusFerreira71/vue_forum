<template>
  <div class="col-full">
    <h1>Welcome to the Forum</h1>
    <CategoryList :categories="categories"/>
  </div>
</template>

<script>
import sourceData from '@/data'
import CategoryList from '@/components/CategoryList'
export default {
  data () {
    return {
      categories: Object.values(sourceData.categories),
      posts: sourceData.posts,
      users: sourceData.users
    }
  },
  components: {
    CategoryList
  }
}
</script>
