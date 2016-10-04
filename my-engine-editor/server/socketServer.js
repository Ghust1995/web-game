import io from 'socket.io';
import _ from 'lodash';

let components = {
};

export default function(server) {
  const socketServer = io(server);
  const connections = [];

  socketServer.on('connection', (socket) => {
    connections.push(socket);
    console.log("New socket connection.");

    socket.on('new_component', newComponent => {
      _.extend(components, newComponent);
      _.forEach(connections, (connectedSocket) => {
        connectedSocket.emit('new_component', newComponent);
      });
    });

    socket.on('edit_variable', (editAction) => {
      _.set(components, `${editAction.component}.${editAction.variable}`, editAction.value);
      _.forEach(connections, (connectedSocket) => {
         console.log("Emmited to " + 'edit_variable_' + _.lowerCase(editAction.component));
         connectedSocket.emit('edit_variable_' + _.lowerCase(editAction.component), {
           [editAction.variable]: editAction.value
         });
      });
    });

    socket.on('disconnect', () => {
      const index = connections.indexOf(socket);
      connections.splice(index, 1);
    });

    socket.emit("all_components", components);
  });
}
