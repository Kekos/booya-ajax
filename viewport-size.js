module.exports = function() {
  return {
    width: (window.innerWidth || document.body.clientWidth),
    height: (window.innerHeight || document.body.clientHeight)
  };
};