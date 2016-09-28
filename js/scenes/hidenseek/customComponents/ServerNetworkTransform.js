const THREE = require('three');

module.exports = (key, position, rotation, scale) => ({
    key: key,
    hasNewTransform: false,
    newTransform: {
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Euler(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1)
    },
    update: function(go, deltaTime) {
        if (this.hasNewTransform) {
            go.transform.position.copy(this.newTransform.position);
            go.transform.rotation.copy(this.newTransform.rotation);
            go.transform.scale.copy(this.newTransform.scale);

            // TODO: make lerp or other predictions
            this.hasNewTransform = false;
        }
    },
    emitTransformChange: function(newTransform) {
      this.newTransform = newTransform;
      this.hasNewTransform = true;
    }
});
