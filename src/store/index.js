import Vue from 'vue'
import Vuex from 'vuex'
import sourceData from '@/data'

Vue.use(Vuex)

export default new Vuex.Store({
    state: { 
        ...sourceData,
        authId: 'jVa6Go6Nl1Urkag1R2p9CHTf4ny1'
    },

    getters: {
        authUser(state) {
            return state.users[state.authId]
        }
    },

    actions: {
        createPost (context, post) {
            const postId = 'greatPost' + Math.random()
            post['.key'] = postId
            // Set post
            context.commit('setPost', {post, postId})
            // Append post to thread
            context.commit('appendPostToThread', {threadId: post.threadId, postId})
            // Append post to user
            context.commit('appendPostToUser', {userId: post.userId, postId})
        },

        updateUser ({commit}, user) {
            commit('setUser', {userId: user['.key'], user})
        }
    }, 

    mutations: {
        setPost (state, {post, postId}) {
            Vue.set(state.posts, postId, post)
        },
        setUser (state, {user, userId}) {
            Vue.set(state.users, userId, user)
        },
        appendPostToThread (state, {postId, threadId}) {
            const thread = state.threads[threadId]
            Vue.set(thread.posts, postId, postId)
        },
        appendPostToUser (state, {postId, userId}) {
            const user = state.users[userId]
            Vue.set(user.posts, postId, postId)
        }
    }
})