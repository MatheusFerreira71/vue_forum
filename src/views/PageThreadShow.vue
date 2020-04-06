<template>
  <div class="col-large push-top">
    <h1>
      {{thread.title}}
      <router-link
        :to="{name: 'ThreadEdit', id: this.id}"
        class="btn-green btn-small"
        tag="button"
      >Edit this Thread</router-link>
    </h1>
    <p>
      Por <a href="#" class="link-unstyled">{{threadCreator.name}}</a>, <AppDate :timestamp="thread.publishedAt"/>
      <span
      style="float:right; margin-top: 2px;"
      class="hide-mobile text-faded text-small"
      >{{repliesCount === 1 ? `${repliesCount} reply` : `${repliesCount} replies`}} by 3 contribuitors</span>
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
    },
    repliesCount () {
      return this.$store.getters.threadRepliesCount(this.thread['.key'])
    }
    // contribuitorsCount () {
    //   // find replies
    //   const replies = Object.keys(this.thread.posts).filter(postId => postId !== this.thread.firstPostId)
    //   // get users ids
    //   const users =
    // }
  }
}
</script>
