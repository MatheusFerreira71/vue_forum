<template>
  <div class="col-large push-top">
    <h1>{{thread.title}}</h1>
    <p>
      Por <a href="#" class="link-unstyled">Robin</a>, <AppDate :timestamp="thread.publishedAt"/>
      <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">3 replies by 3 contribuitors</span>
    </p>
    <PostList :posts="posts"/>
    <PostEditor
    @save="addPost"
    :threadId="id"
    />
  </div>
</template>

<script>
import sourceData from '@/data.json'
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
  data () {
    return {
      thread: sourceData.threads[this.id]
    }
  },
  computed: {
    posts () {
      return Object.values(sourceData.posts).filter(post => Object.values(this.thread.posts).includes(post['.key']))
    }
  },
  methods: {
    addPost ({ post }) {
      const postId = post['.key']
      this.$set(sourceData.posts, postId, post)
      this.$set(this.thread.posts, postId, postId)
      this.$set(sourceData.users[post.userId].posts, postId, postId)
    }
  }
}
</script>
