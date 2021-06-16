const Marker = require('./marker');

class Markers {
  constructor() {
    this.actives = {};
  }

  addMarker(marker) {
    this.actives[marker.id] = marker;

    return marker;
  }

  removeMarker(marker) {
    delete this.actives[marker.id];
  }

  updateMarker(marker) {
    this.actives[marker.id] = marker;
  }
}

module.exports = Markers;
