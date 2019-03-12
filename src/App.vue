<template>
  <div id="app">
    <h1>Github Search</h1>
    <input placeholder="search..." v-model="search" />
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<script>
import { pluck, map } from 'rxjs/operators'

export default {
  name: 'app',
  data: function () {
    return {
      search: ''
    }
  },
  created () {
    // from vue-rx
    this.$watchAsObservable('search')
      .pipe(pluck('newValue'))
      .subscribe(q => {
        this.$router.replace({ name: 'Search', query: { q } })
      })
  }
}
</script>

