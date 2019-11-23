hello(1, 'world', true, a);

module('Unit | Utility | codeshift-api', function() {
  let a = 1;

  test('it works', function(assert) {
    let result = codeshiftApi();
    assert.ok(result);
  });
});