const THREE = require('three');

function Mesh(geometry, material) {
  this.geometry = new geometry.type(...geometry.params);
  this.material = new material.type(material.params);
}

Mesh.prototype.init = function (go) {
  // should add global reference?
  // TODO: should do this another way?
  var mesh = new THREE.Mesh(this.geometry, this.material);
  go.add(mesh);
};

module.exports = Mesh;
