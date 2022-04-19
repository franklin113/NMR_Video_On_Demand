var firebaseConfig = {
  apiKey: 'AIzaSyB_UfOy9uRdArhuIq4DaqFhWeX-pgSJHP8',
  authDomain: 'cgcaci21.firebaseapp.com',
  databaseURL: 'https://cgcaci21.firebaseio.com',
  projectId: 'cgcaci21',
  storageBucket: 'cgcaci21.appspot.com',
  messagingSenderId: '595065889262',
  appId: '1:595065889262:web:90fac884b0452a89b56eff',
  measurementId: 'G-M0K5LQT39Q',
}
const app = firebase.initializeApp(firebaseConfig)
const database = firebase.database()
const auth = firebase.auth()
database.useEmulator('localhost', 9007)
export { database, auth }
