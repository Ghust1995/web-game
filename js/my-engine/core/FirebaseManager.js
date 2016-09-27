const firebase = require("firebase/app");
require("firebase/database");
require("firebase/auth");

function FirebaseManager(config) {
      if(!config) {
        console.warn("No firebase configuration set");
        return;
      }
      firebase.initializeApp(config);
      this.database = firebase.database();
}

module.exports = FirebaseManager;
