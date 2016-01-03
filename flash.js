module.exports = {
  view: null,

  init: function() {
    this.view = document.querySelector('.js-booya-flash');

    var li_els = this.view.querySelectorAll('li');
    for (var i = 0; i < li_els.length; i++) {
      this.setTimer(li_els[i]);
    }
  },

  getList: function(type) {
    var list = this.view.querySelector('.flash-' + type);

    if (!list) {
      list = document.createElement('ul');
      list.className = 'flash-messages flash-' + type;
      this.view.appendChild(list);
    }

    return list;
  },

  setTimer: function(li) {
    setTimeout(function() {
      li.parentNode.removeChild(li);
    }, 10000);
  },

  flash: function(type, message) {
    var li = document.createElement('li');
    li.textContent = message;

    this.getList(type).appendChild(li);
    this.setTimer(li);
  },
};