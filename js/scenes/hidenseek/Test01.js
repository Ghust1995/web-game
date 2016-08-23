// Node modules
const _ = require('lodash');
const THREE = require('three');
const firebase = require('firebase');
const $ = require('jquery');

// Engine modules
const Input = require('../../engine/Input');
const Engine = require('../../engine/Engine');
const FirebaseManager = require('../../engine/FirebaseManager');
const Assets = require('../../engine/AssetLoader').Assets;
const GameObject = require('../../engine/GameObject');

// Components
const MeshComponent = require('../../components/Mesh');
const NetworkTransformComponent = require('../../components/NetworkTransform');

module.exports = {
  Floor: {
    transform: {
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(Math.PI / 2, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    components: {
      FloorMesh : {
        init: function(go) {
          //TODO: Initial Configuration in loader (see loader todos)
          Assets.floorTexture.wrapS = Assets.floorTexture.wrapT = THREE.RepeatWrapping;
        	Assets.floorTexture.repeat.set( 10, 10 );
        	var floorMaterial = new THREE.MeshPhongMaterial( { map: Assets.floorTexture, side: THREE.DoubleSide } );
        	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
        	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        	go.add(floor);
        }
      }
    }
  },
  Player: {
    transform: {
      position: new THREE.Vector3(0, 32, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    components: {
      NetworkTransform: new NetworkTransformComponent("players"),
      PlayerController: {
        linSpeed: 80,
        angSpeed: 4,
        update: function(go, deltaTime) {
          var vert = (Input.isDown(Input.Keys.UP) ? 1 : 0) + (Input.isDown(Input.Keys.DOWN) ? -1 : 0);
          var horz = (Input.isDown(Input.Keys.RIGHT) ? 1 : 0) + (Input.isDown(Input.Keys.LEFT) ? -1 : 0);
          if(Input.isPressed(Input.Keys.SPACE)) {
            go.components.Gravity.velocity.set(0, 5, 0);
          }
          var linVelocity = new THREE.Vector3(0, 0, -this.linSpeed * vert * deltaTime);
          var angDelta = this.angSpeed * horz * deltaTime;
          go.transform.rotation.y -= angDelta;
          linVelocity.applyAxisAngle(new THREE.Vector3(0, 1, 0), go.transform.rotation.y);
          go.transform.position.add(linVelocity);
        }
      },
      Gravity: {
        velocity: new THREE.Vector3(0, 0, 0),
        update: function(go, deltaTime) {
          go.transform.position.add(this.velocity);
          this.velocity.add(new THREE.Vector3(0, (-35) * deltaTime, 0));
          if(go.transform.position.y < 32 && this.velocity.y < 0)
            this.velocity.y = 0.0;
        }
      }
    },
    children: {
      Sword: {
        transform: {
          position: new THREE.Vector3(-20, 0, -30),
          rotation: new THREE.Euler(-Math.PI/2, 0, 0),
          scale: new THREE.Vector3(1, 1, 1)
        },
        components: {
          Mesh: new MeshComponent({
            type: THREE.CylinderGeometry,
            params: [1, 5, 60]
          },
          {
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
          rotation: new THREE.Euler(Math.PI/2, 0, 0),
          scale: new THREE.Vector3(1, 1, 1)
        },
        components: {
          Mesh: new MeshComponent({
            type: THREE.CylinderGeometry,
            params: [10, 10, 5]
          },
          {
            type: THREE.MeshPhongMaterial,
            params: {
              color: 0xFFFFFF
            }
          }),
        },
      },
      Body: {
        components: {
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
        },
      },
      Head: {
        transform: {
          position: new THREE.Vector3(0, 30, 0),
          rotation: new THREE.Euler(0, 0, 0),
          scale: new THREE.Vector3(1, 1, 1)
        },
        components: {
          Mesh: new MeshComponent({
              type: THREE.SphereGeometry,
              params: [10, 32, 32]
            },
            {
              type: THREE.MeshPhongMaterial,
              params: {
                color: Math.random() * 0xFFFFFF
              }
            }
          ),
        },
      },
      Camera: {
        components: {
          Crosshair: {
            raycaster: new THREE.Raycaster(),
            goToTest: null,
            init: function(go) {
              this.goToTest = go.parent.parent;
            },
            update: function (go, deltaTime) {
              this.raycaster.setFromCamera( new THREE.Vector2(Input.Mouse.position.x, Input.Mouse.position.y), go.components.Camera.ref );
              var intersects = this.raycaster.intersectObjects( this.goToTest.children, true );
              if(intersects.length > 0){
                // The mesh will always be a children of a game object
                var hitScanned = this.goToTest.getObjectById(intersects[0].object.id).parent;
                if(_.hasIn(hitScanned.components.Hitscan, 'onHitScan')) {
                  hitScanned.components.Hitscan.onHitScan(hitScanned);
                }
              }
            }
          },

          // TODO: Create camera component
          Camera: {
            ref: null,
            init: function(go) {
              var specs = {
                VIEW_ANGLE: 45,
                NEAR: 0.1,
                FAR: 20000
              };
              var ASPECT = 4/3;
              var camera = new THREE.PerspectiveCamera( specs.VIEW_ANGLE, ASPECT, specs.NEAR, specs.FAR );
              camera.position.set(0, 100, 300);
              camera.lookAt(new THREE.Vector3(0, 0, 0));
              Engine.mainCamera = camera;
              this.ref = camera;
              go.add(camera);
            }
          }
        },
      },
    }
  },
  Skybox: {
    components: {
      Mesh: new MeshComponent({
          type: THREE.CubeGeometry,
          params: [10000, 10000, 10000]
        },
        {
          type: THREE.MeshBasicMaterial,
          params: { color: 0xAA419D, side: THREE.BackSide }
        }
      )
    }
  },
  Light: {
    transform: {
      position: new THREE.Vector3(0, 500, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    components: {
      // TODO: Create light components
      SpotLight: {
        light: null,
        init: function(go) {
          this.light = new THREE.SpotLight(0xffffff, 5.0, 1000, Math.PI/4, 0.5, 2);
          go.add(this.light);
        }
      },
      AmbientLight: {
        light: null,
        init: function(go) {
          this.light = new THREE.AmbientLight(0xFF00FF, 0.25);
          go.add(this.light);
        }
      },
    }
  },
  NetworkPlayers: {
    components: {
      NetworkPlayers: {
        PLAYER_LIMIT: 10,
        init: function(go) {
          var getNetPlayer = function(data) {
            var val = data.val();
            var pos = val.transform.position;
            // TODO: Add more support for "prefabs" and extending them ()
            var BaseGameObject = new GameObject(
                "playerNetwork_" + data.key,
                {
                  position: new THREE.Vector3(pos.x, pos.y, pos.z),
                  rotation: new THREE.Euler(0, 0, 0),
                  scale: new THREE.Vector3(1, 1, 1)
                }, {
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
                  Hitscan: {
                    init: function (go) {
                      this.canvas = document.createElement('canvas');
                    	this.context = this.canvas.getContext('2d');
                    	this.context.font = "Bold 20px Arial";
                    	this.context.fillStyle = "rgba(0,0,0,0.95)";

                    	this.texture = new THREE.Texture(this.canvas);
                    	this.texture.needsUpdate = true;

                    	var spriteMaterial = new THREE.SpriteMaterial( { map: this.texture } );

                    	this.sprite = new THREE.Sprite( spriteMaterial );
                    	this.sprite.scale.set(200,100,1.0);
                    	this.sprite.position.set( 0, 0, 0 );
                    	go.add( this.sprite );

                    },
                    update: function(go, deltaTime) {
                      if(!this.isHit && this.wasHit) {
                				this.context.clearRect(0,0,300,300);
                				this.texture.needsUpdate = true;
                			}
                      this.wasHit = this.isHit;
                      this.isHit = false;
                    },
                    isHit: false,
                    wasHit: false,
                    onHitScan: function(go) {
                      if ( !this.isHit && !this.wasHit ){
                			  this.context.clearRect(0,0,640,480);
                				var message = go._nameid;
                				var metrics = this.context.measureText(message);
                				var width = metrics.width;
                				this.context.fillStyle = "rgba(0,0,0,0.95)"; // black border
                				this.context.fillRect( 0,0, width+8,20+8);
                				this.context.fillStyle = "rgba(255,255,255,0.95)"; // white filler
                				this.context.fillRect( 2,2, width+4,20+4 );
                				this.context.fillStyle = "rgba(0,0,0,1)"; // text color
                				this.context.fillText( message, 4,20 );
                				this.texture.needsUpdate = true;
                			}
                      this.isHit = true;
                    }
                  }
                }, go);

            BaseGameObject.components.ServerNetworkTransform = {
              hasNewTransform: false,
              newTransform: {
                position: new THREE.Vector3(0, 0, 0),
              },
              update: function(go, deltaTime) {
                if(this.hasNewTransform) {
                  go.transform.position.copy(this.newTransform.position);
                  go.transform.rotation.copy(this.newTransform.rotation);
                  go.transform.scale.copy(this.newTransform.scale);
                  // TODO: make lerp or other predictions
                  this.hasNewTransform = false;
                }
              }
            };
          };

          var updateNetPlayer = function(data) {
            var val = data.val();
            var position = val.transform.position;
            var scale = val.transform.scale;
            var rotation = val.transform.rotation;
            var player = _.find(go.children, (c) => c._nameid === "playerNetwork_" + data.key);
            player.components.ServerNetworkTransform.hasNewTransform = true;
            player.components.ServerNetworkTransform.newTransform = {
              position: new THREE.Vector3(position.x, position.y, position.z),
              rotation: new THREE.Euler(rotation.x, rotation.y, rotation.z),
              scale: new THREE.Vector3(scale.x, scale.y, scale.z)
            };
          };

          FirebaseManager.database.ref("players").limitToLast(10).on('child_added', getNetPlayer);
          FirebaseManager.database.ref("players").limitToLast(10).on('child_changed', updateNetPlayer);
        }
      }
    }
  }
};
