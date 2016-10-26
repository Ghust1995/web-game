// Node Modules
const THREE = require('three');
const _ = require('lodash');

// Engine modules
const Input = require('my-engine/core/Input');
//const Instantiate = require('my-engine/core/Instantiate');

// Core components
const CameraComponent = require('my-engine/components/Camera');
const NetworkTransformComponent = require('my-engine/components/NetworkTransform');

// Custom components
const PlayerControllerComponent = require('../customComponents/PlayerController');

// Custom modules
const RandomNameGenerator = require('../../../random-names/RandomNames');

// Custom Game Objects
//const Bullet = require('../customGameObjects/Bullet');
const PlayerBody = require('../customGameObjects/PlayerBody');

module.exports = (Firebase) => ({
    transform: {
        position: new THREE.Vector3(0, 32, 0),
        rotation: new THREE.Euler(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1)
    },
    components: {
        NetworkTransform: NetworkTransformComponent("players", Firebase, RandomNameGenerator.getUnique),
        ShootBullets: {
          update: function(go) {
            if(Input.isPressed(Input.Keys.MOUSE_L)) {
              Firebase.database.ref('bullets').push({transform: {
                  position: {
                    x: go.transform.position.x,
                    y: go.transform.position.y,
                    z: go.transform.position.z
                  },
                  rotation: {
                    x: go.transform.rotation.x,
                    y: go.transform.rotation.y,
                    z: go.transform.rotation.z
                  },
                  scale: {
                    x: go.transform.scale.x,
                    y: go.transform.scale.y,
                    z: go.transform.scale.z
                  }
                }
              });
            }
          }
        },
        MouseRotation: {
            update(go /*, deltaTime*/ ) {
                go.rotateY(-Input.Mouse.delta.x);
                //go.rotateAxis(go.Input.Mouse.delta.y * 0.1);
            }
        },
        PlayerController: PlayerControllerComponent(),
        Jump: {
            velocity: new THREE.Vector3(0, 0, 0),
            jumpImpulse: 10,
            grouded: false,
            update: function(go, deltaTime) {
                if(Input.isPressed(Input.Keys.SPACE) && this.grouded) {
                  this.velocity.add(go.transform.getUp().multiplyScalar(this.jumpImpulse));
                  this.grouded = false;
                }
                go.transform.position.add(this.velocity);
                this.velocity.add(new THREE.Vector3(0, (-35) * deltaTime, 0));
                if (go.transform.position.y < 32 && this.velocity.y < 0)
                {
                  this.velocity.y = 0.0;
                  this.grouded = true;
                }

            }
        }
    },
    children: {
        //TODO: Make player on client not visible
        //Body: PlayerBody(),
        ThirdPersonCamera: {
            transform: {
                position: new THREE.Vector3(0, 50, 300),
                rotation: new THREE.Euler(0, 0, 0),
                scale: new THREE.Vector3(1, 1, 1)
            },
            components: {
                Camera: CameraComponent(true),
                Crosshair: {
                    raycaster: new THREE.Raycaster(),
                    scene: null,
                    init: function(go) {
                        // TODO: add glogal reference to scene
                        // Add a better (possibly readonly reference to the scene)
                        this.scene = go.parent.parent;
                    },
                    update: function(go /*, deltaTime*/ ) {
                        this.raycaster.setFromCamera(new THREE.Vector2(Input.Mouse.position.x, Input.Mouse.position.y), go.components.Camera.ref);
                        var objsToTest = this.scene.getObjectByName("NetworkPlayers");
                        var intersects = this.raycaster.intersectObjects(objsToTest.children, true);
                        if (intersects.length > 0) {
                            //
                            var hitObjects = _.map(intersects, (i) => objsToTest.getObjectById(i.object.id));
                            var firstHit = _.find(
                                hitObjects,
                                (h) => h.layer === "Default");
                            if (firstHit) {
                                if (_.hasIn(firstHit, 'onHitScan')) {
                                    firstHit.onHitScan();
                                }
                            }
                        }
                    }
                },
            },
        },
    }
});
