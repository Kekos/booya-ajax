var classList = require('dom-classlist');

var LoaderDialog = {
  loader: null,

  init: function() {
    if (this.loader === null) {
      var loader = document.createElement('div');
      loader.innerHTML = '<div class="sk-cube1 sk-cube"></div>'
        + '<div class="sk-cube2 sk-cube"></div>'
        + '<div class="sk-cube4 sk-cube"></div>'
        + '<div class="sk-cube3 sk-cube"></div>';

      this.loader = loader;
      classList(loader).add('sk-folding-cube');
      classList(loader).add('spinning-loader');
      classList(loader).add('hidden');
      document.body.appendChild(loader);
    }
  },

  show: function(dialog) {
    this.init();
    classList(this.loader).remove('hidden');
  },

  hide: function() {
    this.init();
    classList(this.loader).add('hidden');
  }
};

module.exports = LoaderDialog;