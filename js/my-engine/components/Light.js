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

module.exports = (type, ...params) => ({
  type: LightTypes[_.lowerCase(type)],
  params: params,
  init: function (go) {
    var Light = new this.type(...this.params);
    go.add(Light);
  }
});
