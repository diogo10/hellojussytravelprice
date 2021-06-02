const assert = require('assert');
const calculateValueFor = require('../util');


describe('Calculate distance', () => {
 it('should return 0 for 5000', () => {
        assert.equal(0, calculateValueFor(5000));
    });
 it('should return 2 for 5001', () => {
    assert.equal(2, calculateValueFor(5001));
    });
});