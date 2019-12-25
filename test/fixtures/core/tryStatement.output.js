try {
  hello();
} catch (ex) {
  foo();
} finally {
  bar();
}

try {
  throw new Error('oops');
} catch (ex) {
  console.error('inner', ex.message);
  throw ex;
} finally {
  console.log('finally');
}