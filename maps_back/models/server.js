const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const Sockets = require('./sockets');
const cors = require('cors');

class Server {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 4000;
    this.server = http.createServer(this.app);
    this.io = socketIO(this.server);
  }

  middlewares() {
    this.app.use(express.static(path.resolve('public')));
    this.app.use(cors());
  }

  configSockets() {
    new Sockets(this.io);
  }

  initialize() {
    this.middlewares();

    this.configSockets();

    this.server.listen(this.PORT || 4000, () => {
      console.log(chalk.blue(`Server running on PORT : ${this.PORT} 🚀`));
    });
  }
}

module.exports = Server;
