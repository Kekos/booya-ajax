var domReady = require('domready');
var debounce = require('lodash.debounce');
var classList = require('dom-classlist');
var getViewportSize = require('./viewport-size');

var DialogManager = {
  stack: [],
  Z_INDEX_START: 100,
  last_focus: null,

  overlay: null,

  getLastDialog: function() {
    if (this.stack.length) {
      return this.stack[this.stack.length - 1];
    }

    return null;
  },

  add: function(dialog) {
    var container = dialog.element;

    this.last_focus = document.activeElement;

    // Make the container focusable
    container.tabIndex = -1;
    container.focus();

    // Make sure this dialog is on top of the others
    dialog.setZIndex(this.Z_INDEX_START + this.stack.length);

    // Add to end of the dialogs stack
    this.stack.push(dialog);

    // See if this new dialog fits on screen
    this.resizeDialogs(dialog);

    classList(document.body).add('has-dialogs');
    classList(this.overlay).remove('hidden');
  },

  remove: function() {
    // Pop the uppermost dialog of stack
    this.stack.pop();

    // Try set focus to the element with focus before opening the dialog
    if (this.last_focus) {
      this.last_focus.focus();

    // Are there any more dialogs in stack?
    } else if (this.stack.length > 0) {
      // Set focus to the next upper dialog
      this.getLastDialog().element.focus();
    }

    if (this.stack.length === 0) {
      classList(document.body).remove('has-dialogs');
      classList(this.overlay).add('hidden');
    }
  },

  requestRemoval: function(dialog) {
    var last_dialog = this.getLastDialog();

    if (last_dialog === dialog) {
      last_dialog.close();
      this.remove();
      return true;
    }

    return false;
  },

  closeTopmost: function() {
    if (this.stack.length > 0) {
      this.getLastDialog().close();
      this.remove();
    }
  },

  keyListener: function(e) {
    if (e.keyCode === 27) {
      this.closeTopmost();
    }
  },

  focusListener: function(e) {
    if (this.stack.length) {
      var container = this.getLastDialog().element;

      if (!container.contains(e.target)) {
        e.stopPropagation();
        container.focus();
      }
    }
  },

  resizeDialogs: function(dialog) {
    var viewport = getViewportSize();
    var resized = false;
    var resize_dialogs = (dialog ? [dialog] : this.stack);
    var i;

    for (i = 0; i < resize_dialogs.length; i++) {
      resized = false;

      if (resize_dialogs[i].getWidth() > viewport.width) {
        resize_dialogs[i].setWidth(viewport.width - 10);
        resized = true;
      }

      if (resize_dialogs[i].getHeight() > viewport.height) {
        resize_dialogs[i].setHeight(viewport.height - 10);
        resized = true;
      }

      if (!resized) {
        resize_dialogs[i].restoreSize();
      }
    }
  },

  resizeListener: function() {
    this.resizeDialogs();
  }
};

domReady(function() {
  // Listen for events globally
  var module = DialogManager;
  var debounceResize = debounce(module.resizeListener.bind(module), 500);
  var doc = document;
  var body = doc.body;

  // Start listen for key events to bind the Escape key
  doc.addEventListener('keyup', module.keyListener.bind(module));
  // Start listen for focus events to keep focus within the uppermost dialog
  doc.addEventListener('focus', module.focusListener.bind(module), true);
  // For IE < 9
  doc.addEventListener('focusin', module.focusListener.bind(module));
  // Start listen for resize events to resize dialogs appropriately
  window.addEventListener('resize', debounceResize);

  // Create overlay
  var overlay = doc.createElement('div');
  module.overlay = overlay;
  classList(overlay).add('js-dialog-close');
  classList(overlay).add('dialog-overlay');
  classList(overlay).add('hidden');
  body.appendChild(overlay);

  body.addEventListener('click', function(e) {
    if (classList(e.target).contains('js-dialog-close')) {
      e.preventDefault();
      module.closeTopmost();
    }
  })
});

module.exports = DialogManager;

window.DialogManager = DialogManager;