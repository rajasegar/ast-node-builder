@classic
@classNameBindings('isEnabled:enabled:disabled', 'a:b:c', 'c:d')
@attributeBindings('customHref:href')
class comp extends EmberObject {
  @computed('a', 'c')
  get isEnabled() {
    return false;
  }

  a = true;
  c = '';
  customHref = 'http://emberjs.com';
}