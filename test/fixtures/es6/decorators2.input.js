export default class Foo extends Component {
  bar;
  @tracked baz = 'barBaz';

  @alias('model.isFoo')
  isFoo;

  @computed('isFoo')
  get bazInfo() {
    return get(this, 'isFoo') ? `Name: ${get(this, 'baz')}` : 'Baz';
  }

  @computed('bar', 'isFoo').readOnly()
  get barInfo() {
    return get(this, 'isFoo') ? `Name: ${get(this, 'bab')}` : 'Bar';
  }
}
