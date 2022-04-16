import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | raw-table', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:raw-table');
    assert.ok(route);
  });
});
