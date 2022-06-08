<template>
  <div id="app">
    <router-view
      :key="$route.fullPath"
      :user-data="userData"
      :database="database"
      :firestore="firestore"
      :vod-library-id="'398838'"
      :auth="auth"
    />
  </div>
</template>

<script>
import { database, auth, firestore } from '@/firebase/firebase_config'
export default {
  name: 'App',
  components: {},
  data() {
    return {
      database,
      firestore,
      auth,
      eventId: 'asdf',
      userData: {
        firstName: 'Tim',
        lastName: 'Franklin',
        email: 'tim@tim.com',
        canVote: true,
        attendeeId: 'fake-user',
        userType: 'admin',
      },
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>











