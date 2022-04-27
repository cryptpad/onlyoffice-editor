function testAboveBelow(test) {
	test(
		`base┴2+2`,
		{
			type: "UnicodeEquation",
			body: [
				{
					type: "expAbove",
					base: {
						CharLiteral: "base",
					},
					up: {
						type: "soperandLiteral",
						operand: {
							NumberLiteral: "2",
						},
					},
				},
				{
					Operator: "+",
				},
				{
					NumberLiteral: "2",
				},
			],
		},
		"Проверка base┴2+2"
	);
	test(
		`base┴2┴x+2`,
		{
			type: "UnicodeEquation",
			body: [
				{
					type: "expAbove",
					base: {
						CharLiteral: "base",
					},
					up: {
						type: "soperandLiteral",
						operand: {
							type: "expAbove",
							base: [
								{
									NumberLiteral: "2",
								},
							],
							up: {
								type: "soperandLiteral",
								operand: {
									CharLiteral: "x",
								},
							},
						},
					},
				},
				{
					Operator: "+",
				},
				{
					NumberLiteral: "2",
				},
			],
		},
		"Проверка base┴2┴x+2"
	);
	test(
		`base┴2┴(x/y+6)+2`,
		{
			type: "UnicodeEquation",
			body: [
				{
					type: "expAbove",
					base: {
						CharLiteral: "base",
					},
					up: {
						type: "soperandLiteral",
						operand: {
							type: "expAbove",
							base: [
								{
									NumberLiteral: "2",
								},
							],
							up: {
								type: "soperandLiteral",
								operand: {
									type: "expBracketLiteral",
									exp: [
										{
											type: "fractionLiteral",
											up: {
												CharLiteral: "x",
											},
											opOver: "/",
											down: {
												CharLiteral: "y",
											},
										},
										{
											Operator: "+",
										},
										{
											NumberLiteral: "6",
										},
									],
									open: "(",
									close: ")",
								},
							},
						},
					},
				},
				{
					Operator: "+",
				},
				{
					NumberLiteral: "2",
				},
			],
		},
		"Проверка base┴2┴(x/y+6)+2"
	);
	test(
		`base┴2┴(x┴2/y+6)+2`,
		{
			type: "UnicodeEquation",
			body: [
				{
					type: "expAbove",
					base: {
						CharLiteral: "base",
					},
					up: {
						type: "soperandLiteral",
						operand: {
							type: "expAbove",
							base: [
								{
									NumberLiteral: "2",
								},
							],
							up: {
								type: "soperandLiteral",
								operand: {
									type: "expBracketLiteral",
									exp: [
										{
											type: "fractionLiteral",
											up: {
												type: "expAbove",
												base: {
													CharLiteral: "x",
												},
												up: {
													type: "soperandLiteral",
													operand: {
														NumberLiteral: "2",
													},
												},
											},
											opOver: "/",
											down: {
												CharLiteral: "y",
											},
										},
										{
											Operator: "+",
										},
										{
											NumberLiteral: "6",
										},
									],
									open: "(",
									close: ")",
								},
							},
						},
					},
				},
				{
					Operator: "+",
				},
				{
					NumberLiteral: "2",
				},
			],
		},
		"Проверка base┴2┴(x┴2/y+6)+2"
	);
	test(
		`x^23┴2/y`,
		{
			type: "UnicodeEquation",
			body: {
				type: "fractionLiteral",
				up: {
					type: "expSuperscript",
					base: {
						CharLiteral: "x",
					},
					up: {
						type: "soperandLiteral",
						operand: {
							type: "expAbove",
							base: [
								{
									NumberLiteral: "23",
								},
							],
							up: {
								type: "soperandLiteral",
								operand: {
									NumberLiteral: "2",
								},
							},
						},
					},
				},
				opOver: "/",
				down: {
					CharLiteral: "y",
				},
			},
		},
		"Проверка x^23┴2/y"
	);
	test(
		`(x^23)┴2/y`,
		{
			type: "UnicodeEquation",
			body: {
				type: "fractionLiteral",
				up: {
					type: "expAbove",
					base: {
						type: "expBracketLiteral",
						exp: {
							type: "expSuperscript",
							base: {
								CharLiteral: "x",
							},
							up: {
								type: "soperandLiteral",
								operand: {
									NumberLiteral: "23",
								},
							},
						},
						open: "(",
						close: ")",
					},
					up: {
						type: "soperandLiteral",
						operand: {
							NumberLiteral: "2",
						},
					},
				},
				opOver: "/",
				down: {
					CharLiteral: "y",
				},
			},
		},
		"Проверка (x^23)┴2/y"
	);

	test(
		`4┴2+2`,
		{
			type: "UnicodeEquation",
			body: [
				{
					type: "expAbove",
					base: [
						{
							NumberLiteral: "4",
						},
					],
					up: {
						type: "soperandLiteral",
						operand: {
							NumberLiteral: "2",
						},
					},
				},
				{
					Operator: "+",
				},
				{
					NumberLiteral: "2",
				},
			],
		},
		"Проверка 4┴2+2"
	);
	test(
		`base┴exp*xz`,
		{
			type: "UnicodeEquation",
			body: [
				{
					type: "expAbove",
					base: {
						CharLiteral: "base",
					},
					up: {
						type: "soperandLiteral",
						operand: {
							CharLiteral: "exp",
						},
					},
				},
				{
					Operator: "*",
				},
				{
					CharLiteral: "xz",
				},
			],
		},
		"Проверка base┴exp*xz"
	);
	test(
		`2┴exp-p`,
		{
			type: "UnicodeEquation",
			body: [
				{
					type: "expAbove",
					base: [
						{
							NumberLiteral: "2",
						},
					],
					up: {
						type: "soperandLiteral",
						operand: {
							CharLiteral: "exp",
						},
					},
				},
				{
					Operator: "-",
				},
				{
					CharLiteral: "p",
				},
			],
		},
		"Проверка 2┴exp-p"
	);
	test(
		`base┬2*x`,
		{
			type: "UnicodeEquation",
			body: [
				{
					type: "expBelow",
					base: {
						CharLiteral: "base",
					},
					down: {
						type: "soperandLiteral",
						operand: {
							NumberLiteral: "2",
						},
					},
				},
				{
					Operator: "*",
				},
				{
					CharLiteral: "x",
				},
			],
		},
		"Проверка base┬2*x"
	);
	test(
		`4┬2+x/y`,
		{
			type: "UnicodeEquation",
			body: [
				{
					type: "expBelow",
					base: [
						{
							NumberLiteral: "4",
						},
					],
					down: {
						type: "soperandLiteral",
						operand: {
							NumberLiteral: "2",
						},
					},
				},
				{
					Operator: "+",
				},
				{
					type: "fractionLiteral",
					up: {
						CharLiteral: "x",
					},
					opOver: "/",
					down: {
						CharLiteral: "y",
					},
				},
			],
		},
		"Проверка 4┬2+x/y"
	);
	test(
		`base┬exp*x^2`,
		{
			type: "UnicodeEquation",
			body: [
				{
					type: "expBelow",
					base: {
						CharLiteral: "base",
					},
					down: {
						type: "soperandLiteral",
						operand: {
							CharLiteral: "exp",
						},
					},
				},
				{
					Operator: "*",
				},
				{
					type: "expSuperscript",
					base: {
						CharLiteral: "x",
					},
					up: {
						type: "soperandLiteral",
						operand: {
							NumberLiteral: "2",
						},
					},
				},
			],
		},
		"Проверка base┬exp*x^2"
	);
	test(
		`2┬exp-x_i`,
		{
			type: "UnicodeEquation",
			body: [
				{
					type: "expBelow",
					base: [
						{
							NumberLiteral: "2",
						},
					],
					down: {
						type: "soperandLiteral",
						operand: {
							CharLiteral: "exp",
						},
					},
				},
				{
					Operator: "-",
				},
				{
					type: "expSubscript",
					base: {
						CharLiteral: "x",
					},
					down: {
						type: "soperandLiteral",
						operand: {
							CharLiteral: "i",
						},
					},
				},
			],
		},
		"Проверка 2┬exp-x_i"
	);
	test(
		`2┬(exp+2)+(2+1)`,
		{
			type: "UnicodeEquation",
			body: [
				{
					type: "expBelow",
					base: [
						{
							NumberLiteral: "2",
						},
					],
					down: {
						type: "soperandLiteral",
						operand: {
							type: "expBracketLiteral",
							exp: [
								{
									CharLiteral: "exp",
								},
								{
									Operator: "+",
								},
								{
									NumberLiteral: "2",
								},
							],
							open: "(",
							close: ")",
						},
					},
				},
				{
					Operator: "+",
				},
				{
					type: "expBracketLiteral",
					exp: [
						{
							NumberLiteral: "2",
						},
						{
							Operator: "+",
						},
						{
							NumberLiteral: "1",
						},
					],
					open: "(",
					close: ")",
				},
			],
		},
		"Проверка 2┬(exp+2)+(2+1)"
	);
	test(
		`2┬(exp+2+x/2)^2 - 1`,
		{
			type: "UnicodeEquation",
			body: [
				{
					type: "expBelow",
					base: [
						{
							NumberLiteral: "2",
						},
					],
					down: {
						type: "soperandLiteral",
						operand: {
							type: "expSuperscript",
							base: {
								type: "expBracketLiteral",
								exp: [
									{
										CharLiteral: "exp",
									},
									{
										Operator: "+",
									},
									{
										NumberLiteral: "2",
									},
									{
										Operator: "+",
									},
									{
										type: "fractionLiteral",
										up: {
											CharLiteral: "x",
										},
										opOver: "/",
										down: {
											NumberLiteral: "2",
										},
									},
								],
								open: "(",
								close: ")",
							},
							up: {
								type: "soperandLiteral",
								operand: {
									NumberLiteral: "2",
								},
							},
						},
					},
				},
				{
					type: "SpaceLiteral",
					value: " ",
				},
				{
					Operator: "-",
				},
				{
					type: "SpaceLiteral",
					value: " ",
				},
				{
					NumberLiteral: "1",
				},
			],
		},
		"Проверка 2┬(exp+2+x/2)^2 - 1"
	);
	test(
		`(2+x)┬exp`,
		{
			type: "UnicodeEquation",
			body: {
				type: "expBelow",
				base: {
					type: "expBracketLiteral",
					exp: [
						{
							NumberLiteral: "2",
						},
						{
							Operator: "+",
						},
						{
							CharLiteral: "x",
						},
					],
					open: "(",
					close: ")",
				},
				down: {
					type: "soperandLiteral",
					operand: {
						CharLiteral: "exp",
					},
				},
			},
		},
		"Проверка `(2+x)┬exp`"
	);
	test(
		`(2+y)┬(exp+2+x/2)`,
		{
			type: "UnicodeEquation",
			body: {
				type: "expBelow",
				base: {
					type: "expBracketLiteral",
					exp: [
						{
							NumberLiteral: "2",
						},
						{
							Operator: "+",
						},
						{
							CharLiteral: "y",
						},
					],
					open: "(",
					close: ")",
				},
				down: {
					type: "soperandLiteral",
					operand: {
						type: "expBracketLiteral",
						exp: [
							{
								CharLiteral: "exp",
							},
							{
								Operator: "+",
							},
							{
								NumberLiteral: "2",
							},
							{
								Operator: "+",
							},
							{
								type: "fractionLiteral",
								up: {
									CharLiteral: "x",
								},
								opOver: "/",
								down: {
									NumberLiteral: "2",
								},
							},
						],
						open: "(",
						close: ")",
					},
				},
			},
		},
		"Проверка `(2+y)┬(exp+2+x/2)`"
	);
	test(
		`(2+y^2)┬(exp_3+2+x/2)`,
		{
			type: "UnicodeEquation",
			body: {
				type: "expBelow",
				base: {
					type: "expBracketLiteral",
					exp: [
						{
							NumberLiteral: "2",
						},
						{
							Operator: "+",
						},
						{
							type: "expSuperscript",
							base: {
								CharLiteral: "y",
							},
							up: {
								type: "soperandLiteral",
								operand: {
									NumberLiteral: "2",
								},
							},
						},
					],
					open: "(",
					close: ")",
				},
				down: {
					type: "soperandLiteral",
					operand: {
						type: "expBracketLiteral",
						exp: [
							{
								type: "expSubscript",
								base: {
									CharLiteral: "exp",
								},
								down: {
									type: "soperandLiteral",
									operand: {
										NumberLiteral: "3",
									},
								},
							},
							{
								Operator: "+",
							},
							{
								NumberLiteral: "2",
							},
							{
								Operator: "+",
							},
							{
								type: "fractionLiteral",
								up: {
									CharLiteral: "x",
								},
								opOver: "/",
								down: {
									NumberLiteral: "2",
								},
							},
						],
						open: "(",
						close: ")",
					},
				},
			},
		},
		"Проверка `(2+y^2)┬(exp_3+2+x/2)`"
	);
}
module.exports = {
	testAboveBelow,
};
