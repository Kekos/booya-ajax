var AjaxHandler = require('./ajax-handler');
var _assign = require('lodash.assign');

function AjaxLink(default_handler) {
  AjaxHandler.call(this, default_handler);
}

_assign(AjaxLink.prototype, AjaxHandler.prototype);

AjaxLink.prototype.getMethod = function() {
  return 'GET';
};

AjaxLink.prototype.loadFromAnchor = function(anchor) {
  this.loadUrl(anchor.href, anchor.getAttribute('data-target') || this.default_target, {
    origin: anchor
  });
};

module.exports = AjaxLink;