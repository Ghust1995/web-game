// Node modules
const _ = require('lodash');
const THREE = require('three');

// External modules
const Stats = require('../../libraries/Stats');

// Internal modules
const Input = require('./Input');
const GameObject = require('./GameObject');
const AssetLoader = require('./AssetLoader');

Engine = {
  // TODO? Generate things to load from hierarchy
  // Compile time? or Run Time?
  run: function(rawHierarchy, thingsToLoad, initSpecs) {
    // Waits for stuff to be loaded
    AssetLoader.load(thingsToLoad, function() {
      this.init(rawHierarchy, initSpecs);
      this.animate();
    }.bind(this));
  },

  init: function(rawHierarchy, initSpecs) {
    // Set specifications
    this.specs = initSpecs;

    // Initialize clock
    this.clock = new THREE.Clock();

    // Creates the hierarchy
    this.hierarchy = createHierarchy(rawHierarchy);

    //We create the WebGL renderer and add it to the document
    this.renderer = new THREE.WebGLRenderer( { antialias:true });
    this.renderer.setSize( initSpecs.SCREEN_WIDTH, initSpecs.SCREEN_HEIGHT );
    var container = document.getElementById(this.specs.CONTAINER_NAME);
    container.appendChild( this.renderer.domElement );

    // Stats display
    if(this.specs.SHOW_STATS) {
      this.stats = new Stats();
    	this.stats.domElement.style.position = 'absolute';
    	this.stats.domElement.style.top = '0px';
    	this.stats.domElement.style.zIndex = 100;
    	container.appendChild( this.stats.domElement );
    }

    //Input
    Input.registerKeys();
  },

  // Works as the main loop
  // Might be weird for advanced physics and collisions that require fixed time updates
  // Study better fixed loose time architecture
  animate: function() {
    requestAnimationFrame(this.animate.bind(this));
    // Renders the scene (hierarchy), viewed by the main camera
    if(_.isUndefined(this.mainCamera))
      console.error("Main Camera not set.");
    this.renderer.render(this.hierarchy, this.mainCamera);
    this.update();
  },

  update: function() {
    var deltaTime = this.clock.getDelta();
    // TODO? Make scene a game object so we only need do call scene.update
    _.forEach(_.filter(this.hierarchy.children, (c) => c instanceof GameObject), go => go.baseUpdate(deltaTime));

    Input.update();
    if(this.specs.SHOW_STATS)
      this.stats.update();
  }
};

// Hierarchy creates a scene and adds everything specified on rawHierarchy
function createHierarchy(rawHierarchy) {
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

module.exports = Engine;
