const _ = require('lodash');
const THREE = require('three');

function GameObject(transform, mesh, scripts, parent) {
  THREE.Object3D.call(this);

  //If transform is not defined, set to default transform
  if(!_.isUndefined(transform)){
    this.transform = transform;
    setObject3dTransform(this, transform);
  }

  this.scripts = scripts;
  _.each(this.scripts, (script) => {
    if(_.has(script, 'init'))
      script.init(this);
  });

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
  }
});

GameObject.prototype.constructor = GameObject;

setObject3dTransform = function (o3dTo, tFrom) {
  o3dTo.position.copy(tFrom.position);
  o3dTo.rotation.copy(tFrom.rotation);
  o3dTo.scale.copy(tFrom.scale);
};

GameObject.prototype.baseUpdate = function(deltaTime) {
  if(this.scripts){
    _.each(this.scripts, (script) => {
      if(_.has(script, 'update'))
        script.update(this, deltaTime);
    });
  }
  setObject3dTransform(this, this.transform);
};

module.exports = GameObject;
