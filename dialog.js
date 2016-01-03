function Dialog(content, options) {
  if (!options) {
    options = {};
  }

  if (!options.width) {
    options.width = 300;
  }

  if (!options.height) {
    options.height = 300;
  }

  this.options = options;
  this.element = document.createElement('div');

  this.setWidth(options.width);
  this.setHeight(options.height);
  this.element.className = 'dialog';
  this.element.innerHTML = content;

  document.body.appendChild(this.element);
}

Dialog.prototype.close = function() {
  this.element.parentNode.removeChild(this.element);
};

Dialog.prototype.setZIndex = function(z_index) {
  this.element.style.zIndex = z_index;
};

Dialog.prototype.setWidth = function(width) {
  this.element.style.width = width + 'px';
  this.element.style.marginLeft = '-' + (width / 2) + 'px';
};

Dialog.prototype.getWidth = function() {
  return parseInt(this.element.style.width, 10);
};

Dialog.prototype.setHeight = function(height) {
  this.element.style.height = height + 'px';
  this.element.style.marginTop = '-' + (height / 2) + 'px';
};

Dialog.prototype.getHeight = function() {
  return parseInt(this.element.style.height, 10);
};

Dialog.prototype.restoreSize = function() {
  this.setWidth(this.options.width);
  this.setHeight(this.options.height);
};

module.exports = Dialog;