var AjaxHandler = require('./ajax-handler');
var _assign = require('lodash.assign');
var formSerialize = require('form-serialize');

function AjaxForm(default_handler) {
  AjaxHandler.call(this, default_handler);
}

_assign(AjaxForm.prototype, AjaxHandler.prototype);

AjaxForm.prototype.getMethod = function() {
  return 'POST';
};

AjaxForm.prototype.loadFromForm = function(form) {
  var data = null;
  var submitter = null;

  if (form.getAttribute('data-submitter-name')) {
    submitter = {
      name: form.getAttribute('data-submitter-name'),
      value: form.getAttribute('data-submitter-value')
    };
  }

  if (form.enctype === 'multipart/form-data') {
    data = new FormData(form);
    if (submitter) {
      data.append(submitter.name, submitter.value)
    }

  } else {
    data = formSerialize(form);
    if (submitter) {
      if (data !== '') {
        data += '&';
      }

      data += encodeURIComponent(submitter.name) + '=' + encodeURIComponent(submitter.value);
    }
  }

  this.loadUrl(form.action, form.getAttribute('data-target') || this.default_target, {
    origin: form
  }, data);
};

module.exports = AjaxForm;