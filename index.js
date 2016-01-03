/*!
 * Unobtrusive AJAX handler for Booya framework
 *
 * @version 1.1
 * @date 2016-01-01
 */

var domReady = require('domready');
var events = require('events-mixin');
var AjaxLink = require('./ajax-link');
var AjaxForm = require('./ajax-form');
var HistoryHandler = require('./history-handler');
var createHistory = require('history').createHistory;
var ContentResponseHandler = require('./content-response-handler');
var DialogResponseHandler = require('./dialog-response-handler');
var flashManager = require('./flash');
var classList = require('dom-classlist');
var forEach = require('lodash.foreach');
var DialogManager = require('./dialog-manager');
var loaderDialog = require('./loader-dialog');

module.exports = {
  blastoff: function() {
    var self = this;
    var crh = new ContentResponseHandler('#content');

    self.dialog_handler = new DialogResponseHandler(400, 300);

    /*
     * Links
     */
    self.ajax_link = new AjaxLink(crh);
    self.ajax_link.addTargetHandler('dialog', self.dialog_handler);

    self.ajax_link.on('beforeRequest', function(e) {
      loaderDialog.show();
    });
    self.ajax_link.on('responseError', self.ajaxReponseErrorListener, self);
    self.ajax_link.on('responseBeforeProcess', self.ajaxResponseLoadedListener, self);
    self.ajax_link.on('responseAfterProcess', self.ajaxResponseHandledListener, self);
    self.ajax_link.on('responseFlash', self.ajaxResponseFlashListener, self);

    /*
     * Forms
     */
    self.ajax_form = new AjaxForm(crh);
    self.ajax_form.addTargetHandler('dialog', self.dialog_handler);

    self.ajax_form.on('beforeRequest', function(e) {
      loaderDialog.show();
    });
    self.ajax_form.on('responseError', self.ajaxReponseErrorListener, self);
    self.ajax_form.on('responseBeforeProcess', self.ajaxResponseLoadedListener, self);
    self.ajax_form.on('responseAfterProcess', self.ajaxResponseHandledListener, self);
    self.ajax_form.on('responseFlash', self.ajaxResponseFlashListener, self);

    /*
     * History
     */
    self.history = createHistory();
    self.history_handler = new HistoryHandler(crh);
    self.history_handler.addTargetHandler('dialog', self.dialog_handler);

    self.history_ignore_next = true;
    self.history.listen(function(e) {
      if (!self.history_ignore_next) {
        self.historyListener(e);
      }

      self.history_ignore_next = false;
    });

    /*
     * DOM ready event
     */
    domReady(function() {
      // Initiate Flash messages manager
      flashManager.init();

      // Listen for events globally
      var doc_events = events(document.body, self);

      doc_events.bind('click a.js-ajax', 'linkClickListener');
      doc_events.bind('submit .js-ajax', 'formSubmitListener');
      doc_events.bind('click form.js-ajax button[type=submit]', 'formSubmitClickListener');

      self.historyPush({
        request: {
          url: location.href,
          target: 'content', 
          options: {}
        },
        response: {
          body: document.querySelector('#content').innerHTML
        }
      });
    });
  },

  linkClickListener: function(e) {
    e.preventDefault();
    var target = e.target;

    while (target.nodeName !== 'A') {
      target = target.parentNode;
    }

    this.ajax_link.loadFromAnchor(target);
  },

  formSubmitListener: function(e) {
    e.preventDefault();
    var form = e.target;

    while (form.nodeName !== 'FORM') {
      form = form.parentNode;
    }

    this.ajax_form.loadFromForm(form);
    form.setAttribute('data-submitter-name', null);
    form.setAttribute('data-submitter-value', null);
  },

  formSubmitClickListener: function(e) {
    var form = e.target.form;

    form.setAttribute('data-submitter-name', e.target.name);
    form.setAttribute('data-submitter-value', e.target.value);
  },

  ajaxResponseLoadedListener: function(e) {
    // Close the topmost dialog if the origin requests it when response
    // is successful.
    var origin_close_successful = (e.options.origin && classList(e.options.origin).contains('js-close-successful'));
    var resp_successful = (e.response.statusCode >= 200 && e.response.statusCode <= 299);

    if (origin_close_successful && resp_successful) {
      this.dialog_handler.closeCurrent();
    }

    this.historyPush({
      request: {
        url: e.response.headers['x-path'] || e.url,
        target: e.target, 
        options: e.options
      },
      response: e.response
    });
  },

  ajaxReponseErrorListener: function(e) {
    loaderDialog.hide();
    this.dialog_handler.handle(e.url, e.target, e.options, e.resp, e.body);
  },

  ajaxResponseHandledListener: function(e) {
    loaderDialog.hide();

    if (e.handler !== this.dialog_handler) {
      this.dialog_handler.closeCurrent();
    }
  },

  ajaxResponseFlashListener: function(flashes) {
    forEach(flashes, function(text, type) {
      flashManager.flash(type, text);
    })
  },

  historyListener: function(e) {
    if (e.action === 'POP') {
      this.dialog_handler.closeCurrent();
      this.history_handler.loadUrl(e.pathname, e.state);
    }
  },

  historyPush: function(obj) {
    this.history.push({
      pathname: obj.request.url,
      state: obj
    });
  }
};

module.exports.blastoff();
window.BooyaAjax = module.exports;