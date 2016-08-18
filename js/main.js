// Node modules
const _ = require('lodash');
const THREE = require('three');
const $ = require('jquery');

// External modules
const Detector = require('../libraries/Detector');
const Stats = require('../libraries/Stats');

// Internal modules
const Input = require('./Input');
const GameObject = require('./GameObject');
const MeshComponent = require('./components/Mesh');

// Global variables
// TODO: Clean as much as possible of this
// TODO: Future, make most of this file an "engine" module
var container, mainCamera, renderer, controls, stats, hierarchy;
var clock = new THREE.Clock();

// Put global initial specifications here
INIT_SPECS = {
  SCREEN_WIDTH: 800,
  SCREEN_HEIGHT: 600,
  SHOW_STATS: true
};

// TODO? Populate this at runtime somehow
THINGS_TO_LOAD = [
  {
    name: "fragShader",
    path: "/shaders/test.frag"
  },
  {
    name: "vertShader",
    path: "/shaders/test.vert"
  },
  {
    name: "rawHierarchy",
    path: "/scenes/test01.js"
  },
  {
    loader: THREE.TextureLoader,
    name: "floorTexture",
    path: "/textures/checkerboard.jpg"
  }

];
// TODO: Give a better name for this. Assets?
LOADED_STUFF = {};

// rawHierarchy is the initial specification of the scene, this works pretty close to unity
// Each game object has a transform and components specifications
// If there is a reusable component, move it to a component module (see meshComponent)
// TODO: move to another file
// Dependecies to remove: (stuff to make global / static)
// MainCamera
// LOADED_STUFF -> add to each object?
// TODO: move everything to components (ex.: mesh, light, );
rawHierarchy = {
  Floor: {
    transform: {
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(Math.PI / 2, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    components: {
      FloorMesh : {
        init: function(go) {
          LOADED_STUFF.floorTexture.wrapS = LOADED_STUFF.floorTexture.wrapT = THREE.RepeatWrapping;
        	LOADED_STUFF.floorTexture.repeat.set( 10, 10 );
        	var floorMaterial = new THREE.MeshPhongMaterial( { map: LOADED_STUFF.floorTexture, side: THREE.DoubleSide } );
        	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
        	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        	//floor.position.y = -100;
        	//floor.rotation.x = Math.PI / 2;
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
          Camera: {
            init: function(go) {
              specs = {
                VIEW_ANGLE: 45,
                NEAR: 0.1,
                FAR: 20000
              };
              ASPECT = 4/3;
              mainCamera = new THREE.PerspectiveCamera( specs.VIEW_ANGLE, ASPECT, specs.NEAR, specs.FAR );
              mainCamera.position.set(0, 100, 300);
              mainCamera.lookAt(new THREE.Vector3(0, 0, 0));
              go.add(mainCamera);
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
  }
};

// Hierarchy creates a scene and adds everything specified on rawHierarchy
function createTHREEHierarchy(rawHierarchy) {
  // Extending scene base to be an Hierarchy
  // This is basically a scene with GameObject children
  var hierarchy = new THREE.Scene();
  // Recursively constructs game objects and add them to their parents;
  (function createAllChildren(childrenRaw, parentgo) {
    _.forIn(childrenRaw, function (val, key) {
      var newGO = new GameObject( key,
                                  val.transform,
                                  val.mesh,
                                  val.components,
                                  parentgo);

      createAllChildren(val.children, newGO);
    });
  })(rawHierarchy, hierarchy);
  return hierarchy;
}

window.onload = function() {
  // Verifies if the browser supports webgl
  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

  // Waits for stuff to be loaded
  loadStuff(THINGS_TO_LOAD).then(values => {
    // Populates LOADED_STUFF "global" variable
    values.forEach(v => LOADED_STUFF[v.name] = v.data);
    init();
    animate();
  });
};

// Loads things specified on THINGS_TO_LOAD
function loadStuff(thingsToLoad) {
  var promises = thingsToLoad.map(function(t) {
    return new Promise(function(resolve, reject) {
      // Uses a threejs loader if specified (used for textures, geometries)
      if(t.loader) {
        var tempLoader = Object.create(t.loader.prototype);
        tempLoader.load(t.path, (data) => resolve({name: t.name, data: data }));
      }
      // Uses jquery otherwise
      else {
        $.get(t.path, (data) => resolve({name: t.name, data: data }));
      }
    });
  });
  return Promise.all(promises);
}

function init() {
  // Creates the hierarchy
  hierarchy = createTHREEHierarchy(rawHierarchy);

  //We create the WebGL renderer and add it to the document
  renderer = new THREE.WebGLRenderer( { antialias:true });
  renderer.setSize( INIT_SPECS.SCREEN_WIDTH, INIT_SPECS.SCREEN_HEIGHT );
  container = document.getElementById("WebGLContainer");
  container.appendChild( renderer.domElement );

  // Stats display
  if(INIT_SPECS.SHOW_STATS) {
    stats = new Stats();
  	stats.domElement.style.position = 'absolute';
  	stats.domElement.style.top = '0px';
  	stats.domElement.style.zIndex = 100;
  	container.appendChild( stats.domElement );
  }

  //Input
  Input.registerKeys();
}

// Works as the main loop
// Might be weird for advanced physics and collisions that require fixed time updates
// Study better fixed loose time architecture
function animate() {
  requestAnimationFrame(animate);
  // Renders the scene (hierarchy), viewed by the main camera
  renderer.render(hierarchy, mainCamera);
  update();
}

function update() {
  var deltaTime = clock.getDelta();
  // TODO? Make scene a game object so we only need do call scene.update
  _.forEach(_.filter(hierarchy.children, (c) => c instanceof GameObject), go => go.baseUpdate(deltaTime));

  Input.update();
  stats.update();
}
