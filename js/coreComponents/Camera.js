// Camera Components
// This component is a camera to be put on the field

// Node Modules
const THREE = require('three');

// Engine Modules
const Engine = require('../engine/Engine');

var DEFAULT_SPECS = {
  VIEW_ANGLE: 45,
  NEAR: 0.1,
  FAR: 20000,
  ASPECT: 4/3,
};

function Camera(isMain, aspect, viewAngle, near, far) {
  this.ref = null;
  this.isMain = isMain || false;
  this.aspect = aspect || DEFAULT_SPECS.ASPECT;
  this.viewAngle = viewAngle || DEFAULT_SPECS.VIEW_ANGLE;
  this.near = near || DEFAULT_SPECS.NEAR;
  this.far = far || DEFAULT_SPECS.FAR;

}

Camera.prototype.init = function (go) {
  var camera = new THREE.PerspectiveCamera( this.viewAngle, this.aspect, this.near, this.far );
  if(this.isMain){
    Engine.mainCamera = camera;
  }
  this.ref = camera;
  go.add(camera);
};

Camera.prototype.setAsMainCamera = function () {
  Engine.mainCamera = this.ref;
};

module.exports = Camera;
