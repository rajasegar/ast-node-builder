(async function() {
  for await (let num of asyncGenerator()) {
    console.log(num);
  }
})();