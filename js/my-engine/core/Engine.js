// Node modules
const _ = require('lodash');
const THREE = require('three');

// External modules
const Stats = require('../libraries/Stats');
const Detector = require('../libraries/Detector');

// Internal modules
const Input = require('./Input');
const GameObject = require('./GameObject');
const LoadAssets = require('./LoadAssets');
const FirebaseManager = require('./FirebaseManager');
const Instantiate = require("./Instantiate");

module.exports = {
  // TODO? Generate things to load from hierarchy
  // Compile time? or Run Time?
  run: function(rawHierarchyGenerator, thingsToLoad, config) {

    if ( ! Detector.webgl ) {
      Detector.addGetWebGLMessage();
      return;
    }

    // Waits for stuff to be loaded
    LoadAssets(thingsToLoad).then(function(assets) {
      var firebase = new FirebaseManager(config.FIREBASE);
      var deps = {Firebase: firebase, Assets: assets};
      this.init(rawHierarchyGenerator, deps, config);
      this.animate();
    }.bind(this));
  },

  init: function(rawHierarchyGenerator, deps, config) {
    // Set specifications
    this.specs = config.INIT_SPECS;

    // Initialize clock
    this.clock = new THREE.Clock();

    //We create the WebGL renderer and add it to the document
    this.renderer = new THREE.WebGLRenderer( { antialias:true });
    this.renderer.setSize( this.specs.SCREEN_WIDTH, this.specs.SCREEN_HEIGHT );
    var container = document.getElementById(this.specs.CONTAINER_ID);
    container.appendChild( this.renderer.domElement );

    // Creates the hierarchy
    this.hierarchy = createHierarchy(rawHierarchyGenerator, deps);

    // Stats display
    if(this.specs.SHOW_STATS) {
      this.stats = new Stats();
    	this.stats.domElement.style.position = 'absolute';
    	this.stats.domElement.style.top = '0px';
    	this.stats.domElement.style.zIndex = 100;
    	container.appendChild( this.stats.domElement );
    }

    //Input
    Input.init(container.querySelector('canvas'));
  },

  // Works as the main loop
  // Might be weird for advanced physics and collisions that require fixed time updates
  // Study better fixed loose time architecture
  animate: function() {
    requestAnimationFrame(this.animate.bind(this));

    this.update();
  },

  update: function() {
    var deltaTime = this.clock.getDelta();
    // TODO? Make scene a game object so we only need do call scene.update
    _.forEach(_.filter(this.hierarchy.children, (c) => c instanceof GameObject), go => go.baseUpdate(deltaTime));

    // Renders the scene (hierarchy), viewed by the main camera
    if(_.isUndefined(this.mainCamera))
      console.error("Main Camera not set.");
    this.renderer.render(this.hierarchy, this.mainCamera);

    if(this.specs.SHOW_STATS)
      this.stats.update();

    Input.endUpdate();


  }
};

// Hierarchy creates a scene and adds everything specified on rawHierarchy
function createHierarchy(rawHierarchyGenerator, deps) {
  // Extending scene base to be an Hierarchy
  // This is basically a scene with GameObject children
  var hierarchy = new THREE.Scene();
  Instantiate(rawHierarchyGenerator, "Scene", hierarchy, deps);
  return hierarchy;
}
