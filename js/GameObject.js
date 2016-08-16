const _ = require('lodash');
const THREE = require('three');

function GameObject(name, transform, mesh, scripts, parent) {
  THREE.Object3D.call(this);

  this._nameid = name;

  //If transform is not defined, set to default transform
  if(!_.isUndefined(transform)){
    this.transform = transform;
    setObject3dTransform(this, transform);
  }

  this.scripts = scripts;
  CallAllScriptsWithFunction(this.scripts, "init", this);

  // Probably hardcode later for easy stuff
  if(!_.isUndefined(mesh)){
    var geometry = new mesh.geometry.type(...mesh.geometry.params);
    var material = new mesh.material.type(mesh.material.params);
    this.mesh = new THREE.Mesh(geometry, material);
    this.add(this.mesh);
  }

  parent.add(this);
}

GameObject.prototype = Object.create(THREE.Object3D.prototype, {
  transform: {
    value: {
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    writable: true,
    configurable: true
  },
  _nameid: {
    value: _.uniqueId("gameObject_"),
    writable: true,
    configurable: true
  }
});

GameObject.prototype.constructor = GameObject;

setObject3dTransform = function (o3dTo, tFrom) {
  o3dTo.position.copy(tFrom.position);
  o3dTo.rotation.copy(tFrom.rotation);
  o3dTo.scale.copy(tFrom.scale);
};

GameObject.prototype.baseUpdate = function(deltaTime) {
  // Updates all its children
  _.forEach(_.filter(this.children, (c) => c instanceof GameObject), go => go.baseUpdate(deltaTime));

  // Calls all update scripts
  CallAllScriptsWithFunction(this.scripts, "update", this,  deltaTime);
  setObject3dTransform(this, this.transform);
};

// Helper
function CallAllScriptsWithFunction(scripts, name, ...params) {
  _.each(scripts, (script) => {
    if(_.has(script, name))
      script[name](...params);
  });
}

module.exports = GameObject;
