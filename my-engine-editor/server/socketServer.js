import io from 'socket.io';

let components = {
  Bullet: {
    speed: 1000,
    potato: 10,
  },
  Player: {
    speed: 100,
    health: 50,
  }
};

export default function(server) {
  const socketServer = io(server);
  const connections = [];

  socketServer.on('connection', (socket) => {
    connections.push(socket);
    console.log("New socket connection.");

    socket.on('new_component', data => {
      console.log(data);
    });

    socket.on('disconnect', () => {
      const index = connections.indexOf(socket);
      connections.splice(index, 1);
    });

    socket.emit("all_components", components);
  });
}
