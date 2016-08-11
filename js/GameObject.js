const _ = require('lodash');
const THREE = require('three');

function GameObject(transform, mesh, scripts) {
  THREE.Object3D.call(this);
  if(this.scripts)
    _.each(this.scripts, (script) => {
      if(_.has(script, 'init'))
        script.init(this);
    });

  this.transform = transform;

  // Probably hardcode later for easy stuff
  if(!_.isUndefined(mesh)){
    var geometry = new mesh.geometry.type(...mesh.geometry.params);
    var material = new mesh.material.type(mesh.material.params);
    this.mesh = new THREE.Mesh(geometry, material);
    this.add(this.mesh);
  }

  this.scripts = scripts;
}

GameObject.prototype = Object.create(THREE.Object3D.prototype);

GameObject.prototype.constructor = GameObject;

GameObject.prototype.baseUpdate = function(deltaTime) {
  if(this.scripts)
    _.each(this.scripts, (script) => {
      if(_.has(script, 'update'))
        script.update(this, deltaTime);
    });
  // if(!_.isUndefined(this.mesh)) {
  //   this.position.copy(this.transform.position);
  //   this.rotation.copy(this.transform.rotation);
  //   this.scale.copy(this.transform.scale);
  // }

};

module.exports = GameObject;
