const _ = require('lodash');
const THREE = require('three');

function GameObject(name, transform, components, parent) {
  THREE.Object3D.call(this);
  // Alias transform to Object3D properties
  // NOTE: Make sure this and properties are never set
  this.transform = {
    position: this.position,
    rotation: this.rotation,
    scale: this.scale
  };

  this.name = name;
  parent.add(this);

  //If transform is not defined, set to default transform
  if(!_.isUndefined(transform) && !_.isNull(transform)){
    this.position.copy(transform.position);
    this.rotation.copy(transform.rotation);
    this.scale.copy(transform.scale);
  }
  else {
    this.position.copy(new THREE.Vector3(0, 0, 0));
    this.rotation.copy(new THREE.Euler(0, 0, 0));
    this.scale.copy(new THREE.Vector3(1, 1, 1));
  }
  this.components = components;
  CallAllComponentsWithFunction(this.components, "init", this);
}

GameObject.prototype = Object.create(THREE.Object3D.prototype, {
  name: {
    value: _.uniqueId("gameObject_"),
    writable: true,
    configurable: true
  }
});

GameObject.prototype.constructor = GameObject;

// TODO: make custom components
GameObject.prototype.AddComponents = function(newComponents) {
  // Calls all init from new components
  CallAllComponentsWithFunction(newComponents, "init", this);

  //  Extend components
  _.extend(this.components, newComponents);
};

GameObject.prototype.baseUpdate = function(deltaTime) {
  // Updates all its children
  _.forEach(
    _.filter(this.children,
            (c) => c instanceof GameObject),
    (go) => go.baseUpdate(deltaTime));

  // Calls all update from components
  CallAllComponentsWithFunction(this.components, "update", this, deltaTime);
};

// Helper
function CallAllComponentsWithFunction(components, name, ...params) {
  _.each(_.values(components), (script) => {
    if(_.hasIn(script, name))
      script[name](...params);
  });
}

module.exports = GameObject;
