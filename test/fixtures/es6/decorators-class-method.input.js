class Counter {
  _count = 0;

  @cache
  get count() {
    return this._count++;
  }
}
