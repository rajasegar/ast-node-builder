function sum(...theArgs) {
  return theArgs.reduce((previous, current) => {
    return previous + current;
  });
}
