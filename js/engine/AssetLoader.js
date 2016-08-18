// Node modules
const _ = require('lodash');
const $ = require('jquery');

AssetLoader = {
  Assets: {},
  // Loads things specified on THINGS_TO_LOAD
  // TODO: Add some support for progress (see threejs loaders)
  load: function(thingsToLoad, callback) {
    var promises = thingsToLoad.map(function(t) {
      return new Promise(function(resolve, reject) {
        // Uses a threejs loader if specified (used for textures, geometries)
        if(t.loader) {
          var tempLoader = Object.create(t.loader.prototype);
          tempLoader.load(t.path, (data) => resolve({name: t.name, data: data }));
        }
        // Uses jquery otherwise
        else {
          $.get(t.path, (data) => resolve({name: t.name, data: data }));
        }
      });
    });
    Promise.all(promises).then(values => {
      _.forEach(values, v => this.Assets[v.name] = v.data);
      callback();
    });
  }
};

module.exports = AssetLoader;
