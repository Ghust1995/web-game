const Input = require('./Input');
const GameObject = require('./GameObject');
const _ = require('lodash');
const THREE = require('three');
const $ = require('jquery');
const Detector = require('../libraries/Detector');
const Stats = require('../libraries/Stats');

var container, camera, renderer, controls, stats, hierarchy, gLight;
var clock = new THREE.Clock();

INIT_SPECS = {
  SCREEN_WIDTH: 800,
  SCREEN_HEIGHT: 600,
  VIEW_ANGLE: 45,
  NEAR: 0.1,
  FAR: 20000,
  CAM_POS: {
    X: 0, Y: 0, Z: 400
  },
  SHOW_STATS: true
};

rawHierarchy = {
  Camera: {
    scripts:[{
      init: function(go) {
        ASPECT = INIT_SPECS.SCREEN_WIDTH / INIT_SPECS.SCREEN_HEIGHT;
        camera = new THREE.PerspectiveCamera( INIT_SPECS.VIEW_ANGLE, ASPECT, INIT_SPECS.NEAR, INIT_SPECS.FAR );
        camera.position.set(INIT_SPECS.CAM_POS.X, INIT_SPECS.CAM_POS.Y, INIT_SPECS.CAM_POS.Z);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        go.add(camera);
      }
    }],
  },
  Floor: {
    scripts:[{
      init: function(go) {
        textureLoader = new THREE.TextureLoader();
        textureLoader.load( 'textures/checkerboard.jpg', function(floorTexture) {
          floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        	floorTexture.repeat.set( 10, 10 );
        	var floorMaterial = new THREE.MeshPhongMaterial( { map: floorTexture, side: THREE.DoubleSide } );
        	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
        	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        	floor.position.y = -100;
        	floor.rotation.x = Math.PI / 2;
        	go.add(floor);
        });
      }
    }]
  },
  Player: {
    transform: {
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    mesh: {
      geometry: {
      type: THREE.SphereGeometry,
      params: [10, 32, 32]
      },
      material: {
        type: THREE.MeshPhongMaterial,
        params: {
          color: 0x00a9ff
        }
      }
    },
    scripts: [{
      velocity: new THREE.Vector3(0, 0, 0),
      update: function(go, deltaTime) {
        if(Input.isPressed(Input.Keys.UP))
          this.velocity.copy(new THREE.Vector3(0, 1, 0));
        //go.transform.position.add(this.velocity);
        this.velocity.add(new THREE.Vector3(0, (-35) * deltaTime, 0));
        if(go.transform.position.y < -100 && this.velocity.y < 0)
          this.velocity.y = 0.0;
      }
    }],
    children: {
      Sword: {
        transform: {
          position: new THREE.Vector3(-10, 32, 0),
          rotation: new THREE.Euler(0, 0, 0),
          scale: new THREE.Vector3(1, 1, 1)
        },
        mesh: {
          geometry: {
          type: THREE.BoxGeometry,
          params: [1, 50, 1]
          },
          material: {
            type: THREE.MeshPhongMaterial,
            params: {
              color: 0xFFFFFF
            }
          }
        }
      }
    },
  },
  Skybox: {
    scripts: [{
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
      position: new THREE.Vector3(0, 200, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    scripts: [{
      totalTime: 0,
      light: null,
      init: function(go) {
        this.light = new THREE.SpotLight(0xffffff, 1.0, 1000, Math.PI/4, 0.5, 2);
        gLight = this.light;
        go.add(this.light);
      },
    }]
  }
};

function createAllChildren(childrenRaw, parentgo) {
  _.forIn(childrenRaw, function (val, key) {
    var newGO = new GameObject( key,
                                val.transform,
                                val.mesh,
                                val.scripts,
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

//Loading stuff
THINGS_TO_LOAD = [
  {
    name: "fragShader",
    path: "/shaders/test.frag"
  },
  {
    name: "vertShader",
    path: "/shaders/test.vert"
  }
];
LOADED_STUFF = {};

// Script to run
window.onload = function() {
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
      $.get(t.path, (data) => resolve({name: t.name, data: data }));
    });
  });
  return Promise.all(promises);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(hierarchy, camera);
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
