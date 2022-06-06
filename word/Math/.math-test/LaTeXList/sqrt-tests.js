function sqrt(test) {
	test(
		"\\sqrt5",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "SqrtLiteral",
				"base": {
					"type": "NumberLiteral",
					"value": "5"
				}
			}
		},
		"Check \\sqrt5"
	);
	test(
		"\\sqrt\\frac{1}{2}",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "SqrtLiteral",
				"base": {
					"type": "FractionLiteral",
					"up": {
						"type": "NumberLiteral",
						"value": "1"
					},
					"down": {
						"type": "NumberLiteral",
						"value": "2"
					}
				}
			}
		},
		"Check \\sqrt\\frac{1}{2}"
	);
	test(
		"\\sqrt[2^2]\\frac{1}{2}",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "SqrtLiteral",
				"base": {
					"type": "FractionLiteral",
					"up": {
						"type": "NumberLiteral",
						"value": "1"
					},
					"down": {
						"type": "NumberLiteral",
						"value": "2"
					}
				},
				"index": {
					"type": "SubSupLiteral",
					"value": {
						"type": "NumberLiteral",
						"value": "2"
					},
					"up": {
						"type": "NumberLiteral",
						"value": "2"
					}
				}
			}
		},
		"Check \\sqrt[2^2]\\frac{1}{2}"
	);
	test(
		"\\sqrt[2^2] {\\frac{1}{2}+3}",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "SqrtLiteral",
				"base": [
					{
						"type": "FractionLiteral",
						"up": {
							"type": "NumberLiteral",
							"value": "1"
						},
						"down": {
							"type": "NumberLiteral",
							"value": "2"
						}
					},
					{
						"type": "MathOperatorLiteral",
						"value": "+"
					},
					{
						"type": "NumberLiteral",
						"value": "3"
					}
				],
				"index": {
					"type": "SubSupLiteral",
					"value": {
						"type": "NumberLiteral",
						"value": "2"
					},
					"up": {
						"type": "NumberLiteral",
						"value": "2"
					}
				}
			}
		},
		"Check \\sqrt[2^2] {\\frac{1}{2}+3}"
	);
}
window["AscCommonWord"].sqrt = sqrt;
