<template>
    <div class="col-full"
        :class="$style.centered"
    >
        <h1 :class="$style.headerLarge">Not Found</h1>
        <p :class="$style.textLarge">Oooops, we couldn't find what you are looking for. Why dont you
            <router-link :to="{name: 'Home'}">
                Go Home Instead?
            </router-link>
        </p>
    </div>
</template>

<script>
export default {
    
}
</script>

<style module>
 .headerLarge {
     font-size: 100px;
 }

 .textLarge {
     font-size: 50px;
     font-weight: 100;
 }

 .centered {
     text-align: center;
 }
</style>