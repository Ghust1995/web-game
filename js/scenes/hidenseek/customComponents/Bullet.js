const _ = require('lodash');

const EditableComponent = require('../../../../my-engine-editor/core/EditableComponent');

module.exports = EditableComponent("Bullet", (networkid, firebase) => ({
  firebase: firebase,
  networkid: networkid,
  speed: 150,
  totalTime: 0,
  lifeTime: 5,
  initialDistance: 50,
  init: function(go) {
    go.transform.position.add(go.transform.getForward().multiplyScalar(this.initialDistance));
  },
  update: function(go, deltaTime) {
    go.transform.position.add(go.transform.getForward().multiplyScalar(this.speed * deltaTime));
    this.totalTime += deltaTime;
    if(this.totalTime > this.lifeTime) {
      firebase.database.ref(`bullets/${this.networkid}`).remove();
      _.remove(go.parent.children, (c) => c===go);
    }
  }
}));
