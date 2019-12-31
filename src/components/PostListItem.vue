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
      <div>
        <p>{{post.text}}</p>
      </div>
    </div>
    <div class="post-date text-faded">
      <AppDate
      :timestamp="post.publishedAt"
      />
    </div>
  </div>
</template>

<script>
import sourceData from '@/data.json'
export default {
  props: {
    post: {
      required: true,
      type: Object
    }
  },
  computed: {
    user () {
      return sourceData.users[this.post.userId]
    },
    userPostsCount () {
      return Object.keys(this.user.posts).length
    }
  }
}
</script>
