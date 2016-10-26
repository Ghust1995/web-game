const _ = require('lodash');

// Engine modules
const EventBroker = require('my-engine/core/EventBroker');

// Editor modules
const EditableComponent = require('../../../../my-engine-editor/core/EditableComponent');

module.exports = EditableComponent("Bullet", (networkid, firebase) => ({
  firebase: firebase,
  networkid: networkid,
  speed: 150,
  totalTime: 0,
  lifeTime: 5,
  initialDistance: 50,
  remove: function(go) {
    firebase.database.ref(`bullets/${this.networkid}`).remove();
    _.remove(go.parent.children, (c) => c===go);
  },
  init: function(go) {
    go.transform.position.add(go.transform.getForward().multiplyScalar(this.initialDistance));
  },
  update: function(go, deltaTime) {
    go.transform.position.add(go.transform.getForward().multiplyScalar(this.speed * deltaTime));
    this.totalTime += deltaTime;
    if(Math.abs(go.getWorldPosition().x) > 500 || Math.abs(go.getWorldPosition().z) > 500) {
      EventBroker.publish("hitwall", {position: go.getWorldPosition(), color: go.components.Mesh.material.color});
      this.remove(go);
    }
    if(this.totalTime > this.lifeTime) {
      this.remove(go);
    }
  }
}));
