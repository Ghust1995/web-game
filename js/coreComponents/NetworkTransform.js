// NetworkTransform Components
// This component ensures that the transform of this object is stored in the Firebase DB on the given base ref

// Node Modules
const _ = require('lodash');

// Engine modules
const RandomNameGenerator = require('../misc/RandomNames');

function NetworkTransform(baseRef, firebase) {
  this.baseRef = baseRef;
  this.firebase = firebase;
}

NetworkTransform.prototype.init = function(go) {
  RandomNameGenerator.init();
  this.key = this.firebase.database.ref(this.baseRef).push({
    name: RandomNameGenerator.getUnique(),
    transform: {
      position: {
        x: go.transform.position.x,
        y: go.transform.position.y,
        z: go.transform.position.z
      },
      rotation: {
        x: go.transform.rotation.x,
        y: go.transform.rotation.y,
        z: go.transform.rotation.z
      },
      scale: {
        x: go.transform.scale.x,
        y: go.transform.scale.y,
        z: go.transform.scale.z
      }
    }
  }).key;
  this.firebase.database.ref(this.baseRef + '/' + this.key).onDisconnect().remove();
};

NetworkTransform.prototype.updateDB = function (go) {
  this.firebase.database.ref(this.baseRef + '/' + this.key).update({transform: {
      position: {
        x: go.transform.position.x,
        y: go.transform.position.y,
        z: go.transform.position.z
      },
      rotation: {
        x: go.transform.rotation.x,
        y: go.transform.rotation.y,
        z: go.transform.rotation.z
      },
      scale: {
        x: go.transform.scale.x,
        y: go.transform.scale.y,
        z: go.transform.scale.z
      }
    }
  });
};

NetworkTransform.prototype.update = function(go, deltaTime) {
  this.updateDB(go);
};

module.exports = NetworkTransform;
