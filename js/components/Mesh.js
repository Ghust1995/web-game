// Mesh Components
// This component is a Mesh + Material
// It will be put in the same transform as the game object containing it

const THREE = require('three');

function Mesh(geometry, material) {
  this.geometry = new geometry.type(...geometry.params);
  this.material = new material.type(material.params);
}

Mesh.prototype.init = function (go) {
  // should add global reference
  var mesh = new THREE.Mesh(this.geometry, this.material);
  go.add(mesh);
};

module.exports = Mesh;
