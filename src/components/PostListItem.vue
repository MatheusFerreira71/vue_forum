<template>
  <div class="post">
    <div class="user-info">
      <a href="#" class="user-name">{{user.name}}</a>
      <a href="#">
        <img :src="user.avatar" alt="avatar" class="avatar-large" />
      </a>
      <p class="desktop-only text-small">{{userPostsCount}} {{userPostsCount !== 1 ? 'posts' : 'post'}}</p>
    </div>

    <div class="post-content">
      <template v-if="!editing">
        <div>
          <p>{{post.text}}</p>
        </div>
        <a
        @click.prevent="editing = true"
        href="#" style="margin-left: 5px;"
        class="link-unstyled"
        title="Make a change">
          <i class="fa fa-pencil"></i>
        </a>
      </template>
      <div v-else class="col-large">
        <PostEditor
        :post="post"
        :threadId="post.threadId"
        @save="editing = false"
        @cancel="editing = false"/>
      </div>
    </div>
    <div class="post-date text-faded">
      <div v-if="post.edited" class="edition-info">edited</div>
      <AppDate
      :timestamp="post.publishedAt"
      />
    </div>
  </div>
</template>

<script>
import { countObjectProperties } from '@/utils/index'
import PostEditor from './PostEditor'
export default {
  props: {
    post: {
      required: true,
      type: Object
    }
  },
  components: {
    PostEditor
  },
  computed: {
    user () {
      return this.$store.state.users[this.post.userId]
    },
    userPostsCount () {
      return countObjectProperties(this.user.posts)
    }
  },
  data () {
    return {
      editing: false
    }
  }
}
</script>
