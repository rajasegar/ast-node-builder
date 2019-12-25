this.hello(1, 'world', true, a);
hello.world(1, 'foo', true, a);
foo.bar.baz();
foo.bar.bax.baz(1, 'foo', true, a);
expect(find(cfPage.fieldPositionOne).textContent.trim()).to.be.contains(fieldOrder[0]);