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
            <button v-if="isUpdated" @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
            <button class="btn-blue">{{isUpdated ? 'Update' : 'Submit Post'}}</button>
        </div>
    </form>
</template>

<script>
/* eslint-disable */
export default {
    props: {
        threadId: {
            required: false
        },

        post: {
            type: Object,
            validator: obj => {
                const keyIsValid = typeof obj['.key'] === 'string'
                const textIsValid = typeof obj.text === 'string'
                return keyIsValid && textIsValid
                if (!textIsValid) {
                    console.error('The post prop object must include a `text` attribute')
                }
                if (!keyIsValid) {
                    console.error('The post prop object must include a `.key` attribute')
                }
            }
        }
    },

    data () {
        return {
            text: this.post ? this.post.text : ''
        }
    },

    computed: {
        isUpdated () {
            return !!this.post
        }
    },

    methods: {
        save () {
            this.persist()
                .then(post => {
                    this.$emit('save', {post})
                })
        },

        cancel () {
            this.$emit('cancel')
        },

        create () {
            const post = {
                text: this.text,
                threadId: this.threadId
            }

            this.text = ''

            return this.$store.dispatch('createPost', post)
        },

        update () {
            const payload = {
                id: this.post['.key'],
                text: this.text
            }
            return this.$store.dispatch('updatePost', payload)
        },

        persist () {
            return this.isUpdated ? this.update() : this.create()
        }
    }
}
</script>

<style scoped>

</style>