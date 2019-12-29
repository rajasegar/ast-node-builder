function App2() {
  const props = {
    firstName: 'Ben',
    lastName: 'Hector'
  };

  return <Greeting {...props} />;
}