import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        categories: {},
        forums: {},
        threads: {},
        posts: {},
        users: {},
        authId: 'jVa6Go6Nl1Urkag1R2p9CHTf4ny1'
    },

    getters,

    actions,

    mutations
})