// Mesh Components
// This component is a Mesh + Material
// It will be put in the same transform as the game object containing it

const THREE = require('three');
const _ = require('lodash');

function Mesh(geometry, material, layer) {
  this.geometry = new geometry.type(...geometry.params);
  this.material = new material.type(material.params);
  this.layer = "Default";
}

Mesh.prototype.init = function (go) {
  // should add global reference
  var mesh = new THREE.Mesh(this.geometry, this.material);

  // Extending THREE mesh to do things on hitscan
  mesh.onHitScan = function() {
    _.forIn(_.pickBy(
                this.parent.components,
                (c)  => _.has(c, 'onHitScan') && c !== this),
            hs => {hs.onHitScan(this.parent);});
  };
  mesh.layer = this.layer;
  go.add(mesh);
};

module.exports = Mesh;
