// Node Modules
const THREE = require('three');
const _ = require('lodash');

// Engine modules
const Input = require('my-engine/core/Input');
const Instantiate = require('my-engine/core/Instantiate');

// Core components
const MeshComponent = require('my-engine/components/Mesh');
const CameraComponent = require('my-engine/components/Camera');
const NetworkTransformComponent = require('my-engine/components/NetworkTransform');

// Custom Game Objects
const Bullet = require('./Bullet');

// Custom modules
const RandomNameGenerator = require('../../../random-names/RandomNames');

module.exports = (Firebase) => ({
    transform: {
        position: new THREE.Vector3(0, 32, 0),
        rotation: new THREE.Euler(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1)
    },
    components: {
        NetworkTransform: NetworkTransformComponent("players", Firebase, RandomNameGenerator.getUnique),
        MouseRotation: {
            update(go /*, deltaTime*/ ) {
                go.rotateY(-Input.Mouse.delta.x);
                //go.rotateAxis(go.Input.Mouse.delta.y * 0.1);
            }
        },
        PlayerController: {
            linSpeed: 80,
            angSpeed: 4,
            update: function(go, deltaTime) {
                var vert = (Input.isDown(Input.Keys.W) ? 1 : 0) + (Input.isDown(Input.Keys.S) ? -1 : 0);
                var velocity = go.transform.getForward().multiplyScalar(this.linSpeed * vert * deltaTime);

                var horz = (Input.isDown(Input.Keys.D) ? 1 : 0) + (Input.isDown(Input.Keys.A) ? -1 : 0);
                velocity.add(go.transform.getRight().multiplyScalar(this.linSpeed * horz * deltaTime));

                go.transform.position.add(velocity);


                if(Input.isPressed(Input.Keys.MOUSE_L)) {
                  Instantiate(Bullet, "Bullet", go.parent, {
                    transform: go.transform
                  });
                }
            }
        },
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
        Sword: {
            transform: {
                position: new THREE.Vector3(-20, 0, -30),
                rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                scale: new THREE.Vector3(1, 1, 1)
            },
            components: {
                Mesh: MeshComponent({
                    type: THREE.CylinderGeometry,
                    params: [1, 5, 60]
                }, {
                    type: THREE.MeshPhongMaterial,
                    params: {
                        color: 0xFFFFFF
                    }
                }),
            },
        },
        Shield: {
            transform: {
                position: new THREE.Vector3(20, 0, -20),
                rotation: new THREE.Euler(Math.PI / 2, 0, 0),
                scale: new THREE.Vector3(1, 1, 1)
            },
            components: {
                Mesh: MeshComponent({
                    type: THREE.CylinderGeometry,
                    params: [10, 10, 5]
                }, {
                    type: THREE.MeshPhongMaterial,
                    params: {
                        color: 0xFFFFFF
                    }
                }),
            },
        },
        Head: {
            transform: {
                position: new THREE.Vector3(0, 30, 0),
                rotation: new THREE.Euler(0, 0, 0),
                scale: new THREE.Vector3(1, 1, 1)
            },
            components: {
                Mesh: MeshComponent({
                    type: THREE.SphereGeometry,
                    params: [10, 32, 32]
                }, {
                    type: THREE.MeshPhongMaterial,
                    params: {
                        color: Math.random() * 0xFFFFFF
                    }
                }),
            },
        },
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
