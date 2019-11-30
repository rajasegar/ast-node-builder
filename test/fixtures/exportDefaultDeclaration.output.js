export default class MyComponent extends ReactComponent {}

export default class MyComponent extends ReactComponent {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  hello(x, y) {
    console.log(x, y);
  }
}

export default {
  data: function() {
    return {
      foo: 'bar'
    };
  }
};