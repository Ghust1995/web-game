//Node Modules - Usually used
const THREE = require('three');

// Core Components
const MeshComponent = require('my-engine/components/Mesh');

// Custom components
const BulletComponent = require('../customComponents/Bullet');

module.exports = (transform) => ({
  transform: transform,
  components: {
    Bullet: BulletComponent(),
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
