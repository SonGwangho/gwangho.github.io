Array.prototype.sum = function () {
  let s = 0;
  for (const i of this) {
    s += parseFloat(i);
  }
  return s;
};

Array.prototype.remove = function (i) {
  return this.splice(i, 1);
};
