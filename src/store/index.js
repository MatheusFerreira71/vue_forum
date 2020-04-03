import Vue from 'vue'
import Vuex from 'vuex'
import sourceData from '@/data'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ...sourceData,
    authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2'
  },
  getters: {
    authUser (state) {
      return state.users[state.authId]
    }
  },
  actions: {
    createPost ({ commit, state }, post) {
      const postId = `greatPost${Math.random()}`
      post['.key'] = postId
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setPost', { post, postId })
      commit('appendPostToThread', { postId, threadId: post.threadId })
      commit('appendPostToUser', { postId, userId: post.userId })
      return Promise.resolve(state.posts[postId])
    },
    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user['.key'] })
    },
    createThread ({ state, commit, dispatch }, { text, title, forumId }) {
      return new Promise((resolve, reject) => {
        const threadId = `greatThread${Math.random()}`
        const userId = state.authId
        const publishedAt = Math.floor(Date.now() / 1000)
        const thread = { forumId, publishedAt, title, userId, '.key': threadId }
        commit('setThread', { thread, threadId })
        commit('appendThreadToForum', { threadId, forumId })
        commit('appendThreadToUser', { userId, threadId })
        dispatch('createPost', { text, threadId }).then(post => {
          commit('setThread', { thread: { ...thread, firstPostId: post['.key'] }, threadId })
        })
        resolve(state.threads[threadId])
      })
    },
    updateThread ({ state, commit, dispatch }, { text, title, id }) {
      return new Promise((resolve, reject) => {
        const thread = state.threads[id]
        const newThread = { ...thread, title }
        commit('setThread', { thread: newThread, threadId: id })
        dispatch('updatePost', { id: thread.firstPostId, text }).then(() => {
          resolve(newThread)
        })
      })
    },
    updatePost ({ state, commit }, { id, text }) {
      return new Promise((resolve, reject) => {
        const post = state.posts[id]
        commit('setPost', {
          post: {
            ...post,
            text,
            edited: {
              at: Math.floor(Date.now() / 1000),
              by: state.authId
            }
          },
          postId: id
        })
        resolve(post)
      })
    }
  },
  mutations: {
    setPost (state, { post, postId }) {
      Vue.set(state.posts, postId, post)
    },
    appendPostToThread (state, { postId, threadId }) {
      const thread = state.threads[threadId]
      if (!thread.posts) {
        Vue.set(thread, 'posts', {})
      }
      Vue.set(thread.posts, postId, postId)
    },
    appendPostToUser (state, { postId, userId }) {
      const user = state.users[userId]
      Vue.set(user.posts, postId, postId)
    },
    setUser (state, { user, userId }) {
      Vue.set(state.users, userId, user)
    },
    setThread (state, { thread, threadId }) {
      Vue.set(state.threads, threadId, thread)
    },
    appendThreadToForum (state, { threadId, forumId }) {
      const forum = state.forums[forumId]
      if (!forum.threads) {
        Vue.set(forum, 'threads', {})
      }
      Vue.set(forum.threads, threadId, threadId)
    },
    appendThreadToUser (state, { userId, threadId }) {
      const user = state.users[userId]
      if (!user.threads) {
        Vue.set(user, 'threads', {})
      }
      Vue.set(user.threads, threadId, threadId)
    }
  }
})
