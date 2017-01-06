const _ = require('lodash');
const io = require('socket.io-client');

// TODO: make connection give up on error (make error message)
let socket = io.connect('localhost:5000');
socket.on('connect_error', function (/*err*/) {
    console.log("Editor not available.");
    socket.disconnect();
});

// Function receives the name of that component and its builder (function that returns a new instance)
function EditableComponent(name, componentCreator) {
  // Creates a parameterless component;
  var defaultComponent = componentCreator();

  // Get all variables that can be edited(not functions and ones set by parameters)
  var editableVariables = _.omitBy(defaultComponent, (c) => _.isFunction(c) || _.isUndefined(c));

  // and emits a socket event for this components and its editable variables
  socket.emit("new_component", {
    [name]: editableVariables
  });

  // Returns a new function that can receive any number of params
  return (...params) => {

    // Function will return an instance of the object with the given parameters
    var result = _.spread(componentCreator)(params);

    // Subscribe this new component to the event of it's variables being edited
    // and change the value of the variable to the received values
    socket.on('edit_variable_' + _.lowerCase(name), (c) => {
      _.assignIn(editableVariables, c);
      _.assignIn(result, editableVariables);
    });
    console.log("subcribed to " + 'edit_variable_' + _.lowerCase(name));

    // Sets the object to the editableVariables value if it is undefined
    _.assignInWith(
      result,
      editableVariables,
      (objValue, srcValue) => _.isUndefined(objValue) ? srcValue : objValue
    );

    return result;
  };
}

module.exports = EditableComponent;
