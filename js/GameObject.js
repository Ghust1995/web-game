function GameObject(transform, geometry, material, scripts) {
  this.geometry = new geometry.type(...geometry.params);
  this.material = new material.type(material.params);
  this.mesh = new THREE.Mesh(this.geometry, this.material);
  this.transform = transform;
  this.scripts = scripts;
}

GameObject.prototype.baseUpdate = function(deltaTime) {
  if(this.scripts)
    this.scripts.forEach(s => s.update(this, deltaTime));

  this.mesh.position.copy(this.transform.position);
  this.mesh.rotation.copy(this.transform.rotation);
  this.mesh.scale.copy(this.transform.scale);
};

module.exports = GameObject;
