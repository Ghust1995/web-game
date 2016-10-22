  const _ = require('lodash');

  let events = {};
  let emptyEvent = [];

  exports.subscribe = function (type, func) {
    events[type] = events[type] || [];
    events[type].push(func);
  };

  exports.unsubscribe = function (/*type, func*/) {
    console.error("unsubscribe is not yet implemented");
  };

  exports.clear = function (type) {
    events[type] = [];
  };

  exports.clearAll = function () {
    events = {};
  };

  exports.publish = function (type, args) {
    if(!events[type]) console.warn("No subscriber for event " + type);
    let funcs = events[type] || emptyEvent;
    _.forEach(funcs, (func)=>func(args));
  };
