<template>
  <div class="col-full">
    <h1>Welcome to the Forum</h1>
    <ForumList :forums="forums"/>
  </div>
</template>

<script>
import sourceData from '@/data'
import ForumList from '@/components/ForumList'
export default {
  data () {
    return {
      forums: Object.values(sourceData.forums),
      posts: sourceData.posts,
      users: sourceData.users
    }
  },
  components: {
    ForumList
  }
}
</script>
