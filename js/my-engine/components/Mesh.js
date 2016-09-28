// Mesh Components
// This component is a Mesh + Material
// It will be put in the same transform as the game object containing it

// Node Modules
const THREE = require('three');
const _ = require('lodash');

module.exports = (geometry, material, layer) => ({
  geometry: new geometry.type(...geometry.params),
  material: new material.type(material.params),
  layer: "Default",
  init: function (go) {
    // should add global reference
    var mesh = new THREE.Mesh(this.geometry, this.material);

    // Extending THREE mesh to do things on hitscan
    mesh.onHitScan = function() {
      _.forIn(_.pickBy(
                  this.parent.components,
                  (c)  => _.hasIn(c, 'onHitScan') && c !== this),
              hs => {hs.onHitScan(this.parent);});
    };
    mesh.layer = this.layer;
    go.add(mesh);
  }
});
