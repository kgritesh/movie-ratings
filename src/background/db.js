const firebase = require("firebase");
require("firebase/firestore");
const config = require('../config');

module.exports = {
  _client: null,
  _initialized: false,
  isAuthenticated: false,
  _callbacks: [],
  initDb() {
    new Promise((resolve, reject) => {
      this._callbacks.push({ resolve, reject });
      if (!this._client) {
        firebase.initializeApp(config.firebase);
        this._client = firebase.firestore();

        firebase.auth().onAuthStateChanged((user) => {
          this._initialized = true;
          console.log('Firebase Connection Initialized', user);
          if (user) {
            this.isAuthenticated = true;
            this._callbacks.forEach(cb => cb.resolve());
          } else {
            this.isAuthenticated = false;
            this._callbacks.forEach(cb => cb.reject());
          }
        });

        firebase.auth().signInAnonymously().catch(function(error) {
          console.log('Failed to authenticate user', error);
          reject(error);
        });
      }
    });
  },

  client() {
    return new Promise((resolve, reject) => {
      if(!this._initialized) {
        return this.initDb();
      }
      else if (this.isAuthenticated) {
        resolve(this._client);
      }
      reject(new Error('Firebase auth failed'));
    });
  }
}