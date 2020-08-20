<template>
    <form @submit.prevent="save">
        <div class="form-group">
            <textarea name=""
            id=""
            cols="30"
            rows="10"
            class="form-input"
            v-model="text"
            ></textarea> 
        </div>
        <div class="form-actions">
            <button class="btn-blue">Submit Post</button>
        </div>
    </form>
</template>

<script>
export default {
    props: {
        threadId: {
            required: true
        }
    },
    data () {
        return {
            text: ''
        }
    }, 

    methods: {
        save () {
                const postId = 'greatPost' + Math.random()
                const post = {
                    text: this.text,
                    publishedAt: Math.floor(Date.now() / 1000),
                    threadId: this.threadId,
                    userId: 'jVa6Go6Nl1Urkag1R2p9CHTf4ny1',
                    '.key': postId 
                }

                this.text = ''

                this.$emit('save', {post})
            }
    }
}
</script>

<style scoped>

</style>