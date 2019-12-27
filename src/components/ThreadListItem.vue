<template>
  <div class="thread">
    <div>
      <p>
        <router-link :to="{name: 'ThreadShow', params: {id: thread['.key']}}">{{thread.title}}</router-link>
      </p>
      <p class="text-faded text-xsmall">
        By
        <a href="#">{{user.name}}</a>
        , at {{date}}
      </p>
    </div>

    <div class="activity">
      <p class="replies-count" v-if="repliesCount !== 1">{{repliesCount}} replies</p>
      <p class="replies-count" v-else>{{repliesCount}} reply</p>

      <!-- <img src alt="avatar" class="avatar-medium" /> -->

      <!-- <div>
        <p class="text-xsmall">
          <a href="#"></a>
        </p>
        <p class="text-xsmall text-faded"></p>
      </div> -->
    </div>
  </div>
</template>

<script>
import sourceData from '@/data.json'
export default {
  props: {
    thread: {
      required: true,
      type: Object
    }
  },
  computed: {
    repliesCount () {
      return Object.keys(this.thread.posts).length - 1
    },
    user () {
      return sourceData.users[this.thread.userId]
    },
    date () {
      return Date(this.thread.publishedAt)
    }
  }
}
</script>
