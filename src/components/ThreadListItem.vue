<template>
  <div class="thread">
    <div>
      <p>
        <router-link :to="{name: 'ThreadShow', params: {id: thread['.key']}}">{{thread.title}}</router-link>
      </p>
      <p class="text-faded text-xsmall">
        By
        <a href="#">{{user.name}}</a>, <AppDate :timestamp="this.thread.publishedAt"/>.
      </p>
    </div>

    <div class="activity">
      <p class="replies-count">{{repliesCount}} {{repliesCount !== 1 ? 'replies' : 'reply'}}</p>

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
export default {
  props: {
    thread: {
      required: true,
      type: Object
    }
  },
  computed: {
    repliesCount () {
      return this.$store.getters.threadRepliesCount(this.thread['.key'])
    },
    user () {
      return this.$store.state.users[this.thread.userId]
    }
  }
}
</script>
