const Markers = require('./markers');

class Sockets {
  constructor(io) {
    this.io = io;
    this.markers = new Markers();
    this.socketEvents();
  }

  socketEvents() {
    this.io.on('connection', socket => {
      console.log(chalk.yellow('Client connected'));

      this.io.emit('active_markers', this.markers.actives);

      socket.on('new_marker', marker => {
        this.markers.addMarker(marker);

        socket.broadcast.emit('new_marker', marker);
      });

      socket.on('update_marker', marker => {
        this.markers.updateMarker(marker);

        socket.broadcast.emit('update_marker', marker);
      });
    });
  }
}

module.exports = Sockets;
