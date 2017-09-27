// eslint-disable-next-line
global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};
