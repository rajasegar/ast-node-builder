let a = {
  name: 'raja',
  age: 35,
  action: hello()
};

let {
  name: name,
  age: age
} = a;

Vue.component('some-comp', {
  data: function() {
    return {
      foo: 'bar'
    };
  }
});

module.exports = {
  components: {
    'demo': demo
  }
};