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
const MeshComponent = require('../../coreComponents/Mesh');
const CameraComponent = require('../../coreComponents/Camera');
const NetworkTransformComponent = require('../../coreComponents/NetworkTransform');

// Custom Modules
//const CustomComponents = require('./CustomComponents');
const ServerPlayerView = require('./customGameObjects/ServerPlayerView');

var globalCamera = null;

module.exports = {
  TheWall : {
    transform: {
      position: new THREE.Vector3(0, 375, 500),
      rotation: new THREE.Euler(0, Math.PI, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    components: {
      PlaneMesh: {
        init: function(go) {
          this.renderTarget = new THREE.WebGLRenderTarget(512, 512, { format: THREE.RGBFormat } );
          var TVMaterial = new THREE.MeshBasicMaterial({map: this.renderTarget.texture});
          var TVGeometry = new THREE.PlaneGeometry(1000, 750, 1, 1);
          var TVMesh = new THREE.Mesh(TVGeometry, TVMaterial);
          go.add(TVMesh);
        },
        update: function(go, deltaTime) {
          var camChild = go.getObjectByName("Camera");
          Engine.renderer.render(Engine.hierarchy, camChild.components.Camera.ref, this.renderTarget);
        },
      },
    },
    children: {
      Camera: {
        transform: {
          position: new THREE.Vector3(0, 375, 0),
          rotation: new THREE.Euler(Math.PI/4, Math.PI, 0),
          scale: new THREE.Vector3(1, 1, 1)
        },
        components: {
          Camera: new CameraComponent(false),
        }
      }
    }
  },

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
      ThirdPersonCamera: {
        transform: {
          position: new THREE.Vector3(0, 50, 300),
          rotation: new THREE.Euler(0, 0, 0),
          scale: new THREE.Vector3(1, 1, 1)
        },
        components: {
          Camera: new CameraComponent(true),
          Crosshair: {
            raycaster: new THREE.Raycaster(),
            // Add a better (possibly readonly reference to the scene)
            scene: null,
            init: function(go) {
              globalCamera = go.components.Camera.ref;
              this.scene = go.parent.parent;
            },
            update: function (go, deltaTime) {
              this.raycaster.setFromCamera( new THREE.Vector2(Input.Mouse.position.x, Input.Mouse.position.y), go.components.Camera.ref );
              var objsToTest = this.scene.getObjectByName("NetworkPlayers");
              var intersects = this.raycaster.intersectObjects( objsToTest.children, true );
              if(intersects.length > 0){
                //
                var hitObjects = _.map(intersects, (i) => objsToTest.getObjectById(i.object.id));
                var firstHit = _.find(
                  hitObjects,
                  (h) => h.layer === "Default");
                if(firstHit){
                  if(_.hasIn(firstHit, 'onHitScan')){
                    firstHit.onHitScan();
                  }
                }
              }
            }
          },


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
        BaseGameObject: ServerPlayerView,
        init: function(go) {
          var getNetPlayer = function(data) {
            var val = data.val();
            var position = val.transform.position;
            var scale = val.transform.scale;
            var rotation = val.transform.rotation;
            var name = val.name;
            // TODO: Refactor both Hitscan and ServerNetworkTransform
            var baseGameObject = new this.BaseGameObject(name, null, go);

            baseGameObject.AddComponents({ServerNetworkTransform: {
                key: data.key,
                hasNewTransform: false,
                newTransform: {
                  position: new THREE.Vector3(0, 0, 0),
                  rotation: new THREE.Euler(0, 0, 0),
                  scale: new THREE.Vector3(1, 1, 1)
                },
                init: function(go) {
                  go.transform.position.copy(new THREE.Vector3(position.x, position.y, position.z));
                  go.transform.rotation.copy(new THREE.Euler(rotation.x, rotation.y, rotation.z));
                  go.transform.scale.copy(new THREE.Vector3(scale.x, scale.y, scale.z));
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
              }
            });
          }.bind(this);

          var updateNetPlayer = function(data) {
            var val = data.val();
            var position = val.transform.position;
            var scale = val.transform.scale;
            var rotation = val.transform.rotation;
            var player = _.find(go.children, (c) => c.components.ServerNetworkTransform &&
                                                    c.components.ServerNetworkTransform.key === data.key);
            player.components.ServerNetworkTransform.hasNewTransform = true;
            player.components.ServerNetworkTransform.newTransform = {
              position: new THREE.Vector3(position.x, position.y, position.z),
              rotation: new THREE.Euler(rotation.x, rotation.y, rotation.z),
              scale: new THREE.Vector3(scale.x, scale.y, scale.z)
            };
          };
          // TODO: Make object be removed on delete
          FirebaseManager.database.ref("players").limitToLast(10).on('child_added', getNetPlayer);
          FirebaseManager.database.ref("players").limitToLast(10).on('child_changed', updateNetPlayer);
        }
      }
    }
  }
};
