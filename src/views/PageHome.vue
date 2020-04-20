<template>
  <div v-if="assyncDataStatus_ready" class="col-full push-top">
    <h1>Welcome to the Forum</h1>
    <CategoryList :categories="categories"/>
  </div>
</template>

<script>
import CategoryList from '@/components/CategoryList'
import { mapActions } from 'vuex'
import assyncDataStatus from '@/mixins/assyncDataStatus'
export default {
  mixins: [assyncDataStatus],
  computed: {
    categories () {
      return Object.values(this.$store.state.categories)
    }
  },
  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums'])
  },
  components: {
    CategoryList
  },
  created () {
    console.clear()
    this.fetchAllCategories().then(categories => {
      Promise.all(categories.map(category => {
        this.fetchForums({ ids: Object.keys(category.forums) })
      }))
    }).then(() => {
      this.assyncDataStatus_fetched()
    })
  }
}
</script>
