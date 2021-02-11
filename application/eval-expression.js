const MULTIPLIER_EXPRESSION_REGEX = /(-*[0-9]+(\*|\/))+-*[0-9]+/;
const IS_OPERATOR_REGEX = /^\+|\-|\*|\//;
const IS_DIGIT_REGEX = /^\d/;
const OPERAND_REGEX = /^-?\d+(\.\d+)?/;
const NON_SIGNED_OPERAND_REGEX = /^\d+(\.\d+)?/;
const SUM_EXPRESSION_REGEX = /\+|\-/;

function getTokens(string) {
	let tokens = [];
	
	while (string.length) {
		const lastToken = tokens[tokens.length - 1];
		
		const result = string.match(
				!string.length || IS_OPERATOR_REGEX.test(lastToken) 
					? NON_SIGNED_OPERAND_REGEX 
					: OPERAND_REGEX)
			|| string.match(IS_OPERATOR_REGEX);
		
		if (result) {
			const [token] = result;
			tokens.push(token);
			string = string.substring(token.length);
		}
	}

	return tokens;
}

function evalMultiplierExpression(expression) {
	let result = expression;
	while (MULTIPLIER_EXPRESSION_REGEX.test(result)) {
		const tokens = getTokens(result);
		result = result.replace(
			`${tokens[0]}${tokens[1]}${tokens[2]}`,
			multiplyTwoNumbers(tokens[0], tokens[1], tokens[2])
		);
	}

	return Math.abs(result) === Infinity 
		? '' 
		: Math.floor(result);
};

function multiplyTwoNumbers(number1, operator, number2) {
	return operator === '*' 
		? number1 * number2 
		: number1 / number2;
}

function evalSumExpression(expression) {
	const tokens = getTokens(expression);

	let operator = '+';
	let partial = 0;
	
	for (let index = 0; index < tokens.length; index++) {
		let token = tokens[index];
		
		if (/\d/.test(parseInt(token))) {
			token = parseInt(token);
			switch (operator) {
				case '+':
					partial = partial + token;  
					break;

				case '-':
					partial = partial - token;
					break;

				default:
					break;
			}
		} else {
			operator = token;
		}
	}

	return partial;
}

export function evalExpression(expression) {
	let result = expression;
	const multiplierExpression = expression.match(MULTIPLIER_EXPRESSION_REGEX);

	if (multiplierExpression) {
		result = expression.replace(
			MULTIPLIER_EXPRESSION_REGEX, 
			evalMultiplierExpression(multiplierExpression[0])
		);
	}
	
	const tokens = getTokens(result);
	const hasSumExpression = tokens.some(token => token === '+' || '-');
		
	if (hasSumExpression) {
		result = evalSumExpression(result);
	}
	
	return result.toString();
}

const OPERATIONS_WHEN_CLEAR_DISPLAY = /\+|\*|\//;
const LAST_DIGIT_IS_OPERATOR = /(\+|\*|\-|\/)$/;
const ZERO_WHEN_CLEAR_DISPLAY = /0/;

function processInput(display, input, lastOperationIsCalculation) {
	if ((OPERATIONS_WHEN_CLEAR_DISPLAY.test(input) || input === '0') && display === '') {
		return display;
	} else if (
		lastOperationIsCalculation 
		&& OPERAND_REGEX.test(display) 
		&& IS_DIGIT_REGEX.test(input)
	) {
		return input;
	}

	if (LAST_DIGIT_IS_OPERATOR.test(display)) {
		if (/(\*|\/)$/.test(display) && input === '-') {
			return display + input;
		} else if (input === '0') {
			return display;
		} else {
			return display.replace(LAST_DIGIT_IS_OPERATOR, input);
		}
	}

	return display + input;
}

function validateEqual(input) {
	if (/\d$/.test(input)) {
		return true;
	}

	return false;
}

// let input;

// input = processInput('', '*');
// console.log('should not permit operations when display is clear: ', input, input === '');

// input = processInput('', '/');
// console.log('should not permit operations when display is clear: ', input, input === '');

// input = processInput('', '+');
// console.log('should not permit operations when display is clear: ', input, input === '');

// input = processInput('', '-');
// console.log('should permit minus when display is clear: ', input, input === '-');

// input = validateEqual('1+3+');
// console.log('should not permit equal: ', input, input === false);

// input = validateEqual('1+3+5');
// console.log('should permit equal: ', input, input === true);

// input = processInput('1+', '+')
// console.log('should replace operand: ', input, input === '1+');
// input = processInput('1+', '*')
// console.log('should replace operand: ', input, input === '1*');
// input = processInput('1+', '/')
// console.log('should replace operand: ', input, input === '1/');
// input = processInput('1+', '-')
// console.log('should replace operand: ', input, input === '1-');
// input = processInput('1-', '+')
// console.log('should replace operand: ', input, input === '1+');
// input = processInput('1-', '/')
// console.log('should replace operand: ', input, input === '1/');
// input = processInput('1-', '-')
// console.log('should replace operand: ', input, input === '1-');
// input = processInput('6/', '-')
// console.log('should permit minus after operator: ', input, input === '6/-');
// input = processInput('6*', '-')
// console.log('should permit minus after operator: ', input, input === '6*-');

// input = processInput('6*-', '*')
// console.log('should not permit operator after minus: ', input, input === '6**');

// input = processInput('6*-', '+')
// console.log('should not permit operator after minus: ', input, input === '6*+');

// input = processInput('', '0')
// console.log('no leading zeros ', input, input === '');

// input = processInput('6/', '0')
// console.log('no leading zeros ', input, input === '6/');

// input = processInput('2+3*', '0')
// console.log('no leading zeros ', input, input === '2+3*');

// input = processInput('2+3*1', '0')
// console.log('no leading zeros ', input, input === '2+3*10');

// input = processInput('-220', '6', true);
// console.log('after calculation ', input, input === '6');

// input = processInput('6', '8', true);
// console.log('after calculation ', input, input === '8');

// input = processInput('6', '+', true);
// console.log('after calculation ', input, input === '6+');

// input = processInput('6', '*', true);
// console.log('after calculation ', input, input === '6*');

// input = processInput('6', '7', false);
// console.log('after calculation ', input, input === '67');

// input = processInput('6', '/', false);
// console.log('after calculation ', input, input === '6/');

// input = processInput('6', '0', false);
// console.log('after calculation ', input, input === '60');

// input = evalExpression('-8-9*-6');
// console.log('should keep operations hierarquy', input, input === '46');

// input = getTokens('-8-9*-6');
// console.log('should tokenize correctly', input, input.toString() === '-8,-,9,*,-6');

// console.warn('========== getTokens ==========');
// var tokens = getTokens('1+2-4');
// console.log('should return ["1", "+", "2", "-4"]', tokens, tokens.toString() == '1,+,2,-4');

// tokens = getTokens('-12/5');
// console.log('should return ["-12", "/", "5"]', tokens, tokens.toString() == '-12,/,5');

// console.warn('========== evalExpression ==========');
// var result;
// result = evalExpression('1+2-4');
// console.log('should return -1: ', result, result === '-1');

// result = evalExpression('8/2');
// console.log('should return 4: ', result, result === '4');

// result = evalExpression('10/2');
// console.log('should return 5: ', result, result === '5');

// result = evalExpression('10/2*10');
// console.log('should return 50: ', result, result === '50');

// result = evalExpression('2+10/2*10');
// console.log('should return 52: ', result, result === '52');

// result = evalExpression('-0*-0');
// console.log('should return 0: ', result, result === '0');

// result = evalExpression('3-5');
// console.log('should return -2: ', result, result === '-2');

// result = evalExpression('-12/-5');
// console.log('should return 2: ', result, result === '2');

// result = evalExpression('3/3');
// console.log('should return 1: ', result, result === '1');

// result = evalExpression('213-200+10');
// console.log('should return 23: ', result, result === '23');

// result = evalExpression('3/5');
// console.log('should return 0: ', result, result === '0');

// result = evalExpression('63/15');
// console.log('should return 4: ', result, result === '4');

// result = evalExpression('-12/5');
// console.log('should return -3: ', result, result === '-3');

// result = evalExpression('3/-0');
// console.log('should return "": ', result, result == '');

// result = evalExpression('3/0');
// console.log('should return "": ', result, result == '');

// result = evalExpression('-8-7216/-3*-24*5+9900');
// console.log('should return -278748', result, result === '-278748');

// result = evalExpression('-0-0-0');
// console.log('should return 0', result, result === '0');

// console.log(evalExpression(solveMultiplierAndDivisors('2+10/2*10')));
// console.log(solveMultiplierAndDivisors('2+10/2*10'));
// console.log(evalExpression('10/2*10'));