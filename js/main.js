//  var GameObject = require("GameObject");

// Declarations
var container, scene, camera, renderer, controls, stats, hierarchy;
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

rawHierarchy = [
  {
    name: "Camera",
    scripts:[{
      init: function(go, deltaTime) {
        ASPECT = specs.SCREEN_WIDTH / specs.SCREEN_HEIGHT;
        go.camera = new THREE.PerspectiveCamera( specs.VIEW_ANGLE, ASPECT, specs.NEAR, specs.FAR );
        go.camera.position.set(specs.CAM_POS.X, specs.CAM_POS.Y, specs.CAM_POS.Z);
        go.camera.lookAt(new THREE.Vector3(0, 0, 0));
      }
    }],
  },
  {
    name: "Bola",
    geometry: {
      type: THREE.SphereGeometry,
      params: [10, 32, 32]
    },
    material: {
      type: THREE.MeshPhongMaterial,
      params: {
        color: 0x00a9ff
      }
    },
    transform: {
      position: new THREE.Vector3(-200, 0, 0),
      rotation: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    scripts: [{
      velocity: new THREE.Vector3(0, 0, 0),
      update: function(go, deltaTime) {
        if(Input.isPressed(Input.Keys.UP))
          this.velocity.copy(new THREE.Vector3(0, 500 * deltaTime, 0));
        go.transform.position.add(this.velocity);
        this.velocity.add(new THREE.Vector3(0, (-35) * deltaTime, 0));
        if(go.transform.position.y < -100 && this.velocity.y < 0)
          this.velocity.y = -this.velocity.y;

      }
    }]
  }
];

function createTHREEHierarchy(raw, scene) {
  hierarchy = [];
  raw.forEach(function (rawGO) {
    var newGO = new GameObject( rawGO.transform,
                                rawGO.geometry,
                                rawGO.material,
                                rawGO.scripts);
    scene.add(newGO.mesh);
    hierarchy.push(newGO);
  });

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
    init(INIT_SPECS);
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
  uniforms.uTime.value += clock.getDelta()*10.0;
  renderer.render(scene, camera);
  update();
}

function init(specs) {
  //First we initialize the scene and our camera
  scene = new THREE.Scene();



  //We create the WebGL renderer and add it to the document
  renderer = new THREE.WebGLRenderer( { antialias:true });
  renderer.setSize( specs.SCREEN_WIDTH, specs.SCREEN_HEIGHT );
  container = document.getElementById("WebGLContainer");
  container.appendChild( renderer.domElement );

  // Basic controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Stats display
  if(specs.SHOW_STATS) {
    stats = new Stats();
  	stats.domElement.style.position = 'absolute';
  	stats.domElement.style.top = '0px';
  	stats.domElement.style.zIndex = 100;
  	container.appendChild( stats.domElement );
  }

  //Input
  Input.registerKeys();

  // Light
  var light = new THREE.DirectionalLight(0xffffff, 1.0);
  light.position.set(0, 200, 50);
  scene.add(light);
  //var ambientLight = new THREE.ambientLight(0x111111);


	// make sure the camera's "far" value is large enough so that it will render the skyBox!
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	// BackSide: render faces from inside of the cube, instead of from outside (default).
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	scene.add(skyBox);

  //Load texture
  textureLoader = new THREE.TextureLoader();

  // TODO: Make possible to put this in hierarchy
  textureLoader.load( 'textures/checkerboard.jpg', function(floorTexture) {
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  	floorTexture.repeat.set( 10, 10 );
  	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
  	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
  	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  	floor.position.y = -100;
  	floor.rotation.x = Math.PI / 2;
  	//scene.add(floor);
  });


  for(let i = 0; i < 3; i++) {
    for(let j = 0; j < 3; j++) {
      //createDancingThing(light, new THREE.Vector3(-110 + i*110, -100 + j*100, 0), new THREE.Vector3(0.5,0.5,0.5));
    }
  }

  gDancingThing = createDancingThing(light, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1), new THREE.Euler(-Math.PI/2, 0, 0, "XYZ"));


  hierarchy = createTHREEHierarchy(rawHierarchy, scene);
}
var gDancingThing;

function createDancingThing(light, position, scale, rotation) {
  var materialColor = new THREE.Color();
	materialColor.setRGB(1.0, 0, 0);
	sMaterial = createShaderMaterial(light);
	sMaterial.uniforms.uMaterialColor.value.copy(materialColor);
	sMaterial.side = THREE.DoubleSide;
	var thing = new THREE.Mesh(
		new THREE.TorusKnotGeometry( 40, 8, 500, 16, 2, 5 ), sMaterial);
	scene.add(thing);
  thing.rotation.copy(rotation);
  thing.position.copy(position);
  thing.scale.copy(scale);
  return thing;
}

uniforms = {
  "uDirLightPos":	{ type: "v3", value: new THREE.Vector3() },
  "uDirLightColor": { type: "c", value: new THREE.Color( 0xFFFFFF ) },
  "uMaterialColor": { type: "c", value: new THREE.Color( 0xFFFFFF ) },
  "uRotationCenter":	{ type: "v3", value: new THREE.Vector3(0, 0, 0) },
  "uVelocity":	{ type: "v3", value: new THREE.Vector3(0, 0, 0) },
  uKd: {
    type: "f",
    value: 0.7
  },
  uBorder1: {
    type: "f",
    value: 0.6
  },
  uBorder2: {
    type: "f",
    value: 0.3
  },
  uTime: {
    type: "f",
    value: 0.0
  },

};

function createShaderMaterial(light) {
  var vs = LOADED_STUFF.vertShader;
  var fs = LOADED_STUFF.fragShader;
  var material = new THREE.ShaderMaterial({uniforms: uniforms, vertexShader: vs, fragmentShader: fs});
  material.uniforms.uDirLightPos.value = light.position;
  material.uniforms.uDirLightColor.value = light.color;
  return material;
}


var thingVelocity = new THREE.Vector3(0, 0, 0);

var force = -50000;
function addForce(value, time) {
  force = value;
  setTimeout(() => force = -50000, time);
}

function update() {
  var delta = clock.getDelta();
  hierarchy.forEach(go => go.baseUpdate(delta));
  UpdateDancingThing = (deltaTime) => {
      if(Input.isDown(Input.Keys.UP)) {
        //thingVelocity.copy(new THREE.Vector3(0, 3000, 0));
        force = 300000;

      }
      else {
        force = -50000;
      }

      gDancingThing.position.addScaledVector(thingVelocity, deltaTime);
      thingVelocity.add(new THREE.Vector3(0, (force) * deltaTime, 0));
      //if(gDancingThing.position.y < -100 && thingVelocity.y < 0)
        //thingVelocity.y = -thingVelocity.y;
      uniforms.uVelocity.value.set(0, 0, thingVelocity.y);
      console.log(thingVelocity);
  };
  UpdateDancingThing(delta);
  controls.update();
	stats.update();
  Input.update();
}
