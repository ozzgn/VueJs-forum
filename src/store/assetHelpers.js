import Vue from 'vue'

export const makeAppendChildToParentMutation = ({parent, child}) => 
    (state, {childId, parentId}) => {
        const resource = state.items[parentId] // user.name === user.['name']
        if (!resource[child]) {
            Vue.set(resource, 'child', {})
        }
        Vue.set(resource[child], childId, childId)
    }