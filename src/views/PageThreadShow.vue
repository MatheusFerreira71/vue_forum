<template>
  <div class="col-large push-top">
    <h1>{{thread.title}}</h1>
    <p>
      Por <a href="#" class="link-unstyled">{{threadCreator.name}}</a>, <AppDate :timestamp="thread.publishedAt"/>
      <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">3 replies by 3 contribuitors</span>
    </p>
    <PostList :posts="posts"/>
    <PostEditor
    :threadId="id"
    />
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },
  components: {
    PostList,
    PostEditor
  },
  computed: {
    posts () {
      return Object.values(this.$store.state.posts).filter(post => Object.values(this.thread.posts).includes(post['.key']))
    },
    thread () {
      return this.$store.state.threads[this.id]
    },
    threadCreator () {
      return this.$store.state.users[this.thread.userId]
    }
  }
}
</script>
