async function f1() {
  var x = await resolveAfter2Seconds(10);
  console.log(x);
}
