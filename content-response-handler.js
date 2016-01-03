function ContentResponseHandler(default_selector) {
  this.default_selector = default_selector;
}

ContentResponseHandler.prototype.handle = function(url, target, options, response, body) {
  var selector = this.default_selector;

  if (options.origin && options.origin.getAttribute && options.origin.getAttribute('data-target')) {
    selector = options.origin.getAttribute('data-target');
  }

  var target_el = document.querySelector(selector);
  if (!target_el) {
    throw new ReferenceError('ContentResponseHandler: Selector ' + selector + ' not found in document.');
  }

  target_el.innerHTML = body;
};

module.exports = ContentResponseHandler;