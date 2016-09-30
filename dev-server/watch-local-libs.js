const fs      = require('fs-extra');
const watch   = require("watch");
const _       = require("lodash");
const npm     = require('npm');
const events  = require('events');
const Promise = require("bluebird");

var localLibEmitter = new events.EventEmitter();

function WatchLocalLibs(wpcompiler) {
  const localDepRegex = /^\.(\/[a-zA-Z\-_0-9]+)+\/?$/;

  var p_readPackageJson = new Promise(function(resolve, reject) {
    console.log("Loading package.json");
    fs.readFile("./package.json", 'utf8', function(err, packagejson) {
        if (err) {
            reject(err);
        }
        resolve(packagejson);
      });
  });

  p_readPackageJson.then((packagejson) => {
        console.log("Loaded package.json and webpack.config.js");
        var npmConfig = {
          progress: false,
          loglevel: "silent"
        };
        npm.load(npmConfig, function(/*er*/) {
            var dependencies = (JSON.parse(packagejson)).dependencies;
            var localDependencies = _.pickBy(dependencies, (d) => localDepRegex.test(d));
            _.forOwn(localDependencies, function(localDepencyRoot, localDependecyName) {
                CreateDependencyMonitor(localDepencyRoot, localDependecyName);
                console.log("Added watch to ", localDependecyName, ": ", localDepencyRoot);
            });

            localLibEmitter.on("finished-local-libs", function() {
              console.log("Running webpack compiler");
              wpcompiler.run(function(err/*, stats*/) {
                if(err) {
                  console.error(err);
                }
              });
            });
        });
    });
}


function CreateDependencyMonitor(libRoot, libName) {
    watch.createMonitor("./" + libRoot, function(monitor) {
        monitor.on("created", function(/*f, stat*/) {
            console.log("Created file in ", libRoot);
            CopyLib(libRoot, libName);
        });
        monitor.on("changed", function(/*f, curr, prev*/) {
            console.log("Changed file in ", libRoot);
            CopyLib(libRoot, libName);
        });
        monitor.on("removed", function(/*f, stat*/) {
            console.log("Removed file in ", libRoot);
            CopyLib(libRoot, libName);
        });
    });
}

function CopyLib(origin, name) {
    var tryCopy = () => {
      return new Promise(function(resolve, reject) {
        console.log("Reinstalling " + name);
        //npm.on('log', function(message) {
            //console.log(message);
        //});
        npm.commands.install([name], function(err, data) {
            if(err) {
              //console.error(err);
              reject(err);
            }
            resolve(data);
        });
      });
    };
    var Copy = () => {
      return new Promise(function(resolve/*, reject*/) {
        tryCopy().then(
          () => resolve(),
          () => {console.log("Error, installing again."); Copy().then(() => resolve());});
        });
    };
    Copy().then(()=> {console.log("Finished installing"); localLibEmitter.emit("finished-local-libs");});

}

module.exports = WatchLocalLibs;
