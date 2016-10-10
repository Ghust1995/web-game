const _ = require('lodash');
const io = require('socket.io-client');

let socket = io.connect('localhost:5000');

var EditableComponent = function(name, componentCreator) {
  var defaultComponent = componentCreator();
  var editableVariables = _.omitBy(defaultComponent, (c) => _.isFunction(c) && _.isUndefined(c));
  socket.emit("new_component", {
    [name]: editableVariables
  });

  return (...params) => {
    var result = _.spread(componentCreator)(params);
    //var editableFields = _.omitBy(defaultComponent, _.isFunction());

    console.log("subcribed to " + 'edit_variable_' + _.lowerCase(name));
    socket.on('edit_variable_' + _.lowerCase(name), (c) => {
      _.assignIn(editableVariables, c);
      _.assignIn(result, editableVariables);
    });

    _.assignInWith(
      result,
      editableVariables,
      (objValue, srcValue) => _.isUndefined(objValue) ? srcValue : objValue
    );

    return result;
  };
};

module.exports = EditableComponent;
