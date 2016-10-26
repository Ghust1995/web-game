// Node Modules
const THREE = require('three');

// Core Components
const MeshComponent = require('my-engine/components/Mesh');

// Custom Components
const NameOnHitScanComponent = require('../customComponents/NameOnHitScan');
const ServerNetworkTransform = require('../customComponents/ServerNetworkTransform');

// Custom Game Objects
const PlayerBody = require('../customGameObjects/PlayerBody');

module.exports = (transform, key) => ({
    transform: transform,
    children: {
      Body: PlayerBody()
    },
    components: {
      Hitscan: NameOnHitScanComponent(),
      ServerNetworkTransform: ServerNetworkTransform(key),
    }
});
