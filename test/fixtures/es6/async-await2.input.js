async function f2() {
  const thenable = {
    then: function(resolve, _reject) {
      resolve('resolved!')
    }
  };
  console.log(await thenable); // resolved!
}
