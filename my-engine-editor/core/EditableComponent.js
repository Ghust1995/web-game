const _ = require('lodash');
const io = require('socket.io-client');

let socket = io.connect('localhost:5000');

var EditableComponent = function(name, componentCreator) {
  var defaultComponent = componentCreator();
  var defaultVariables = _.omitBy(defaultComponent, (c) => _.isFunction(c) && _.isUndefined(c));
  socket.emit("new_component", {
    [name]: defaultVariables
  });

  ////firebase.database.ref('hierarchy/' + name).set(defaultVariables);

  return (...params) => {
    var result = componentCreator(params);
    console.log(result);
    return result;
  };
};

module.exports = EditableComponent;
