import firebase from 'firebase'
export default {
  createPost ({ commit, state }, post) {
    const postId = firebase.database().ref('posts').push().key
    post.userId = state.authId
    post.publishedAt = Math.floor(Date.now() / 1000)

    const updates = {}
    updates[`posts/${postId}`] = post
    updates[`threads/${post.threadId}/posts/${postId}`] = postId
    updates[`threads/${post.threadId}/contributors/${post.userId}`] = post.userId
    updates[`users/${post.userId}/posts/${postId}`] = postId
    firebase.database().ref().update(updates).then(() => {
      commit('setItem', { item: post, id: postId, resource: 'posts' })
      commit('appendPostToThread', { childId: postId, parentId: post.threadId })
      commit('appendContributorToThread', { childId: post.userId, parentId: post.threadId })
      commit('appendPostToUser', { childId: postId, parentId: post.userId })
      return Promise.resolve(state.posts[postId])
    })
  },
  createUser ({ state, commit }, { id, email, name, username, avatar = null }) {
    return new Promise((resolve, reject) => {
      const registeredAt = Math.floor(Date.now() / 1000)
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()
      const user = { avatar, email, name, username, registeredAt, usernameLower }
      firebase.database().ref('users').child(id).set(user).then(() => {
        commit('setItem', { item: user, id: id, resource: 'users' })
        resolve(state.users[id])
      })
    })
  },
  registerUserWithEmailAndPassword ({ dispatch }, { email, name, username, password, avatar = null }) {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
      return dispatch('createUser', { id: user.user.uid, email, name, username, password, avatar })
    }).then(() => dispatch('fetchAuthUser'))
  },
  signInWithEmailAndPassword (context, { email, password }) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  },
  signInWithGoogle ({ dispatch }) {
    const provider = new firebase.auth.GoogleAuthProvider()
    return firebase.auth().signInWithPopup(provider).then(data => {
      const user = data.user
      firebase.database().ref('users').child(user.uid).once('value', snapshot => {
        if (!snapshot.exists()) {
          return dispatch('createUser', { id: user.uid, email: user.email, name: user.displayName, username: user.email, avatar: user.photoURL })
            .then(() => dispatch('fetchAuthUser'))
        }
      })
    })
  },
  signOut ({ commit }) {
    return firebase.auth().signOut().then(() => {
      commit('setAuthId', null)
    })
  },
  updateUser ({ commit }, user) {
    commit('setUser', { user, userId: user['.key'] })
  },
  createThread ({ state, commit }, { text, title, forumId }) {
    return new Promise((resolve, reject) => {
      const threadId = firebase.database().ref('threads').push().key
      const postId = firebase.database().ref('posts').push().key
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)

      const thread = { forumId, publishedAt, title, userId, firstPostId: postId, posts: {} }
      thread.posts[postId] = postId
      const post = { text, publishedAt, threadId, userId }

      const updates = {}
      updates[`threads/${threadId}`] = thread
      updates[`forums/${forumId}/threads/${threadId}`] = threadId
      updates[`users/${userId}/threads/${threadId}`] = threadId

      updates[`posts/${postId}`] = post
      updates[`users/${userId}/posts/${postId}`] = postId
      firebase.database().ref().update(updates).then(() => {
        // update thread
        commit('setItem', { item: thread, id: threadId, resource: 'threads' })
        commit('appendThreadToForum', { childId: threadId, parentId: forumId })
        commit('appendThreadToUser', { parentId: userId, childId: threadId })
        // update post
        commit('setItem', { item: post, id: postId, resource: 'posts' })
        commit('appendPostToThread', { childId: postId, parentId: post.threadId })
        commit('appendPostToUser', { childId: postId, parentId: post.userId })

        resolve(state.threads[threadId])
      })
    })
  },
  updateThread ({ state, commit }, { text, title, id }) {
    return new Promise((resolve, reject) => {
      const thread = state.threads[id]
      const post = state.posts[thread.firstPostId]

      const edited = {
        at: Math.floor(Date.now() / 1000),
        by: state.authId
      }

      const updates = {}
      updates[`posts/${thread.firstPostId}/text`] = text
      updates[`posts/${thread.firstPostId}/edited`] = edited
      updates[`threads/${id}/title`] = title
      firebase.database().ref().update(updates).then(() => {
        commit('setThread', { thread: { ...thread, title }, threadId: id })
        commit('setPost', { post: { ...post, text, edited }, postId: thread.firstPostId })
        resolve(post)
      })
    })
  },
  updatePost ({ state, commit }, { id, text }) {
    return new Promise((resolve, reject) => {
      const post = state.posts[id]
      const edited = {
        at: Math.floor(Date.now() / 1000),
        by: state.authId
      }

      const updates = { text, edited }
      firebase.database().ref('posts').child(id).update(updates).then(() => {
        commit('setPost', { post: { ...post, text, edited }, postId: id })
        resolve(post)
      })
    })
  },
  fetchAuthUser ({ dispatch, commit }) {
    const userId = firebase.auth().currentUser.uid
    return new Promise((resolve, reject) => {
      // Check if user exists in database.
      firebase.database().ref('users').child(userId).once('value', snapshot => {
        if (snapshot.exists()) {
          return dispatch('fetchUser', { id: userId }).then(user => {
            commit('setAuthId', userId)
            resolve(user)
          })
        } else {
          resolve(null)
        }
      })
    })
  },
  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { id, emoji: '📜', resource: 'categories' }),
  fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'categories', emoji: '📜' }),
  fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { id, emoji: '📌', resource: 'forums' }),
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'forums', emoji: '📌' }),
  fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { id, emoji: '🧵', resource: 'threads' }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'threads', emoji: '🧵' }),
  fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { id, emoji: '📃', resource: 'posts' }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'posts', emoji: '📃' }),
  fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { id, emoji: '👨', resource: 'users' }),
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'users', emoji: '👨' }),
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
}
