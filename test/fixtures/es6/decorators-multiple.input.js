@classic
@tagName('div')
@classNames('test-class', 'custom-class')
class Foo extends EmberObject {
  a = '';

  @service('store')
  b;

  @controller('abc')
  myController;

  @watcher('xyz')
  observedProp() {
    return 'observed';
  }

  @on('click')
  event() {
    return 'abc';
  }

  @computedMap('chores', function(chore, index) {
    return chore.toUpperCase() + '!';
  })
  excitingChores;

  @filter('chores', function(chore, index, array) {
    return !chore.done;
  })
  remainingChores;

  @action
  someActionUtil() {
    return someActionUtil.call(this, ...arguments);
  }

  @action
  bar(temp1) {}

  @action
  baz() {
    super.actions.baz.call(this, ...arguments);
  }

  @action
  biz() {}
}
