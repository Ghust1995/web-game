const _ = require('lodash');
const THREE = require('three');

function GameObject(name, transform, mesh, components, parent) {
  THREE.Object3D.call(this);

  this._nameid = name;

  //If transform is not defined, set to default transform
  if(!_.isUndefined(transform)){
    this.transform = transform;
    setObject3dTransform(this, transform);
  }

  //TODO: make components an object instead of a list
  this.components = components;
  CallAllComponentsWithFunction(this.components, "init", this);

  // Probably hardcode later for easy stuff
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

  // Calls all update from components
  CallAllComponentsWithFunction(this.components, "update", this,  deltaTime);
  setObject3dTransform(this, this.transform);
};

// Helper
function CallAllComponentsWithFunction(components, name, ...params) {
  _.each(components, (script) => {
    if(_.hasIn(script, name))
      script[name](...params);
  });
}

module.exports = GameObject;
