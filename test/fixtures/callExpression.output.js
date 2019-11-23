hello(1, 'world', true, a);
world([1, 2, 3]);

module('Unit | Utility | codeshift-api', function() {
  let a = 1;

  test('it works', function(assert) {
    let result = codeshiftApi();
    assert.ok(result);
  });
});