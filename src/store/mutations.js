import Vue from 'vue'

const makeAppendChildToParentMutation = ({ parent, child }) =>
  (state, { childId, parentId }) => {
    const resource = state[parent][parentId]
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }
    Vue.set(resource[child], childId, childId)
  }

export default {
  appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
  appendPostToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'posts' }),
  appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),
  appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' }),
  appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' }),
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
  },
  setAuthId (state, userId) {
    state.authId = userId
  }
}
