var Dialog = require('./dialog');

function DialogResponseHandler(default_width, default_height) {
  this.default_width = default_width;
  this.default_height = default_height;
  this.current_dialog = null;
}

DialogResponseHandler.prototype.handle = function(url, target, options, response, body) {
  this.closeCurrent();

  options.width = this.default_width;
  options.height = this.default_height;

  if (options.origin && options.origin.getAttribute('data-dimensions')) {
    var dimensions = options.origin.getAttribute('data-dimensions').split('x');

    if (dimensions.length === 2) {
      options.width = dimensions[0];
      options.height = dimensions[1];
    }
  }

  this.current_dialog = new Dialog(body, options);
  DialogManager.add(this.current_dialog);
};

DialogResponseHandler.prototype.closeCurrent = function() {
  if (this.current_dialog) {
    if (DialogManager.requestRemoval(this.current_dialog)) {
      this.current_dialog = null;
    }
  }
};

module.exports = DialogResponseHandler;