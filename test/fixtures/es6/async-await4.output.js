async function f4() {
  try {
    var z = await Promise.reject(30);
  } catch (e) {
    console.error(e);
  }
}