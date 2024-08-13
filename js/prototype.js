Array.prototype.sum = function () {
  console.log(this);
  const a = this;
  const s = 0;
  for (const i of a) {
    s += parseFloat(i);
  }
  return s;
};
