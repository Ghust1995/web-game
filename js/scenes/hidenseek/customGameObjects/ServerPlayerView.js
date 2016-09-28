// Node Modules
const THREE = require('three');

// Core Components
const MeshComponent = require('my-engine/components/Mesh');

// Custom Components
const NameOnHitScanComponent = require('../customComponents/NameOnHitScan');
const ServerNetworkTransform = require('../customComponents/ServerNetworkTransform');

module.exports = (transform, key) => ({
    transform: transform,
    components: {
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
      Hitscan: NameOnHitScanComponent(),
      ServerNetworkTransform: ServerNetworkTransform(key),
    }
});
