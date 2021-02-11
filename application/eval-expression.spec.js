const expect = require('chai').expect;
import { evalExpression } from './eval-expression';

describe('evalExpression', function() {
    it('Should eval correctly string expressions', function() {
        // expect(evalExpression('2+10/2*10').to.equal('52'));
        expect(evalExpression('2+10/2*10')).to.equal('52');
    });
});
