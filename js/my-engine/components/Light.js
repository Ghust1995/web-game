// Light Components
// This component is a light

// Node Modules
const THREE = require('three');
const _ = require('lodash');

LightTypes = {
  "ambient": THREE.AmbientLight,
  "directional": THREE.DirectionalLight,
  "hemisphere": THREE.HemisphereLight,
  "point": THREE.PointLight,
  "spot": THREE.SpotLight,
};

function Light(type, ...params) {
  this.type = LightTypes[_.lowerCase(type)];
  this.params = params;
}

Light.prototype.init = function (go) {
  var Light = new this.type(...this.params);
  go.add(Light);
};

module.exports = Light;
