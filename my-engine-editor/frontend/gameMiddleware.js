import io from 'socket.io-client';
import _ from 'lodash';
let socket = {};

import {addComponent} from './actions';

//const editorRef = () => firebase.database().ref('hierarchy');

export function gameMiddleware(store) {
  return next => action => {
    const result = next(action);
    if(action.type === "EDIT_VARIABLE") {
      socket.emit("edit_variable", action);
    }
    return result;
  };
}

export default function(store) {
  socket = io.connect('localhost:5000');

  socket.on('all_components', (components) => {
    _.forIn(components, (component, name) => {
      store.dispatch(addComponent(name, component));
    });
  });

  socket.on('new_component', (newComponent) => {
    _.forIn(newComponent, (component, name) => {
      store.dispatch(addComponent(name, component));
    });
  });
}
