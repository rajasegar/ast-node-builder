export default class Foo extends Component {
  bar;
  baz = 'barBaz';

  @computed('baz')
  get bazInfo() {
    return `Name: ${get(this, 'baz')}`;
  }
}