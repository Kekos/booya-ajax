var xhr = require('./booya-xhr');
var BackboneEvents = require('backbone-events-standalone');
var queryString = require('query-string');
var CancelableEvent = require('./cancelable-event');

function AjaxHandler(default_handler) {
  this.default_handler = default_handler;
  this.target_handlers = {};
}

BackboneEvents.mixin(AjaxHandler.prototype);

AjaxHandler.prototype.addTargetHandler = function(target, response_handler) {
  this.target_handlers[target] = response_handler;
};

AjaxHandler.prototype.loadUrl = function(url, target, options, data) {
  var self = this;
  var headers = {};

  if (!options) {
    options = {};
  }

  var befreq_event = new CancelableEvent({
    url: url,
    target: target,
    options: options
  });

  self.trigger('beforeRequest', befreq_event);

  if (befreq_event.isDefaultPrevented()) {
    return;
  }

  if (typeof data === 'undefined') {
    data = null;
  } else if (typeof data === 'object' && !(data instanceof FormData)) {
    data = queryString.stringify(data);
  }

  if (typeof data === 'string') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  xhr({
    url: url,
    method: self.getMethod(),
    body: data,
    headers: headers,

  }, function(err, resp, body) {
    if (err || resp.statusCode === 500) {
      self.trigger('responseError', {
        url: url,
        target: target,
        options: options,
        response: resp,
        body: body
      });

    } else {
      // JSON responses are always decoded as JSON objects before processing
      if (resp.headers['content-type'].indexOf('application/json') >= 0) {
        // Flash messages might be available in JSON responses
        body = JSON.parse(body);
        if (body.flash) {
          self.trigger('responseFlash', body.flash);
        }

        if (typeof body.content !== 'undefined') {
          resp.headers['content-type'] = 'text/html';
          body = body.content;
        }
      }

      // Null responses are thrown away.
      if (body === null) {
        return;
      }

      var respbef_event = new CancelableEvent({
        url: url,
        target: target,
        options: options,
        response: resp,
        body: body
      });

      self.trigger('responseBeforeProcess', respbef_event);

      if (respbef_event.isDefaultPrevented()) {
        return;
      }

      var handler;

      // Process response
      // First look for special response handlers based on target
      if (self.target_handlers[target]) {
        handler = self.target_handlers[target];

      } else {
        // Fallback to the default content response handler
        handler = self.default_handler;
      }

      handler.handle(url, target, options, resp, body);

      self.trigger('responseAfterProcess', {
        url: url,
        target: target,
        options: options,
        response: resp,
        body: body,
        handler: handler
      });
    }
  });
};

module.exports = AjaxHandler;