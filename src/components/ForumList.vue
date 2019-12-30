<template>
  <div class="forum-list">
      <h2 class="list-title">Forums</h2>
      <ForumListItem
      v-for="forum in forums"
      :key="forum['.key']"
      :forum="forum"
      />
  </div>
</template>

<script>
import ForumListItem from '@/components/ForumListItem'
export default {
  components: {
    ForumListItem
  },
  props: {
    forums: {
      required: true,
      type: Array
    }
  }
}
</script>
