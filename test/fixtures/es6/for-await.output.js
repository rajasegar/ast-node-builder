(async function() {
  for await (let num of asyncIterable) {
    console.log(num);
  }
})();