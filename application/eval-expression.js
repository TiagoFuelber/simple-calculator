const MULTIPLIER_EXPRESSION_REGEX = /(-*[0-9]+(\*|\/))+-*[0-9]+/;
const IS_OPERATOR_REGEX = /^\+|\-|\*|\//;
const IS_DIGIT_REGEX = /^\d/;
const OPERAND_REGEX = /^-?\d+(\.\d+)?/;
const NON_SIGNED_OPERAND_REGEX = /^\d+(\.\d+)?/;
const SUM_EXPRESSION_REGEX = /\+|\-/;

export function getTokens(string) {
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

export function processInput(display, input, lastOperationIsCalculation) {
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

export function validateEqual(input) {
	if (/\d$/.test(input)) {
		return true;
	}

	return false;
}
