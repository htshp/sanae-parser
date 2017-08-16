const assert = require('power-assert');
const sp = require('..');

describe('add', () => {
  it('1と2を足すと3となること。', () => {
    assert.equal(sp.add(1, 2), 3);
  });
});
