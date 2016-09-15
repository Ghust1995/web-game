// Node modules
const _ = require('lodash');
const THREE = require('three');
const $ = require('jquery');

// External modules
const Detector = require('../libraries/Detector');

// Internal modules
const Engine = require('./engine/Engine');

// Put global initial specifications here
const INIT_SPECS = {
  SCREEN_WIDTH: 800,
  SCREEN_HEIGHT: 600,
  SHOW_STATS: true,
  CONTAINER_NAME: "WebGLContainer"
};

// TODO? Populate this at runtime somehow
const THINGS_TO_LOAD = [
  {
    name: "fragShader",
    path: "/shaders/test.frag"
  },
  {
    name: "vertShader",
    path: "/shaders/test.vert"
  },
  {
    loader: THREE.TextureLoader,
    name: "floorTexture",
    path: "/textures/checkerboard.jpg",
    init: function(asset) {
      asset.wrapS = asset.wrapT = THREE.RepeatWrapping;
      asset.repeat.set( 10, 10 );
    }
  }
];

// RAW_HIERARCHY is the initial specification of the scene, this works pretty close to unity
// Each game object has a transform and components specifications
// If there is a reusable component, move it to a component module (see meshComponent)
// See scenes/Test01
const RAW_HIERARCHY = require("./scenes/hidenseek/Test01");

window.onload = function() {
  // Verifies if the browser supports webgl
  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
  Engine.run(RAW_HIERARCHY, THINGS_TO_LOAD, INIT_SPECS);
};
