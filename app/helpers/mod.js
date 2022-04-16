import { helper } from '@ember/component/helper';

export default helper(function mod([x, y] /*, named*/) {
  return x % y === 0;
});
