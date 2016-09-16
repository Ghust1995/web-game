const firebase = require("firebase");

function FirebaseManager(config) {
      if(!config) {
        console.warn("No firebase configuration set");
        return;
      }
      firebase.initializeApp(config);
      this.database = firebase.database();
}

module.exports = FirebaseManager;
