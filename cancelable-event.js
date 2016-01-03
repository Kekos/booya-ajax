var _assign = require('lodash.assign');

function CancelableEvent(obj) {
  this.defaultPrevented = false;

  if (typeof obj === 'object') {
    _assign(this, obj);
  }
}

CancelableEvent.prototype.preventDefault = function() {
  this.defaultPrevented = true;
};

CancelableEvent.prototype.isDefaultPrevented = function() {
  return this.defaultPrevented;
};

module.exports = CancelableEvent;