// Node Modules
const THREE = require('three');
const _ = require('lodash');

// Engine modules
const GameObject = require('my-engine/core/GameObject');

// Core Components
const MeshComponent = require('my-engine/components/Mesh');

// Custom Components
const NameOnHitScanComponent = require('../customComponents/NameOnHitScan');
const ServerNetworkTransform = require('../customComponents/ServerNetworkTransform');

function ServerPlayerView(name, transform, parent, key) {
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
      Hitscan: NameOnHitScanComponent(),
      ServerNetworkTransform: ServerNetworkTransform(key),
    }, parent);
}

ServerPlayerView.prototype = Object.create(GameObject.prototype);
ServerPlayerView.prototype.constructor = ServerPlayerView;

module.exports = ServerPlayerView;
