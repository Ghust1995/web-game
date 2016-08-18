const Input = require('./Input');
const GameObject = require('./GameObject');
const _ = require('lodash');
const THREE = require('three');
const $ = require('jquery');
const Detector = require('../libraries/Detector');
const Stats = require('../libraries/Stats');
const MeshComponent = require('./components/Mesh');

var container, mainCamera, renderer, controls, stats, hierarchy;
var clock = new THREE.Clock();

INIT_SPECS = {
  SCREEN_WIDTH: 800,
  SCREEN_HEIGHT: 600,
  SHOW_STATS: true
};

//Loading stuff
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
LOADED_STUFF = {};

// TODO: move to another file
// Dependecies to remove: (stuff to make global / static)
// MainCamera
// Input
// LOADED_STUFF -> add to each object?
// TODO: move everything to components (mesh);
rawHierarchy = {
  Floor: {
    transform: {
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(Math.PI / 2, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    components:[{
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
    }]
  },
  Player: {
    transform: {
      position: new THREE.Vector3(0, 32, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    components: [
      {
        linSpeed: 80,
        angSpeed: 4,
        update: function(go, deltaTime) {
          var vert = (Input.isDown(Input.Keys.UP) ? 1 : 0) + (Input.isDown(Input.Keys.DOWN) ? -1 : 0);
          var horz = (Input.isDown(Input.Keys.RIGHT) ? 1 : 0) + (Input.isDown(Input.Keys.LEFT) ? -1 : 0);
          var linVelocity = new THREE.Vector3(0, 0, -this.linSpeed * vert * deltaTime);
          var angDelta = this.angSpeed * horz * deltaTime;
          go.transform.rotation.y -= angDelta;
          linVelocity.applyAxisAngle(new THREE.Vector3(0, 1, 0), go.transform.rotation.y);
          go.transform.position.add(linVelocity);
        }
      },
      {
        velocity: new THREE.Vector3(0, 0, 0),
        update: function(go, deltaTime) {
          if(Input.isPressed(Input.Keys.SPACE)) {
            this.velocity.set(0, 5, 0);
          }
          go.transform.position.add(this.velocity);
          this.velocity.add(new THREE.Vector3(0, (-35) * deltaTime, 0));
          if(go.transform.position.y < 32 && this.velocity.y < 0)
            this.velocity.y = 0.0;
        }
      }
    ],
    children: {
      Sword: {
        transform: {
          position: new THREE.Vector3(-20, 0, -30),
          rotation: new THREE.Euler(-Math.PI/2, 0, 0),
          scale: new THREE.Vector3(1, 1, 1)
        },
        components: [
          new MeshComponent({
            type: THREE.CylinderGeometry,
            params: [1, 5, 60]
          },
          {
            type: THREE.MeshPhongMaterial,
            params: {
              color: 0xFFFFFF
            }
          }),
        ],
      },
      Shield: {
        transform: {
          position: new THREE.Vector3(20, 0, -20),
          rotation: new THREE.Euler(Math.PI/2, 0, 0),
          scale: new THREE.Vector3(1, 1, 1)
        },
        components: [
          new MeshComponent({
            type: THREE.CylinderGeometry,
            params: [10, 10, 5]
          },
          {
            type: THREE.MeshPhongMaterial,
            params: {
              color: 0xFFFFFF
            }
          }),
        ],
      },
      Body: {
        components: [
          new MeshComponent({
            type: THREE.SphereGeometry,
            params: [20, 32, 32]
          },
          {
            type: THREE.MeshPhongMaterial,
            params: {
              color: Math.random() * 0xFFFFFF
            }
          }),
        ],
      },
      Head: {
        transform: {
          position: new THREE.Vector3(0, 30, 0),
          rotation: new THREE.Euler(0, 0, 0),
          scale: new THREE.Vector3(1, 1, 1)
        },
        components: [
          new MeshComponent({
            type: THREE.SphereGeometry,
            params: [10, 32, 32]
          },
          {
            type: THREE.MeshPhongMaterial,
            params: {
              color: Math.random() * 0xFFFFFF
            }
          }),
        ],
      },
      Camera: {
        components:[{
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
        }],
      },
    }
  },
  Skybox: {
    components: [{
      init: function(go) {
        // make sure the camera's "far" value is large enough so that it will render the skyBox!
      	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
      	// BackSide: render faces from inside of the cube, instead of from outside (default).
      	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x000055, side: THREE.BackSide } );
      	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
      	go.add(skyBox);
      }
    }]
  },
  Light: {
    transform: {
      position: new THREE.Vector3(0, 500, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    components: [
      {
        light: null,
        init: function(go) {
          this.light = new THREE.SpotLight(0xffffff, 5.0, 1000, Math.PI/4, 0.5, 2);
          go.add(this.light);
        }
      },
      {
        light: null,
        init: function(go) {
          this.light = new THREE.AmbientLight(0xffffff, 0.25);
          go.add(this.light);
        }
      },
    ]
  }
};

function createAllChildren(childrenRaw, parentgo) {
  _.forIn(childrenRaw, function (val, key) {
    var newGO = new GameObject( key,
                                val.transform,
                                val.mesh,
                                val.components,
                                parentgo);

    createAllChildren(val.children, newGO);
  });
}
// Hierarchy creates a scene and adds everything specified on rawrawHierarchy
function createTHREEHierarchy(rawHierarchy) {
  // Extending scene base to be an Hierarchy
  // This is basically a scene with GameObject children
  var hierarchy = new THREE.Scene();
  createAllChildren(rawHierarchy, hierarchy);
  return hierarchy;
}


// Script to run
window.onload = function() {
  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
  loadStuff(THINGS_TO_LOAD).then(values => {
    values.forEach(v => LOADED_STUFF[v.name] = v.data);
    init();
    animate();
  });
};

// Funtion definitions
function loadStuff(thingsToLoad) {
  var promises = thingsToLoad.map(function(t) {
    return new Promise(function(resolve, reject) {

      if(t.loader) {
        var tempLoader = Object.create(t.loader.prototype);
        tempLoader.load(t.path, (data) => resolve({name: t.name, data: data }));
      }
      else {
        $.get(t.path, (data) => resolve({name: t.name, data: data }));
      }

    });
  });
  return Promise.all(promises);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(hierarchy, mainCamera);
  update();
}

function init() {
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

function update() {
  var deltaTime = clock.getDelta();
  // Make scene a game object so we only need do call scene?
  _.forEach(_.filter(hierarchy.children, (c) => c instanceof GameObject), go => go.baseUpdate(deltaTime));

	stats.update();
  Input.update();
}
