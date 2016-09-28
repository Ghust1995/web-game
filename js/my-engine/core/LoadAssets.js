// Node modules
const _ = require('lodash');
const $ = require('jquery');

// Loads things specified on THINGS_TO_LOAD
function Load(thingsToLoad) {
  // TODO: Add some support for progress (see threejs loaders)
  var assets = {};
  return new Promise(function(resolve/*, reject*/) {
    var promises = _.map(thingsToLoad, (function(t) {
      return new Promise(function(resolve/*, reject*/) {
        // custom resolve
        var cResolve = (thing, data) => {
          if(_.has(thing, 'init')){
            thing.init(data);
          }
          resolve({name: thing.name, data: data });
        };

        // Uses a threejs loader if specified (used for textures, geometries)
        if(t.loader) {
          var tempLoader = Object.create(t.loader.prototype);
          tempLoader.load(t.path, (data) => cResolve(t, data));
        }
        // Uses jquery otherwise
        else {
          $.get(t.path, (data) => cResolve(t, data));
        }
      });
    }));
    Promise.all(promises).then(values => {
      _.forEach(values, v => {
        assets[v.name] = v.data;
      });
      resolve(assets);
    });
  });
}

module.exports = Load;
