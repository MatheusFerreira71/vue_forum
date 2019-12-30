<template>
  <div class="forum-listing">
      <div class="forum-details">
          <router-link
          :to="{name: 'Forum', params: {id: forum['.key']}}"
          class="text-xlarge"
          >
              {{forum.name}}
          </router-link>
          <p>{{forum.description}}</p>
      </div>
      <div class="threads-count">
          <p class="count">{{threadsCount}}</p>
          {{threadsCount !== 1 ? 'threads' : 'thread'}}
      </div>
      <div class="last-thread">
          <!-- <img src="" alt="avatar" class="avatar">
          <div class="last-thread-details">
              <a href="#"></a>
              <p class="text-xsmall">By <a href="#">Joseph Kerr</a>, three hours ago</p>
          </div> -->
          <!-- TODO: implement later -->
      </div>
  </div>
</template>

<script>
export default {
  props: {
    forum: {
      required: true,
      type: Object
    }
  },
  computed: {
    threadsCount () {
      return this.forum.threads ? Object.values(this.forum.threads).length : 0
    }
  }
}
</script>
