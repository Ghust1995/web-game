//Node Modules - Usually used
const THREE = require('three');

// Core Components
const MeshComponent = require('my-engine/components/Mesh');
const NetworkTransformComponent = require('my-engine/components/NetworkTransform');

// Custom components
const BulletComponent = require('../customComponents/Bullet');

module.exports = function(transform, networkId, Firebase) {
    var bulletc = BulletComponent(networkId, Firebase);
    return ({
        transform: transform,
        components: {
            Bullet: bulletc,
            Mesh: MeshComponent({
                type: THREE.SphereGeometry,
                params: [20, 32, 32]
            }, {
                type: THREE.MeshPhongMaterial,
                params: {
                    color: Math.random() * 0xFFFFFF
                }
            })
        }
    });
};
