async function* asyncGenerator() {
  var i = 0;
  while (i < 3) {
    yield i++;
  }
}
