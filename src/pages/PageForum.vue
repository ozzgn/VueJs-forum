<template>
<div v-if="asyncDataStatus_ready" class="forum-wrapper">
      <div class="col-full push-top">
          <div class="forum-header">
              <div class="forum-details">
                  <h1>{{forum.name}}</h1>
                  <p class="text-lead">{{forum.description}}</p>
              </div>

              <router-link
              :to="{name: 'ThreadCreate', params: {forumId: this.forum['.key']}}"
              class="btn-green btn-small"
              >
              Start a thread
              </router-link>


          </div>
      </div>

      <div class="col-full">
            <div class="category-item">
                <div class="forum-list">
                    <h2 class="list-title">Recipes</h2>

                    <div class="forum-listing">
                        <div class="forum-details">
                            <a href="#" class="forum-name">Recipes</a>

                            <p class="forum-description ">Recipes, Guides and Tips &amp; Tricks</p>
                        </div>


                        <div class="threads-count">
                            <p class="count text-lead">1</p> threads
                        </div>

                        <div class="last-thread">
                            <img class="avatar" src="http://cleaneatsfastfeets.com/wp-content/uploads/2013/05/Mr-Burns.gif" alt="">
                            <div class="last-thread-details">
                                <a href="#">How I grill my fish</a>
                                <p class="text-xsmall">By <a href="profile.html">Charles Montgomery Burns</a>, 2 days ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      <div class="col-full push-top">

         <ThreadList :threads="threads"/>

      </div>

  </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import ThreadList from '@/components/ThreadList'
    import asyncDataStatus from '@/mixins/asyncDataStatus'
   
    export default {
        components: {
            ThreadList
        },

        mixins: [asyncDataStatus],

        props: {
            id: {
                required: true,
                type: String 
            }
        },

        computed: {
          forum () {
            return this.$store.state.forums[this.id]
          },

          threads () {
            return Object.values(this.$store.state.threads)
              .filter(thread => thread.forumId === this.id)
          }
        },

        methods: {
            ...mapActions(['fetchForum', 'fetchThreads', 'fetchUser'])
        },

        created () {
            this.fetchForum({id: this.id})
                .then(forum => this.fetchThreads({ids: forum.threads}))
                .then(threads => Promise.all(threads.map(thread => this.fetchUser({id: thread.userId}))))
                .then(() => { this.asyncDataStatus_fetched() })
        }
    }
  
</script>
 
<style scoped>

.forum-wrapper {
  width: 100%;
}

</style>
