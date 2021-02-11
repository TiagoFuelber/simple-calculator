const expect = require('chai').expect;
import {
    evalExpression, 
    processInput,
    validateEqual,
    getTokens
} from './eval-expression';

describe('evalExpression', function() {
    it('Should eval correctly string expressions', function() {
        expect(evalExpression('2+10/2*10')).to.equal('52');
    });

    it('should keep operations hierarquy', function() {
        expect(evalExpression('-8-9*-6')).to.equal('46');
    });

    it('should return -1', function() {
        expect(evalExpression('1+2-4')).to.equal('-1');
    })

    it('should return 4', function() {
        expect(evalExpression('8/2')).to.equal('4');
    });

    it('should return 5', function() {
        expect(evalExpression('10/2')).to.equal('5');
    });

    it('should return 50', function() {
        expect(evalExpression('10/2*10')).to.equal('50');
    });

    it('should return 52', function() {
        expect(evalExpression('2+10/2*10')).to.equal('52');
    });

    it('should return 0', function() {
        expect(evalExpression('-0*-0')).to.equal('0');
    });

    it('should return -2', function() {
        expect(evalExpression('3-5')).to.equal('-2');
    });

    it('should return 2', function() {
        expect(evalExpression('-12/-5')).to.equal('2');
    });

    it('should return 1', function() {
        expect(evalExpression('3/3')).to.equal('1');
    });

    it('should return 23', function() {
        expect(evalExpression('213-200+10')).to.equal('23');
    });

    it('should return 0', function() {
        expect(evalExpression('3/5').to.equal('0'));
    });

    it('should return 4', function() {
        expect(evalExpression('63/15')).to.equal('4');
    });

    it('should return -3', function() {
        expect(evalExpression('-12/5')).to.equal('-3');
    });

    it('should return ""', function() {
        expect(evalExpression('3/-0')).to.equal('');
    });

    it('should return ""', function() {
        expect(evalExpression('3/0')).to.equal('');
    });

    it('should return -278748', function() {
        expect(evalExpression('-8-7216/-3*-24*5+9900')).to.equal('-278748');
    });

    it('should return 0', function() {
        expect(evalExpression('-0-0-0')).to.equal('0');
    });
});

describe('processInput', function() {
    describe('should handle input correctly when display is clear', function() {
        it('should not permit operations when display is clear', function() {
            expect(processInput('', '*')).to.equal('');
        });
    
        it('should not permit operations when display is clear', function() {
            expect(processInput('', '/')).to.equal('');
        });
    
        it('should not permit operations when display is clear', function() {
            expect(processInput('', '+')).to.equal('');
        });
        
        it('should permit minus when display is clear', function() {
            expect(processInput('', '-')).to.equal('-');
        });
    });

    describe('should replace operator correctly', function() {
        it('should replace operand 1+ for 1+', function() {
            expect(processInput('1+', '+')).to.equal('1+');
        });
    
        it('should replace operand 1+ for 1*', function() {
            expect(processInput('1+', '*')).to.equal('1*');
        });
        
        it('should replace operand 1+ for 1/', function() {
            expect(processInput('1+', '/')).to.equal('1/');
        });
    
        it('should replace operand 1+ for 1-', function() {
            expect(processInput('1+', '-')).to.equal('1-');
        });
    
        it('should replace operand 1- for 1+', function() {
            expect(processInput('1-', '+')).to.equal('1+');
        });
    
        it('should replace operand 1- for 1/', function() { 
            expect(processInput('1-', '/')).to.equal('1/');
        });
    
        it('should replace operand 1- for 1-', function() {
            expect(processInput('1-', '-')).to.equal('1-');
        });
    });

    describe('should handle correctly a minus sign before and after another operator', function() {
        it('should permit minus after / operator', function() {
            expect(processInput('6/', '-')).to.equal('6/-');
        });

        it('should permit minus after * operator', function() {
            expect(processInput('6*', '-')).to.equal('6*-');
        });

        it('should not permit operator after a minus sign', function() {
            expect(processInput('6*-', '*')).to.equal('6*');
        });

        it('should not permit operator after a minus sign', function() {
            expect(processInput('6*-', '+')).to.equal('6*');
        });
    });

    describe('should not permit leading zeros', function() {
        it('no leading zeros', function() {
            expect(processInput('', '0')).to.equal('');
        });

        it('no leading zeros', function() {
            expect(processInput('6/', '0')).to.equal('6/');
        });

        it('no leading zeros', function() {
            expect(processInput('2+3*', '0')).to.equal('2+3*');
        });

        it('no leading zeros', function() {
            expect(processInput('2+3*1', '0')).to.equal('2+3*10');
        });
    });

    describe('right after a calculation, should start a new one when input is number', function() {
        it('input number after a calculation', function() {
            expect(processInput('-220', '6', true)).to.equal('6');
        });

        it('input number after a calculation', function() {
            expect(processInput('6', '8', true)).to.equal('8');
        });

        it('resume the calculation when input is operator', function() {
            expect(processInput('6', '+', true)).to.equal('6+');
        });
        
        it('resume the calculation when input is operator', function() {
            expect(processInput('6', '*', true)).to.equal('6*');
        });

        it('behaves normally when last parameter is false', function() {
            expect(processInput('6', '7', false)).to.equal('67');
        });

        it('behaves normally when last parameter is false', function() {
            expect(processInput('6', '/', false)).to.equal('6/');
        });

        it('behaves normally when last parameter is false', function() {
            expect(processInput('6', '0', false)).to.equal('60');
        });
    });
}); 


describe('validateEqual', function() {
    it('should not permit equal when last character is operator', function() {
        expect(validateEqual('1+3+')).to.equal(false);
    });

    it('should permit equal when last character is number', function() {
        expect(validateEqual('1+3+5')).to.equal(true);
    });
});

describe('getTokens', function() {
    it('should tokenize correctly', function() {
        expect(getTokens('-8-9*-6')).to.equal(['-8', '-', '9', '*', '-6']);
    });

    it('should tokenize correctly', function() {
        expect(getTokens('1+2-4')).to.equal(['1', '+', '2', '-', '4']);
    });

    it('should tokenize correctly', function() {
        expect(getTokens('-12/5')).to.equal(['-12', '/', '5']);
    });
});