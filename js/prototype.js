Array.prototype.sum = function () {
  const s = 0;
  for (const i of this) {
    s += parseFloat(i);
  }
  return s;
};

Array.prototype.remove = function (i) {
  return this.splice(i, 1);
};
