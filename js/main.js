// Node modules
const _ = require('lodash');
const THREE = require('three');
const $ = require('jquery');

// Internal modules
const Engine = require('my-engine');

// Configuration
const CONFIGURATION = require('./engine-config');

// TODO? Populate this at runtime somehow
const THINGS_TO_LOAD = [
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
  Engine.run(RAW_HIERARCHY, THINGS_TO_LOAD, CONFIGURATION);
};
