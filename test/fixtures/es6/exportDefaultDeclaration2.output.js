export default class MyComponent2 extends ReactComponent {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  hello(x, y) {
    console.log(x, y);
  }
}