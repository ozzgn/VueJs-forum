import firebase from 'firebase/app'

export default {
    createPost ({commit, state}, post) {
        const postId = firebase.database().ref('posts').push().key
        post.userId = state.authId
        post.publishedAt = Math.floor(Date.now() / 1000)

        const updates = {}
        updates[`posts/${postId}`] = post
        updates[`threads/${post.threadId}/posts/${postId}`] = postId
        updates[`threads/${post.threadId}/contributors/${post.userId}`] = post.userId
        updates[`users/${post.userId}/posts/${postId}`] = postId
        firebase.database().ref().update(updates)
            .then(() => {
                // Set post
                commit('setItem', {resource: 'posts', item: post, id: postId})
                // Append post to thread
                commit('appendPostToThread', {parentId: post.threadId, childId: postId})
                commit('appendContributorToThread', {parentId: post.threadId, childId: post.userId})
                // Append post to user
                commit('appendPostToUser', {parentId: post.userId, childId: postId})
                return Promise.resolve(state.posts[postId])
            }) 
    },

    createThread ({state, commit, dispatch}, {text, title, forumId}) {
        return new Promise((resolve, reject) => {
            const threadId = firebase.database().ref('threads').push().key
            const postId = firebase.database().ref('posts').push().key
            const userId = state.authId
            const publishedAt = Math.floor(Date.now() / 1000)

            const thread = {title, forumId, publishedAt, userId, firstPostId: postId, posts: {}}
            thread.posts[postId] = postId
            const post = {text, publishedAt, threadId, userId}

            const updates = {}
            // set thread
            updates[`threads/${threadId}`] = thread
            // append to forum
            updates[`forums/${forumId}/threads/${threadId}`] = threadId
            updates[`users/${userId}/threads/${threadId}`] = threadId
            // append to user
            updates[`posts/${postId}`] = post
            updates[`users/${userId}/posts/${postId}`] = postId

            firebase.database().ref().update(updates)
                .then(() => {
                    // Update threads
                    commit('setItem', {resource: 'threads', id: threadId, item: thread})
                    commit('appendThreadToForum', {parentId: forumId, childId: threadId})
                    commit('appendThreadToUser', {parentId: userId, childId: threadId}) 
                    // Update Post
                    commit('setItem', {resource: 'posts', item: post, id: postId})
                    commit('appendPostToThread', {parentId: post.threadId, childId: postId})
                    commit('appendPostToUser', {parentId: post.userId, childId: postId})

                    resolve(state.threads[threadId])
                })           
        })
    },

    createUser ({state, commit}, {id, email, name, username, avatar = null}) {
        return new Promise((resolve, reject) => {
            const registeredAt = Math.floor(Date.now() / 1000)
            const usernameLower = username.toLowerCase()
            email = email.toLowerCase()
            const user = {avatar, email, name, username, usernameLower, registeredAt}
            firebase.database().ref('users').child(id).set(user)
                .then(() => {
                    commit('setItem', {resource: 'users', id: id, item: user})
                    resolve(state.users[id])
                })
        })
    },

    registerUserWithEmailAndPassword ({dispatch}, {email, name, username, password, avatar = null}) {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
            return dispatch('createUser', {id: user.user.uid, email, name, username, password, avatar})
        })
        .then(() => dispatch('fetchAuthUser'))
    },

    signInWithEmailAndPassword ({context}, {email, password}) {
        return firebase.auth().signInWithEmailAndPassword(email, password)
    },

    signInWithGoogle ({dispatch}) {
        const provider = new firebase.auth.GoogleAuthProvider()
        return firebase.auth().signInWithPopup(provider)
            .then(data => {
                const user = data.user
                firebase.database().ref('users').child(user.uid).once('value', snapshot => {
                    if (!snapshot.exists()) {
                        return dispatch('createUser', {id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoURL})
                            .then(() => dispatch('fetchAuthUser'))
                    } 
                })
            })
    },

    signOut ({commit}) {
        return firebase.auth().signOut()
            .then(() => {
                commit('setAuthId', null)
            })
    },

    updateThread ({state, commit, dispatch}, {title, text, id}) {
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

            firebase.database().ref().update(updates)
                .then(() => {
                    commit('setThread', {thread: {...thread, title}, threadId: id})
                    commit('setPost', {postId: thread.firstPostId, post: {...post, text, edited}})
                    resolve(post) 
            })
        })
    },

    updatePost ({state, commit}, {id, text}) {
        return new Promise((resolve, reject) => {
            const post = state.posts[id]
            const edited = {
                at: Math.floor(Date.now() / 1000),
                by: state.authId
            }

            const updates = {text, edited}
            firebase.database().ref('posts').child(id).update(updates)
                .then(() => {
                    commit('setPost', {postId: id, post: {...post, text, edited}})
                    resolve(post) 
            })            
        })
    },

    updateUser ({commit}, user) {
        commit('setUser', {userId: user['.key'], user})
    },

    fetchAuthUser ({dispatch, commit}) {
        const userId = firebase.auth().currentUser.uid
        return new Promise((resolve, reject) => {
            // check if user exists in database
            firebase.database().ref('users').child(userId).once('value', snapshot => {
                if (snapshot.exists()) {
                    return dispatch('fetchUser', {id: userId})
                    .then(user => {
                        commit('setAuthId', userId)
                        resolve(user)
                    })
                } else {
                    resolve(null)
                }
            })
        })
    },

    fetchCategory: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'categories', id, emoji: 'fetchCategory 📁'}),

    fetchForum: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'forums', id, emoji: 'fetchForum 😃'}),

    fetchThread: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'threads', id, emoji: 'fetchThread 🔥'}),

    fetchPost: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'posts', id, emoji: 'fetchPost 📰'}),

    fetchUser: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'users', id, emoji: 'fetchUser 🐔'}),


    fetchCategories: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'categories', ids, emoji: 'fetchCategories 📁'}),      

    fetchForums: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'forums', ids, emoji: 'fetchForums 😃'}),

    fetchThreads: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'threads', ids, emoji: 'fetchThreads 🔥'}),

    fetchPosts: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'posts', ids, emoji: 'fetchPosts 🐎'}),

    fetchUsers: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'users', ids, emoji: 'fetchUsers 🐔'}),


    fetchAllCategories ({state, commit}) {
        console.log('😏', '✅', 'Fetch All Categories')
        return new Promise((resolve, reject) => {
            firebase.database().ref('categories').once('value', snapshot => {
                const categoriesObject = snapshot.val()
                Object.keys(categoriesObject).forEach(categoryId => {
                    const category = categoriesObject[categoryId]
                    commit('setItem', {resource: 'categories', id: categoryId, item: category})
                })
                resolve(Object.values(state.categories))
            })
        })    
    },

    fetchItem ({state, commit}, {id, emoji, resource}) {
        console.log('🌟', emoji, id)
        return new Promise((resolve, reject) => {
            firebase.database().ref(resource).child(id).once('value', snapshot => {
                commit('setItem', {resource, id: snapshot.key, item: snapshot.val()})
                resolve(state[resource][id])
            })
        })
    },

    fetchItems ({dispatch}, {ids, resource, emoji}) {
        ids = Array.isArray(ids) ? ids : Object.keys(ids)
        return Promise.all(ids.map(id => dispatch('fetchItem', {id, resource, emoji})))
    }
}