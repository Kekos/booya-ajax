function HistoryHandler(default_handler) {
  this.default_handler = default_handler;
  this.target_handlers = {};
}

HistoryHandler.prototype.addTargetHandler = function(target, response_handler) {
  this.target_handlers[target] = response_handler;
};

HistoryHandler.prototype.loadUrl = function(url, history_state) {
  var handler;
  var target = history_state.request.target;
  var options = history_state.request.options;
  var resp = history_state.response;

  // Process response
  // First look for special response handlers based on target
  if (this.target_handlers[target]) {
    handler = this.target_handlers[target];

  } else {
    // Fallback to the default content response handler
    handler = this.default_handler;
  }

  handler.handle(url, target, options, resp, resp.body);
};

module.exports = HistoryHandler;