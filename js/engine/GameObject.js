const _ = require('lodash');
const THREE = require('three');

function GameObject(name, transform, components, parent) {
  THREE.Object3D.call(this);
  this.name = name;
  parent.add(this);

  //If transform is not defined, set to default transform
  if(!_.isUndefined(transform) && !_.isNull(transform)){
    this.transform = transform;
    setObject3dTransform(this, transform);
  }

  this.components = components;
  CallAllComponentsWithFunction(this.components, "init", this);
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
  name: {
    value: _.uniqueId("gameObject_"),
    writable: true,
    configurable: true
  }
});

GameObject.prototype.constructor = GameObject;

// Weird workaround to put stuff inside transform
// TODO: Make this in a better way or ignore
setObject3dTransform = function (o3dTo, tFrom) {
  o3dTo.position.copy(tFrom.position);
  o3dTo.rotation.copy(tFrom.rotation);
  o3dTo.scale.copy(tFrom.scale);
};

GameObject.prototype.baseUpdate = function(deltaTime) {
  // Updates all its children
  _.forEach(
    _.filter(this.children,
            (c) => c instanceof GameObject),
    (go) => go.baseUpdate(deltaTime));

  // Calls all update from components
  CallAllComponentsWithFunction(this.components, "update", this, deltaTime);
  setObject3dTransform(this, this.transform);
};

// Helper
function CallAllComponentsWithFunction(components, name, ...params) {
  _.each(_.values(components), (script) => {
    if(_.hasIn(script, name))
      script[name](...params);
  });
}

module.exports = GameObject;
