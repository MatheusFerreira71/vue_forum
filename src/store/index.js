import Vue from 'vue'
import Vuex from 'vuex'
import { countObjectProperties } from '@/utils'
import firebase from 'firebase'

Vue.use(Vuex)

const makeAppendChildToParentMutation = ({ parent, child }) =>
  (state, { childId, parentId }) => {
    const resource = state[parent][parentId]
    if (!resource[child]) {
      Vue.set(resource, 'posts', {})
    }
    Vue.set(resource[child], childId, childId)
  }

export default new Vuex.Store({
  state: {
    categories: {},
    forums: {},
    threads: {},
    posts: {},
    users: {},
    authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2'
  },
  getters: {
    authUser (state) {
      // return state.users[state.authId]
      return {}
    },
    userPostsCount: state => id => countObjectProperties(state.users[id].posts),
    userThreadsCount: state => id => countObjectProperties(state.users[id].threads),
    threadRepliesCount: state => id => countObjectProperties(state.threads[id].posts) - 1
  },
  actions: {
    createPost ({ commit, state }, post) {
      const postId = `greatPost${Math.random()}`
      post['.key'] = postId
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setPost', { post, postId })
      commit('appendPostToThread', { childId: postId, parentId: post.threadId })
      commit('appendPostToUser', { childId: postId, parentId: post.userId })
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
        commit('appendThreadToForum', { childId: threadId, parentId: forumId })
        commit('appendThreadToUser', { parentId: userId, childId: threadId })
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
    },
    fetchCategory ({ dispatch }, { id }) {
      return dispatch('fetchItem', { id, emoji: '📜', resource: 'categories' })
    },
    fetchCategories ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { ids, resource: 'categories', emoji: '📜' })
    },
    fetchForum ({ dispatch }, { id }) {
      return dispatch('fetchItem', { id, emoji: '📌', resource: 'forums' })
    },
    fetchForums ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { ids, resource: 'forums', emoji: '📌' })
    },
    fetchThread ({ dispatch }, { id }) {
      return dispatch('fetchItem', { id, emoji: '🧵', resource: 'threads' })
    },
    fetchThreads ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { ids, resource: 'threads', emoji: '🧵' })
    },
    fetchPost ({ dispatch }, { id }) {
      return dispatch('fetchItem', { id, emoji: '📃', resource: 'posts' })
    },
    fetchPosts ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { ids, resource: 'posts', emoji: '📃' })
    },
    fetchUser ({ dispatch }, { id }) {
      return dispatch('fetchItem', { id, emoji: '👨', resource: 'users' })
    },
    fetchUsers ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { ids, resource: 'users', emoji: '👨' })
    },
    fetchItem ({ state, commit }, { id, emoji, resource }) {
      console.log(`🔥 firebase working ! ${resource} ${emoji} fetched: ${id} ✔`)
      return new Promise((resolve, reject) => {
        firebase.database().ref(resource).child(id).once('value', snapshot => {
          commit('setItem', { item: snapshot.val(), id: snapshot.key, resource })
          resolve(state[resource][id])
        })
      })
    },
    fetchItems ({ dispatch }, { ids, resource, emoji }) {
      ids = Array.isArray(ids) ? ids : Object.keys(ids)
      return Promise.all(ids.map(id => dispatch('fetchItem', { id, emoji, resource })))
    },
    fetchAllCategories ({ state, commit }) {
      console.log(`🔥 firebase working ! all categories 📜 fetched ✔`)
      return new Promise((resolve, reject) => {
        firebase.database().ref('categories').once('value', snapshot => {
          const categoriesObjects = snapshot.val()
          Object.keys(categoriesObjects).forEach(categoryId => {
            const category = categoriesObjects[categoryId]
            commit('setItem', { item: category, id: categoryId, resource: 'categories' })
          })
          resolve(Object.values(state.categories))
        })
      })
    }
  },
  mutations: {
    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendPostToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'posts' }),
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),
    appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' }),
    setUser (state, { user, userId }) {
      Vue.set(state.users, userId, user)
    },
    setThread (state, { thread, threadId }) {
      Vue.set(state.threads, threadId, thread)
    },
    setPost (state, { post, postId }) {
      Vue.set(state.posts, postId, post)
    },
    setItem (state, { item, id, resource }) {
      item['.key'] = id
      Vue.set(state[resource], id, item)
    }
  }
})
