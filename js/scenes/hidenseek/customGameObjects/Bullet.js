//Node Modules - Usually used
const THREE = require('three');
const _ = require('lodash');

// Core Components
const MeshComponent = require('my-engine/components/Mesh');

module.exports = (transform) => ({
  transform: transform,
  components: {
    Bullet: {
      speed: 100,
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
          _.remove(go.parent.children, (c) => c===go);
        }
      }
    },
    Mesh: MeshComponent({
        type: THREE.SphereGeometry,
        params: [20, 32, 32]
      },
      {
        type: THREE.MeshPhongMaterial,
        params: {
          color: Math.random() * 0xFFFFFF
        }
      }
    ),
  },
});
