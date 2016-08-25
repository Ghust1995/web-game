// Node Modules
const THREE = require('three');
const _ = require('lodash');

// Engine modules
const GameObject = require('../../../engine/GameObject');

// Core Components
const MeshComponent = require('../../../components/Mesh');

// Custom Components
const NameOnHitScanComponent = require('../customComponents/NameOnHitScan');

function ServerPlayerView(name, transform, parent) {
  GameObject.call(this,
    name,
    transform,
    {
      Mesh: new MeshComponent({
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
      Hitscan: new NameOnHitScanComponent(),
    }, parent);
}

ServerPlayerView.prototype = Object.create(GameObject.prototype);
ServerPlayerView.prototype.constructor = ServerPlayerView;

module.exports = ServerPlayerView;
