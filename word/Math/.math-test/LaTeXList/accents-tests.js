function accents(test) {
	test(
		"\\dot{a}",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "a"
				},
				"value": 775
			}
		},
		"Check \\dot{a}"
	);
	test(
		"\\ddot{b}",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "b"
				},
				"value": 776
			}
		},
		"Check \\ddot{b}"
	);
	test(
		"\\acute{c}",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "c"
				},
				"value": 769
			}
		},
		"Check \\acute{c}"
	);
	test(
		"\\grave{d}",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "d"
				},
				"value": 768
			}
		},
		"Check \\grave{d}"
	);
	test(
		"\\check{e}",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "e"
				},
				"value": 780
			}
		},
		"Check \\check{e}"
	);
	test(
		"\\breve{f}",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "f"
				},
				"value": 774
			}
		},
		"Check \\breve{f}"
	);
	test(
		"\\tilde{g}",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "g"
				},
				"value": 771
			}
		},
		"Check \\tilde{g}"
	);
	test(
		"\\bar{h}",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "h"
				},
				"value": 772
			}
		},
		"Check \\bar{h}"
	);
	test(
		"\\widehat{j}",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "j"
				},
				"value": 770,
				"isWidth": true
			}
		},
		"Check \\widehat{j}"
	);
	test(
		"\\vec{k}",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "k"
				},
				"value": 8407
			}
		}
		,
		"Check \\vec{k}"
	);
	test(
		"\\not{l}",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "l"
				},
				"value": 824
			}
		},
		"Check \\not{l}"
	);
	test(
		"\\dota",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "a"
				},
				"value": 775
			}
		},
		"Check \\dota"
	);
	test(
		"\\ddotb",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "b"
				},
				"value": 776
			}
		},
		"Check \\ddotb"
	);
	test(
		"\\acutec",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "c"
				},
				"value": 769
			}
		},
		"Check \\acutec"
	);
	test(
		"\\graved",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "d"
				},
				"value": 768
			}
		},
		"Check \\graved"
	);
	test(
		"\\checke",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "e"
				},
				"value": 780
			}
		},
		"Check \\checke"
	);
	test(
		"\\brevef",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "f"
				},
				"value": 774
			}
		},
		"Check \\brevef"
	);
	test(
		"\\tildeg",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "g"
				},
				"value": 771
			}
		},
		"Check \\tildeg"
	);
	test(
		"\\barh",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "h"
				},
				"value": 772
			}
		},
		"Check \\barh"
	);
	test(
		"\\widehatj",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "CharLiteral",
					"value": "j"
				},
				"value": 770,
				"isWidth": true
			}
		},
		"Check \\widehatj"
	);
	test(
		"\\vec \\frac{k}{2}",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "FractionLiteral",
					"up": {
						"type": "CharLiteral",
						"value": "k"
					},
					"down": {
						"type": "NumberLiteral",
						"value": "2"
					}
				},
				"value": 8407
			}
		}
		,
		"Check \\vec \\frac{k}{2}"
	);
	test(
		"\\not\\notl2",
		{
			"type": "LaTeXEquation",
			"body": [
				{
					"type": "AccentLiteral",
					"base": {
						"type": "AccentLiteral",
						"base": {
							"type": "CharLiteral",
							"value": "l"
						},
						"value": 824
					},
					"value": 824
				},
				{
					"type": "NumberLiteral",
					"value": "2"
				}
			]
		},
		"Check \\notl"
	);

	test(
		"5''",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "NumberLiteral",
					"value": "5"
				},
				"value": "''"
			}
		},
		"Check 5''"
	);
	test(
		"\\frac{4}{5}''",
		{
			"type": "LaTeXEquation",
			"body": {
				"type": "AccentLiteral",
				"base": {
					"type": "FractionLiteral",
					"up": {
						"type": "NumberLiteral",
						"value": "4"
					},
					"down": {
						"type": "NumberLiteral",
						"value": "5"
					}
				},
				"value": "''"
			}
		},
		"\\frac{4}{5}''"
	);
}
window["AscCommonWord"].accents = accents;
