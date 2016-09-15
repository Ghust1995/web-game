const firebase = require('firebase');

FirebaseManager = {
  init: function(go) {
      var config = {
        apiKey: "AIzaSyAqHGwQN2J5BHniiZG0RtrFMHmQRDAKWCQ",
        authDomain: "multiplayer-2108d.firebaseapp.com",
        databaseURL: "https://multiplayer-2108d.firebaseio.com",
        storageBucket: "multiplayer-2108d.appspot.com",
      };
      firebase.initializeApp(config);
      this.database = firebase.database();
  }
};

module.exports = FirebaseManager;
