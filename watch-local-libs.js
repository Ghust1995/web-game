const fs      = require('fs-extra');
const watch   = require("watch");
const _       = require("lodash");
const npm     = require('npm');
const webpack = require('webpack');
const events  = require('events');
const Promise = require("bluebird");

const webpackconfig = require("./webpack.config");

const localDepRegex = /^\.(\/[a-zA-Z\-_0-9]+)+\/?$/;

var localLibEmitter = new events.EventEmitter();

var list = [];

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

      var wpcompiler = webpack(webpackconfig);

      npm.load(function(er) {
          dependencies = (JSON.parse(packagejson)).dependencies;
          localDependencies = _.pickBy(dependencies, (d) => localDepRegex.test(d));
          _.forOwn(localDependencies, function(localDepencyRoot, localDependecyName) {
              CreateDependencyMonitor(localDepencyRoot, localDependecyName);
              console.log("Added watch to ", localDependecyName, ": ", localDepencyRoot);
          });

          localLibEmitter.on("finished-local-libs", function() {
            console.log("Running webpack compiler");
            wpcompiler.run(function(err, stats) {
              if(err) {
                console.error(err);
              }
              console.log(stats);
            });
          });
      });
  });

function CreateDependencyMonitor(libRoot, libName) {
    watch.createMonitor("./" + libRoot, function(monitor) {
        monitor.on("created", function(f, stat) {
            console.log("Created file in ", libRoot);
            CopyLib(libRoot, libName);
        });
        monitor.on("changed", function(f, curr, prev) {
            console.log("Changed file in ", libRoot);
            CopyLib(libRoot, libName);
        });
        monitor.on("removed", function(f, stat) {
            console.log("Removed file in ", libRoot);
            CopyLib(libRoot, libName);
        });
    });
}

function CopyLib(origin, name) {
    new Promise(function(resolve, reject) {
      destinationFolder = "./node_modules/";
      console.log("Reinstalling " + name);
      npm.on('log', function(message) {
          console.log(message);
      });
      npm.commands.install([name], function(err, data) {
          if(err) {
            console.error(err);
            reject(err);
          }
          console.log("Finished installing...");
          npm.on('log', function(message) {
              //console.log(message);
          });
          resolve(data);
      });
    }).then(() => localLibEmitter.emit("finished-local-libs"));
}
