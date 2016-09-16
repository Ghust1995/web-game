const fs      = require('fs-extra');
const watch   = require("watch");
const _       = require("lodash");
var npm       = require('npm');

const localDepRegex = /^\.(\/[a-zA-Z\-_0-9]+)+\/?$/;

var list = [];

fs.readFile("./package.json", 'utf8', function(err, packagejson) {
  if (err) {
    return console.log(err);
  }

  dependencies = (JSON.parse(packagejson)).dependencies;
  localDependencies = _.pickBy(dependencies, (d) => localDepRegex.test(d));

  _.forOwn(localDependencies, function(localDepencyRoot, localDependecyName) {
    createDependencyMonitor(localDepencyRoot, localDependecyName);
    console.log("Added watch to ",localDependecyName, ": ", localDepencyRoot);
  });
});

function createDependencyMonitor(libRoot, libName) {
  watch.createMonitor("./" + libRoot, function (monitor) {
    monitor.on("created", function (f, stat) {
      console.log("Created file in ", libRoot);
      CopyLib(libRoot, libName);
    });
    monitor.on("changed", function (f, curr, prev) {
      console.log("Changed file in ", libRoot);
      CopyLib(libRoot, libName);
    });
    monitor.on("removed", function (f, stat) {
      console.log("Removed file in ", libRoot);
      CopyLib(libRoot, libName);
    });
  });
}

function CopyLib(origin, name) {
  destinationFolder = "./node_modules/";
  console.log("Replacing folder " + destinationFolder + name + " with contents of " + origin);
  npm.commands.install([name], function(err, data) {
    console.log(err);
  });
  npm.on('log', function(message) {
    // log installation progress
    console.log(message);
  });
}
