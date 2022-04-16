import randomInt from 'test-render-table/utils/random-int';
import { module, test } from 'qunit';

module('Unit | Utility | random-int', function () {
  // TODO: Replace this with your real tests.
  test('it works', function (assert) {
    let result = randomInt();
    assert.ok(result);
  });
});
