// Node modules
//const _ = require('lodash');
const THREE = require('three');

// Engine modules

// Components
const MeshComponent = require('my-engine/components/Mesh');
const LightComponent = require('my-engine/components/Light');

// Custom Game Objects
const TopDownTV = require('./customGameObjects/TopDownTV');
const Player = require('./customGameObjects/Player');
const NetworkPlayers = require('./customGameObjects/NetworkPlayers');
const NetworkBullets = require('./customGameObjects/NetworkBullets');

module.exports = (Assets, Firebase) => ({
    transform: null, // Not sure why one would change the transform of the whole scene, but here for extensibility
    components: {}, // If you want some superior component
    children: {
        Player: Player(Firebase),
        NetworkPlayers: NetworkPlayers(Firebase),
        NetworkBullets: NetworkBullets(Firebase),
        World: {
            children: {
                Skybox: {
                    components: {
                        Mesh: MeshComponent({
                            type: THREE.CubeGeometry,
                            params: [10000, 10000, 10000]
                        }, {
                            type: THREE.MeshBasicMaterial,
                            params: {
                                color: 0xAA419D,
                                side: THREE.BackSide
                            }
                        })
                    }
                },
                Light: {
                    transform: {
                        position: new THREE.Vector3(0, 500, 0),
                        rotation: new THREE.Euler(0, 0, 0),
                        scale: new THREE.Vector3(1, 1, 1)
                    },
                    components: {
                        SpotLight: LightComponent("spot", 0xffffff, 5.0, 1000, Math.PI / 4, 0.5, 2),
                        AmbientLight: LightComponent("ambient", 0xFF00FF, 0.25),
                    }
                },
                Mirror1: TopDownTV({
                    position: new THREE.Vector3(0, 375, -500),
                    rotation: new THREE.Euler(0, 0, 0),
                    scale: new THREE.Vector3(1, 1, 1)
                }),
                Mirror2: TopDownTV({
                    position: new THREE.Vector3(0, 375, 500),
                    rotation: new THREE.Euler(0, Math.PI, 0),
                    scale: new THREE.Vector3(1, 1, 1)
                }),
                Mirror3: TopDownTV({
                    position: new THREE.Vector3(500, 375, 0),
                    rotation: new THREE.Euler(0, -Math.PI / 2, 0),
                    scale: new THREE.Vector3(1, 1, 1)
                }),
                Mirror4: TopDownTV({
                    position: new THREE.Vector3(-500, 375, 0),
                    rotation: new THREE.Euler(0, Math.PI / 2, 0),
                    scale: new THREE.Vector3(1, 1, 1)
                }),
                Floor: {
                    transform: {
                        position: new THREE.Vector3(0, 0, 0),
                        rotation: new THREE.Euler(Math.PI / 2, 0, 0),
                        scale: new THREE.Vector3(1, 1, 1)
                    },
                    components: {
                        Mesh: MeshComponent({
                            type: THREE.PlaneGeometry,
                            params: [1000, 1000, 10, 10]
                        }, {
                            type: THREE.MeshPhongMaterial,
                            params: {
                                map: Assets.floorTexture,
                                side: THREE.DoubleSide
                            }
                        })
                    }
                },
            }
        },
    }
});
