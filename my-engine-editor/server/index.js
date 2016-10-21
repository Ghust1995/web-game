import express from 'express';
import http from 'http';
import path from 'path';
import socketServer from './socketServer';

let app = express();
let server = http.Server(app);

socketServer(server);

app.use('/build', express.static(path.resolve(__dirname, '..', 'frontend', 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname, '..', 'frontend', 'index.html'));
});

const port = 5000;
server.listen(port, () => console.log('listening on localhost:' + port));
