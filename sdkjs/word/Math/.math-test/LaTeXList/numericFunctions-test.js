function numeric(test) {
	test(
		"\\exp_a b = a^b, \\exp b = e^b, 10^m, \\exp_{a}^x {b}",
		{
			"body": [
				{
					"down": {
						"type": "CharLiteral",
						"value": "a"
					},
					"third": {
						"type": "CharLiteral",
						"value": "b"
					},
					"type": "SubSupLiteral",
					"value": {
						"type": "opNaryLiteral",
						"value": "\\exp"
					}
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "OperatorLiteral",
					"value": "="
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "SubSupLiteral",
					"up": {
						"type": "CharLiteral",
						"value": "b"
					},
					"value": {
						"type": "CharLiteral",
						"value": "a"
					}
				},
				{
					"type": "opDecimal",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"third": {
						"type": "CharLiteral",
						"value": "b"
					},
					"type": "opNaryLiteral",
					"value": "\\exp"
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "OperatorLiteral",
					"value": "="
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "SubSupLiteral",
					"up": {
						"type": "CharLiteral",
						"value": "b"
					},
					"value": {
						"type": "CharLiteral",
						"value": "e"
					}
				},
				{
					"type": "opDecimal",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "SubSupLiteral",
					"up": {
						"type": "CharLiteral",
						"value": "m"
					},
					"value": {
						"type": "NumberLiteral",
						"value": "10"
					}
				},
				{
					"type": "opDecimal",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"down": {
						"type": "CharLiteral",
						"value": "a"
					},
					"third": {
						"type": "CharLiteral",
						"value": "b"
					},
					"type": "SubSupLiteral",
					"up": {
						"type": "CharLiteral",
						"value": "x"
					},
					"value": {
						"type": "opNaryLiteral",
						"value": "\\exp"
					}
				}
			],
			"type": "LaTeXEquation"
		},
		"Check \\exp_a b = a^b, \\exp b = e^b, 10^m, \\exp_{a}^x {b}"
	);
	test(
		"\\ln c, \\lg d = \\log e, \\log_{10} f",
		{
			"body": [
				{
					"third": {
						"type": "CharLiteral",
						"value": "c"
					},
					"type": "opNaryLiteral",
					"value": "\\ln"
				},
				{
					"type": "opDecimal",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"third": {
						"type": "CharLiteral",
						"value": "d"
					},
					"type": "opNaryLiteral",
					"value": "\\lg"
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "OperatorLiteral",
					"value": "="
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"third": {
						"type": "CharLiteral",
						"value": "e"
					},
					"type": "opNaryLiteral",
					"value": "\\log"
				},
				{
					"type": "opDecimal",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"down": {
						"type": "NumberLiteral",
						"value": "10"
					},
					"third": {
						"type": "CharLiteral",
						"value": "f"
					},
					"type": "SubSupLiteral",
					"value": {
						"type": "opNaryLiteral",
						"value": "\\log"
					}
				}
			],
			"type": "LaTeXEquation"
		},
		"Check \\ln c, \\lg d = \\log e, \\log_{10} f"
	);
	test(
		"\\sin a, \\cos b, \\tan c, \\cot d, \\sec e, \\csc f, \\cos^2_{y}{b}",
		{
			"type": "LaTeXEquation",
			"body": [
				{
					"type": "FunctionLiteral",
					"value": "\\sin",
					"third": {
						"type": "CharLiteral",
						"value": "a"
					}
				},
				{
					"type": "MathOperatorLiteral",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "FunctionLiteral",
					"value": "\\cos",
					"third": {
						"type": "CharLiteral",
						"value": "b"
					}
				},
				{
					"type": "MathOperatorLiteral",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "FunctionLiteral",
					"value": "\\tan",
					"third": {
						"type": "CharLiteral",
						"value": "c"
					}
				},
				{
					"type": "MathOperatorLiteral",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "FunctionLiteral",
					"value": "\\cot",
					"third": {
						"type": "CharLiteral",
						"value": "d"
					}
				},
				{
					"type": "MathOperatorLiteral",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "FunctionLiteral",
					"value": "\\sec",
					"third": {
						"type": "CharLiteral",
						"value": "e"
					}
				},
				{
					"type": "MathOperatorLiteral",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "FunctionLiteral",
					"value": "\\csc",
					"third": {
						"type": "CharLiteral",
						"value": "f"
					}
				},
				{
					"type": "MathOperatorLiteral",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "SubSupLiteral",
					"value": {
						"type": "FunctionLiteral",
						"value": "\\cos"
					},
					"up": {
						"type": "NumberLiteral",
						"value": "2"
					},
					"down": {
						"type": "CharLiteral",
						"value": "y"
					},
					"third": {
						"type": "CharLiteral",
						"value": "b"
					}
				}
			]
		},
		"Check \\sin a, \\cos b, \\tan c, \\cot d, \\sec e, \\csc f, \\cos^2_{y}{b}"
	);
	test(
		"\\arcsin h, \\arccos_x i, \\arctan^y_{x} {j}",
		{
			"type": "LaTeXEquation",
			"body": [
				{
					"type": "FunctionLiteral",
					"value": "\\arcsin",
					"third": {
						"type": "CharLiteral",
						"value": "h"
					}
				},
				{
					"type": "MathOperatorLiteral",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "SubSupLiteral",
					"value": {
						"type": "FunctionLiteral",
						"value": "\\arccos"
					},
					"down": {
						"type": "CharLiteral",
						"value": "x"
					},
					"third": {
						"type": "CharLiteral",
						"value": "i"
					}
				},
				{
					"type": "MathOperatorLiteral",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "SubSupLiteral",
					"value": {
						"type": "FunctionLiteral",
						"value": "\\arctan"
					},
					"up": {
						"type": "CharLiteral",
						"value": "y"
					},
					"down": {
						"type": "CharLiteral",
						"value": "x"
					},
					"third": {
						"type": "CharLiteral",
						"value": "j"
					}
				}
			]
		},
		"Check \\arcsin h, \\arccos_x i, \\arctan^y_{x} {j}"
	);
	test(
		"\\sinhk, \\cosh {l}, \\tanh_x^y m, \\coth^{x}_y_1_2 {n}",
		{
			"type": "LaTeXEquation",
			"body": [
				{
					"type": "FunctionLiteral",
					"value": "\\sinh",
					"third": {
						"type": "CharLiteral",
						"value": "k"
					}
				},
				{
					"type": "MathOperatorLiteral",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "FunctionLiteral",
					"value": "\\cosh",
					"third": {
						"type": "CharLiteral",
						"value": "l"
					}
				},
				{
					"type": "MathOperatorLiteral",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "SubSupLiteral",
					"value": {
						"type": "FunctionLiteral",
						"value": "\\tanh"
					},
					"up": {
						"type": "CharLiteral",
						"value": "y"
					},
					"down": {
						"type": "CharLiteral",
						"value": "x"
					},
					"third": {
						"type": "CharLiteral",
						"value": "m"
					}
				},
				{
					"type": "MathOperatorLiteral",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "SubSupLiteral",
					"value": {
						"type": "FunctionLiteral",
						"value": "\\coth"
					},
					"up": {
						"type": "CharLiteral",
						"value": "x"
					},
					"down": {
						"type": "SubSupLiteral",
						"value": {
							"type": "CharLiteral",
							"value": "y"
						},
						"down": {
							"type": "SubSupLiteral",
							"value": {
								"type": "NumberLiteral",
								"value": "1"
							},
							"down": {
								"type": "NumberLiteral",
								"value": "2"
							}
						}
					},
					"third": {
						"type": "CharLiteral",
						"value": "n"
					}
				}
			]
		},
		"Check \\sinhk, \\cosh {l}, \\tanh_x^y m, \\coth^{x}_y_1_2 {n}"
	);
	test(
		"\\left\\vert s \\right\\vert",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "BracketBlock",
				"left": "∣",
				"right": "∣",
				"value": [
					{
						"type": "SpaceLiteral",
						"value": " "
					},
					{
						"type": "CharLiteral",
						"value": "s"
					},
					{
						"type": "SpaceLiteral",
						"value": " "
					}
				]
			}
		},
		"Check \\left\\vert s \\right\\vert"
	);
	test(
		"\\min(x,y), \\max(x,y)",
		{
			"type": "LaTeXEquation",
			"body": [
				{
					"type": "FunctionLiteral",
					"value": "\\min",
					"third": {
						"type": "BracketBlock",
						"left": "(",
						"right": ")",
						"value": [
							{
								"type": "CharLiteral",
								"value": "x"
							},
							{
								"type": "MathOperatorLiteral",
								"value": ","
							},
							{
								"type": "CharLiteral",
								"value": "y"
							}
						]
					}
				},
				{
					"type": "MathOperatorLiteral",
					"value": ","
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "FunctionLiteral",
					"value": "\\max",
					"third": {
						"type": "BracketBlock",
						"left": "(",
						"right": ")",
						"value": [
							{
								"type": "CharLiteral",
								"value": "x"
							},
							{
								"type": "MathOperatorLiteral",
								"value": ","
							},
							{
								"type": "CharLiteral",
								"value": "y"
							}
						]
					}
				}
			]
		},
		"Check \\min(x,y), \\max(x,y)"
	);
	test(
		"0 \\leq \\lim_{n\\to \\infty}\\frac{n!}{(2n)!} \\leq \\lim_{n\\to \\infty} \\frac{n!}{(n!)^2} = \\lim_{k \\to \\infty, k = n!}\\frac{k}{k^2} = \\lim_{k \\to \\infty} \\frac{1}{k} = 0",
		{
			"type": "LaTeXEquation",
			"body": [
				{
					"type": "NumberLiteral",
					"value": "0"
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "CharLiteral",
					"value": "≤"
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "SubSupLiteral",
					"value": {
						"type": "opNaryLiteral",
						"value": "\\lim"
					},
					"down": [
						{
							"type": "CharLiteral",
							"value": "n→"
						},
						{
							"type": "SpaceLiteral",
							"value": " "
						},
						{
							"type": "CharLiteral",
							"value": "∞"
						}
					],
					"third": {
						"type": "FractionLiteral",
						"up": {
							"type": "CharLiteral",
							"value": "n!"
						},
						"down": [
							{
								"type": "BracketBlock",
								"left": "(",
								"right": ")",
								"value": [
									{
										"type": "NumberLiteral",
										"value": "2"
									},
									{
										"type": "CharLiteral",
										"value": "n"
									}
								]
							},
							{
								"type": "CharLiteral",
								"value": "!"
							}
						]
					}
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "CharLiteral",
					"value": "≤"
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "SubSupLiteral",
					"value": {
						"type": "opNaryLiteral",
						"value": "\\lim"
					},
					"down": [
						{
							"type": "CharLiteral",
							"value": "n→"
						},
						{
							"type": "SpaceLiteral",
							"value": " "
						},
						{
							"type": "CharLiteral",
							"value": "∞"
						}
					],
					"third": {
						"type": "FractionLiteral",
						"up": {
							"type": "CharLiteral",
							"value": "n!"
						},
						"down": {
							"type": "SubSupLiteral",
							"value": {
								"type": "BracketBlock",
								"left": "(",
								"right": ")",
								"value": {
									"type": "CharLiteral",
									"value": "n!"
								}
							},
							"up": {
								"type": "NumberLiteral",
								"value": "2"
							}
						}
					}
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "OperatorLiteral",
					"value": "="
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "SubSupLiteral",
					"value": {
						"type": "opNaryLiteral",
						"value": "\\lim"
					},
					"down": [
						{
							"type": "CharLiteral",
							"value": "k"
						},
						{
							"type": "SpaceLiteral",
							"value": " "
						},
						{
							"type": "CharLiteral",
							"value": "→"
						},
						{
							"type": "SpaceLiteral",
							"value": " "
						},
						{
							"type": "CharLiteral",
							"value": "∞"
						},
						{
							"type": "opDecimal",
							"value": ","
						},
						{
							"type": "SpaceLiteral",
							"value": " "
						},
						{
							"type": "CharLiteral",
							"value": "k"
						},
						{
							"type": "SpaceLiteral",
							"value": " "
						},
						{
							"type": "OperatorLiteral",
							"value": "="
						},
						{
							"type": "SpaceLiteral",
							"value": " "
						},
						{
							"type": "CharLiteral",
							"value": "n!"
						}
					],
					"third": {
						"type": "FractionLiteral",
						"up": {
							"type": "CharLiteral",
							"value": "k"
						},
						"down": {
							"type": "SubSupLiteral",
							"value": {
								"type": "CharLiteral",
								"value": "k"
							},
							"up": {
								"type": "NumberLiteral",
								"value": "2"
							}
						}
					}
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "OperatorLiteral",
					"value": "="
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "SubSupLiteral",
					"value": {
						"type": "opNaryLiteral",
						"value": "\\lim"
					},
					"down": [
						{
							"type": "CharLiteral",
							"value": "k"
						},
						{
							"type": "SpaceLiteral",
							"value": " "
						},
						{
							"type": "CharLiteral",
							"value": "→"
						},
						{
							"type": "SpaceLiteral",
							"value": " "
						},
						{
							"type": "CharLiteral",
							"value": "∞"
						}
					],
					"third": {
						"type": "FractionLiteral",
						"up": {
							"type": "NumberLiteral",
							"value": "1"
						},
						"down": {
							"type": "CharLiteral",
							"value": "k"
						}
					}
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "OperatorLiteral",
					"value": "="
				},
				{
					"type": "SpaceLiteral",
					"value": " "
				},
				{
					"type": "NumberLiteral",
					"value": "0"
				}
			]
		},
		"Check: 0 \\leq \\lim_{n\\to \\infty}\\frac{n!}{(2n)!} \\leq \\lim_{n\\to \\infty} \\frac{n!}{(n!)^2} = \\lim_{k \\to \\infty, k = n!}\\frac{k}{k^2} = \\lim_{k \\to \\infty} \\frac{1}{k} = 0"
	);
}
window["AscMath"].numericFunctions = numeric;
