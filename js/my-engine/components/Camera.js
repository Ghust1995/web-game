// Camera Components
// This component is a camera to be put on the field

// Node Modules
const THREE = require('three');

// Engine Modules
const Engine = require('../core/Engine');

var DEFAULT_SPECS = {
  VIEW_ANGLE: 45,
  NEAR: 0.1,
  FAR: 20000,
  ASPECT: 4/3,
};

module.exports = (isMain, aspect, viewAngle, near, far) => ({
  ref: null,
  isMain: isMain || false,
  aspect: aspect || DEFAULT_SPECS.ASPECT,
  viewAngle: viewAngle || DEFAULT_SPECS.VIEW_ANGLE,
  near: near || DEFAULT_SPECS.NEAR,
  far: far || DEFAULT_SPECS.FAR,
  init: function (go) {
    var camera = new THREE.PerspectiveCamera( this.viewAngle, this.aspect, this.near, this.far );
    if(this.isMain){
      Engine.mainCamera = camera;
    }
    this.ref = camera;
    go.add(camera);
  },
  setAsMainCamera: function () {
    Engine.mainCamera = this.ref;
  }
});
