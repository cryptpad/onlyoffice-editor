//add nice frac to unicode
describe("Проверка работы конвертеров", function () {
	beforeEach(() => Para.Root.Content = []);

	describe("Проверка работы LaTeX конвертора", function () {
		describe("Раное", function () {
			it("Вставка пробелов", function () {
				Para.Root.Add_Text(' ', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), ' ');
			});
			it("Вставка текста", function () {
				Para.Root.Add_Text('1509670348503847508мотваомрывдаомыдвомщоаыврищзывр', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), '1509670348503847508мотваомрывдаомыдвомщоаыврищзывр');
			});

			it("\\alpha, \\Alpha, \\beta, \\Beta, \\gamma, \\Gamma, \\pi, \\Pi, \\phi, \\varphi, \\mu, \\Phi", function () {
				Para.Root.Add_Text('\\alpha, \\Alpha, \\beta, \\Beta, \\gamma, \\Gamma, \\pi, \\Pi, \\phi, \\varphi, \\mu, \\Phi', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), 'α, Α, β, Β, γ, Γ, π, Π, φ, ϕ, μ, Φ');
			});
			
			it("a \\bmod b", function () {
				Para.Root.Add_Text('a \\bmod b', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), 'a \\bmod b');
			});
			it("f(n) = n^5 + 4n^2 + 2 |_{n=17}", function () {
				Para.Root.Add_Text('f(n) = n^5 + 4n^2 + 2 |_{n=17}', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), 'f(n) = n^5 + 4n^2 + 2 |_{n=17}');
			});
			it("n^5 + 4n^2", function () {
				Para.Root.Add_Text('n^5 + 4n^2', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), 'n^5 + 4n^2');
			});
			it("2 |_{n=17}", function () {
				Para.Root.Add_Text('2 |_{n=17}', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), '2 |_{n=17}');
			});
		})
		describe("Проверка обработки деления", function () {
			describe("Создание функций без контента", function () {
				it("Создание стандартного деления: \\frac{}{}", function () {
					Para.Root.Add_Text('\\frac{}{}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\frac{}{}');
				});
				it("Создание стандартного деления: \\frac{}{}+2", function () {
					Para.Root.Add_Text('\\frac{}{}+2', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\frac{}{}+2');
				});
				it("Проверка типа стандартного деления Pr.type: \\frac{}{}", function () {
					Para.Root.Add_Text('\\frac{}{}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					var e = Para.Root.Content[1].Pr.type;
					assert.equal(e, 0);
				});
				it("Скошеное деление: \\sfrac{}{}", function () {
					Para.Root.Add_Text('\\sfrac{}{}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\sfrac{}{}');
				});
				it("Скошеное деление: \\sfrac{}{}+2", function () {
					Para.Root.Add_Text('\\sfrac{}{}+2', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\sfrac{}{}+2');
				});
				it("Проверка типа cкошеного деления Pr.type: \\sfrac{}{}", function () {
					Para.Root.Add_Text('\\sfrac{}{}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					var e = Para.Root.Content[1].Pr.type;
					assert.equal(e, 1);
				});
				it("Строчное деление: \\cfrac{}{}", function () {
					Para.Root.Add_Text('\\cfrac{}{}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\cfrac{}{}');
				});
				it("Строчное деление: \\cfrac{}{}+2", function () {
					Para.Root.Add_Text('\\cfrac{}{}+2', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\cfrac{}{}+2');
				});
				it("Проверка типа строчного деления Pr.type: \\cfrac{}{}", function () {
					Para.Root.Add_Text('\\cfrac{}{}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					var e = Para.Root.Content[1].Pr.type;
					assert.equal(e, 2);
				});
				it("Маленькое деление без контента: \\nicefrac{}{}", function () {
					Para.Root.Add_Text('\\nicefrac{}{}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\rect{\\frac{}{}}');
				});
			})
			describe("Наполнение функций", function () {
				it("Наполнение стандартного деления: \\frac{1+2}{2+x^2}", function () {
					Para.Root.Add_Text('\\frac{1+2}{2+x^2}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\frac{1+2}{2+x^2}');
				});
				it("Скошеное деление: \\sfrac{1_i+2}{2+x^2}", function () {
					Para.Root.Add_Text('\\sfrac{1_i+2}{2+x^2}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\sfrac{1_i+2}{2+x^2}');
				});
				it("Строчное деление: \\cfrac{1_i+2}{2+x^2}", function () {
					Para.Root.Add_Text('\\cfrac{1_i+2}{2+x^2}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\cfrac{1_i+2}{2+x^2}');
				});
				it("Маленькое деление: \\nicefrac{1_i+2}{2+x^2}", function () {
					Para.Root.Add_Text('\\nicefrac{1_i+2}{2+x^2}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\rect{\\frac{1_i+2}{2+x^2}}');
				});

				it("Наполнение стандартного деления: \\frac{}{2+x^2}", function () {
					Para.Root.Add_Text('\\frac{}{2+x^2}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\frac{}{2+x^2}');
				});
				it("Скошеное деление: \\sfrac{}{2+x^2}", function () {
					Para.Root.Add_Text('\\sfrac{}{2+x^2}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\sfrac{}{2+x^2}');
				});
				it("Строчное деление: \\cfrac{}{2+x^2}", function () {
					Para.Root.Add_Text('\\cfrac{}{2+x^2}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\cfrac{}{2+x^2}');
				});
				it("Маленькое деление: \\nicefrac{}{2+x^2}", function () {
					Para.Root.Add_Text('\\nicefrac{}{2+x^2}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\rect{\\frac{}{2+x^2}}');
				});
				
				it("Наполнение стандартного деления: \\frac{1+2}{}", function () {
					Para.Root.Add_Text('\\frac{1+2}{}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\frac{1+2}{}');
				});
				it("Скошеное деление: \\sfrac{1_i+2}{}", function () {
					Para.Root.Add_Text('\\sfrac{1_i+2}{}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\sfrac{1_i+2}{}');
				});
				it("Строчное деление: \\cfrac{1_i+2}{}", function () {
					Para.Root.Add_Text('\\cfrac{1_i+2}{}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\cfrac{1_i+2}{}');
				});
				it("Маленькое деление: \\nicefrac{1_i+2}{}", function () {
					Para.Root.Add_Text('\\nicefrac{1_i+2}{}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\rect{\\frac{1_i+2}{}}');
				});
			})
			describe("Рекурсия функций", function () {
				it("Деление с большой вложенностью", function () {
					Para.Root.Add_Text('\\frac{\\frac{\\frac{\\frac{\\frac{1+2}{2}}{2}}{2}}{2}}{2}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '\\frac{\\frac{\\frac{\\frac{\\frac{1+2}{2}}{2}}{2}}{2}}{2}');
				});

			})

			it("\\frac{n!}{k!(n-k)!} = \\binom{n}{k}", function () {
				Para.Root.Add_Text('\\frac{n!}{k!(n-k)!} = \\binom{n}{k}', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), '\\frac{n!}{k!(n-k)!} = (\\frac{n}{k})');
			});
			it("\\frac{\\frac{1}{x}+\\frac{1}{y}}{y-z}", function () {
				Para.Root.Add_Text('\\frac{\\frac{1}{x}+\\frac{1}{y}}{y-z}', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), '\\frac{\\frac{1}{x}+\\frac{1}{y}}{y-z}');
			});
		})
		describe("Проверка обработки функций", function () {
			var funcs = ['cos', 'sin', 'tan', 'sec', 'cot', 'csc', 'arcsin', 'arccos', 'arctan', 'arcsec', 'arccot', 'arccsc', 'sinh', 'cosh', 'tanh', 'coth', 'sech', 'csch', 'srcsinh', 'arctanh', 'arcsech', 'arccosh', 'arccoth', 'arccsch']
			
			for (var i = 0; i < funcs.length; i++) {
				var str = `\\${funcs[i]}{}`;
				makeFunc(str, str.slice(0, -2))
				
			}
			for (var i = 0; i < funcs.length; i++) {
				var str = `\\${funcs[i]}`;
				makeFunc(str)
				
			}
			for (var i = 0; i < funcs.length; i++) {
				var str = `\\${funcs[i]}^2`;
				makeFunc(str)	
			}
			for (var i = 0; i < funcs.length; i++) {
				var str = `\\${funcs[i]}2`;
				makeFunc(str)	
			}
			for (var i = 0; i < funcs.length; i++) {
				var str = `\\${funcs[i]}{x}`;
				makeFunc(str, str.slice(0, -3) + 'x')	
			}
			for (var i = 0; i < funcs.length; i++) {
				var str = `\\${funcs[i]}{\\frac{x}{y}}`;
				makeFunc(str)	
			}
			for (var i = 0; i < funcs.length; i++) {
				var str = `\\${funcs[i]}\\frac{x}{y}`;
				makeFunc(str, str.slice(0, -11) + '{\\frac{x}{y}}')	
			}
			function makeFunc(str, check) {
				if (check === undefined) {
					check = str
				}
				it(str, function () {
					Para.Root.Add_Text(str, Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), check);
				});
			}
			

			it("\\cos (2\theta) = \\cos^2 \\theta - \\sin^2 \\theta", function () {
				Para.Root.Add_Text('\\cos (2\\theta) = \\cos^2 \\theta - \\sin^2 \\theta', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), '\\cos (2\\theta) = \\cos^2 \\theta - \\sin^2 \\theta');
			});
			it("\\sin (2\\theta) = \\sin^2 \\theta", function () {
				Para.Root.Add_Text('\\cos (2\\theta) = \\cos^2 \\theta - \\sin^2 \\theta', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), '\\cos (2\\theta) = \\cos^2 \\theta - \\sin^2 \\theta');
			});
			it("\\lim_{2\\theta}\\theta", function () {
				Para.Root.Add_Text('\lim_{2\\theta}\\theta', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), '\\lim_{2\\theta}\\theta');
			});
			it("\\lim^{2\\theta}\\theta", function () {
				Para.Root.Add_Text('\lim_{2\\theta}\\theta', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), '\\lim_{2\\theta}\\theta');
			});
			it("\\lim\\limits_{x \\to \\infty} \\exp(-x) = 0", function () {
				Para.Root.Add_Text('\\lim\\limits_{x \\to \\infty} \\exp(-x) = 0', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), '\\lim_{x \\to \\infty} \\exp{(-x)} = 0');
			});
		})
		describe("Проверка обработки больших операторов", function () {
			var largeOpers = [ 'int', 'oint', 'iint', 'oiint', 'iiint', 'oiiint', 'iiiint', 'sum', 'bigoplus', 'biguplus', //'idotsint',
				'bigcap', 'bigcup', 'bigotimes', 'bigsqcup', 'bigodot', 'prod', 'coprod', 'bigvee', 'bigwedge'];
			
			function makeFunc(str, check) {
				if (check === undefined) { check = str }
				it(str, function () {
					Para.Root.Add_Text(str, Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), check);
				});
			}

			for (var i = 0; i < largeOpers.length; i++) {
				var str = `\\${largeOpers[i]}`;
				makeFunc(str)
			}
			for (var i = 0; i < largeOpers.length; i++) {
				var str = `\\${largeOpers[i]}^{}_{}{}`;
				makeFunc(str, str.slice(0,-8))
			}
			for (var i = 0; i < largeOpers.length; i++) {
				var str = `\\${largeOpers[i]}^x_{}{}`;
				makeFunc(str, str.slice(0,-5))
			}
			for (var i = 0; i < largeOpers.length; i++) {
				var str = `\\${largeOpers[i]}^x_y{}`;
				makeFunc(str, str.slice(0,-2))
			}
			for (var i = 0; i < largeOpers.length; i++) {
				var str = `\\${largeOpers[i]}^{}_y{}`;
				makeFunc(str, str.slice(0,-7) + '_y')
			}
			for (var i = 0; i < largeOpers.length; i++) {
				var str = `\\${largeOpers[i]}^x_yz`;
				makeFunc(str)
			}
		})
		describe("Проверка обработки радикалов", function () {
			it("\\sqrt{\\frac{a}{b}}", function () {
				Para.Root.Add_Text('\\sqrt{\\frac{a}{b}}', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), '\\sqrt{\\frac{a}{b}}');
			});
			it("\\sqrt[]{\\frac{a}{b}}", function () {
				Para.Root.Add_Text("\\sqrt[]{\\frac{a}{b}}", Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), "\\sqrt{\\frac{a}{b}}");
			});
			it("\\sqrt[n]{1+x+x^2+x^3+\\dots+x^n}", function () {
				Para.Root.Add_Text('\\sqrt[n]{1+x+x^2+x^3+\\dots+x^n}', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), '\\sqrt[n]{1+x+x^2+x^3+\\dots+x^n}');
			});
			it("\\sqrt{\\frac{a}{b}}", function () {
				Para.Root.Add_Text('\\sqrt{\\frac{a}{b}}', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), '\\sqrt{\\frac{a}{b}}');
			});
		})
		describe("Проверка обработки скобок", function () {
			it("\\left(\\frac{x^2}{y^3}\\right)", function () {
				Para.Root.Add_Text('\\left(\\frac{x^2}{y^3}\\right)', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), '(\\frac{x^2}{y^3})');
			});
			it("P\\left(A=2\\middle|\\frac{A^2}{B}>4\\right)", function () {
				Para.Root.Add_Text('P\\left(A=2\\middle|\\frac{A^2}{B}>4\\right)', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), 'P(A=2\\frac{A^2}{B}>4)');
			});
		})
		describe("Проверка обработки индексов/степеней", function () {
			describe("Создание индексов/степеней без контента", function () {
				it("Создание стандартного деления: 2_{}", function () {
					Para.Root.Add_Text('2_{}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '2_{}');
				});
				it("Создание стандартного деления: x_{}", function () {
					Para.Root.Add_Text('x_{}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), 'x_{}');
				});
				it("Создание стандартного деления: y_{}^{}", function () {
					Para.Root.Add_Text('y_{}^{}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), 'y_{}^{}');
				});
				// it("Создание стандартного деления: _{2}y", function () {
				// 	Para.Root.Add_Text('_{2}y', Para.Paragraph)
				// 	Para.ConvertFromLaTeX();
				// 	assert.equal(Para.Root.GetTextOfElement(true), '_{2}y');
				// });
				// it("Создание стандартного деления: ^{2}y", function () {
				// 	Para.Root.Add_Text('_{2}y', Para.Paragraph)
				// 	Para.ConvertFromLaTeX();
				// 	assert.equal(Para.Root.GetTextOfElement(true), '_{2}y');
				// });
				it("Создание стандартного деления: ^{2}_{x}y", function () {
					Para.Root.Add_Text('_{2}y', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '_{2}y');
				});

				it("Создание стандартного деления: ^2_xy", function () {
					Para.Root.Add_Text('^2_xy', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '{_x^2}y');
				});


			})

			describe("Наполнение индексов/степеней", function () {
				it("Создание стандартного деления: 2_{x}", function () {
					Para.Root.Add_Text('2_{x}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '2_x');
				});
				it("Создание стандартного деления: 2^{x}", function () {
					Para.Root.Add_Text('2^{x}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '2^x');
				});
				it("Создание стандартного деления: 2^{y}_{x}", function () {
					Para.Root.Add_Text('2^{y}_{x}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '2_x^y');
				});
				it("Создание стандартного деления: x^2x^2x^2x^2x^2", function () {
					Para.Root.Add_Text('x^2x^2x^2x^2x^2', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), 'x^2x^2x^2x^2x^2');
				});
				it("Создание стандартного деления: x_2x_2x_2x_2x_2", function () {
					Para.Root.Add_Text('x_2x_2x_2x_2x_2', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), 'x_2x_2x_2x_2x_2');
				});
				it("Создание стандартного деления: x^2^2^2^2^2^2^2", function () {
					Para.Root.Add_Text('x^2^2^2^2^2^2^2', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), 'x^2^2^2^2^2^2^2');
				});
				it("Создание стандартного деления: x_2_2_2_2_2_2_2", function () {
					Para.Root.Add_Text('x_2_2_2_2_2_2_2', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), 'x_2_2_2_2_2_2_2');
				});
				it("Создание стандартного деления: k_{n+1} = n^2 + k_n^2 - k_{n-1}", function () {
					Para.Root.Add_Text('k_{n+1} = n^2 + k_n^2 - k_{n-1}', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), 'k_{n+1} = n^2 + k_n^2 - k_{n-1}');
				});
			})
		})
	})

	describe("Проверка работы Unicode конвертора", function () {
		describe("Раное", function () {
			it("Вставка пробелов", function () {
				Para.Root.Add_Text(' ', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), ' ');
			});
			it("Вставка текста", function () {
				Para.Root.Add_Text('1509670348503847508мотваомрывдаомыдвомщоаыврищзывр', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), '1509670348503847508мотваомрывдаомыдвомщоаыврищзывр');
			});

			it("\\alpha, \\Alpha, \\beta, \\Beta, \\gamma, \\Gamma, \\pi, \\Pi, \\phi, \\varphi, \\mu, \\Phi", function () {
				Para.Root.Add_Text('\\alpha, \\Alpha, \\beta, \\Beta, \\gamma, \\Gamma, \\pi, \\Pi, \\phi, \\varphi, \\mu, \\Phi', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), 'α, Α, β, Β, γ, Γ, π, Π, φ, ϕ, μ, Φ');
			});
			
			it("f(n) = n^5 + 4n^2 + 2 |_(n=17)", function () {
				Para.Root.Add_Text('f(n) = n^5 + (4n+2)^2 + 2 |_(n=17)', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), 'f(n) = n^5 + (4n+2)^2 + 2 |_(n=17)');
			});
			it("n^5 + 4n^2", function () {
				Para.Root.Add_Text('n^5 + 4n^2', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), 'n^5 + 4n^2');
			});
			it("2 |_{n=17}", function () {
				Para.Root.Add_Text('2 |_{n=17}', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), '2 |_(n=17)');
			});
		})
		describe("Проверка обработки деления", function () {
			describe("Создание функций без контента", function () {
				it("Создание стандартного деления: ()/()", function () {
					Para.Root.Add_Text('()/()', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), '/');
				});
				it("Проверка типа стандартного деления Pr.type: {}/{}", function () {
					Para.Root.Add_Text('{}/{}', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					var e = Para.Root.Content[1].Pr.type;
					assert.equal(e, 0);
				});
				it("Скошеное деление: {}∕{}", function () {
					Para.Root.Add_Text('{}∕{}', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), '∕');
				});
				it("Проверка типа cкошеного деления Pr.type: {}∕{}", function () {
					Para.Root.Add_Text('{}∕{}', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					var e = Para.Root.Content[1].Pr.type;
					assert.equal(e, 1);
				});
				it("Строчное деление: {}⊘{}", function () {
					Para.Root.Add_Text('{}⊘{}', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), '⊘');
				});
				it("Проверка типа строчного деления Pr.type: {}⊘{}", function () {
					Para.Root.Add_Text('{}⊘{}', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					var e = Para.Root.Content[1].Pr.type;
					assert.equal(e, 2);
				});
			})
			describe("Наполнение функций", function () {
				it("Наполнение стандартного деления: (1+2)/(2+x^2)", function () {
					Para.Root.Add_Text('(1+2)/(2+x^2)', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), '(1+2)/(2+x^2)');
				});
				it("Скошеное деление: (1_i+2)∕(2+x^2)", function () {
					Para.Root.Add_Text('(1_i+2)∕(2+x^2)', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), '(1_i+2)∕(2+x^2)');
				});
				it("Строчное деление: (1_i+2)⊘(2+x^2)", function () {
					Para.Root.Add_Text('(1_i+2)⊘(2+x^2)', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), '(1_i+2)⊘(2+x^2)');
				});
				it("Наполнение стандартного деления: x/y", function () {
					Para.Root.Add_Text('x/y', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), 'x/y');
				});
				it("Скошеное деление: x∕y", function () {
					Para.Root.Add_Text('x∕y', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), 'x∕y');
				});
				it("Строчное деление: x⊘y", function () {
					Para.Root.Add_Text('x⊘y', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), 'x⊘y');
				})
				it("Наполнение стандартного деления: x/y+1", function () {
					Para.Root.Add_Text('x/y+1', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), 'x/y+1');
				});
				it("Скошеное деление: x∕y+1", function () {
					Para.Root.Add_Text('x∕y+1', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), 'x∕y+1');
				});
				it("Строчное деление: x⊘y+1", function () {
					Para.Root.Add_Text('x⊘y+1', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), 'x⊘y+1');
				});
			})
			describe("Рекурсия функций", function () {
				it("Деление с большой вложенностью", function () {
					Para.Root.Add_Text('1/(1/(1/(1/(1/2))))', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), '1/(1/(1/(1/(1/2))))');
				});

			})
			it("{n!}/{k!(n-k)!} = {n}¦{k}", function () {
				Para.Root.Add_Text('{n!}/{k!(n-k)!} = {n}¦{k}', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), '(n!)/(k!(n-k)!) = (n/k)');
			});
			it("{{1}/{x}+{1}/{y}}/{y-z}", function () {
				Para.Root.Add_Text('{{1}/{x}+{1}/{y}}/{y-z}', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), '(1/x+1/y)/(y-z)');
			});
		})
		describe("Проверка обработки функций", function () {
			it("cos(2\\theta) = cos^2 \\theta - sin^2 \\theta", function () {
				Para.Root.Add_Text('cos(2\\theta) = cos^2 \\theta - sin^2 \\theta', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), 'cos〖(2θ)〗 = cos^2 θ - sin^2 θ');
			});
			it("sin(2\\theta) = sin^2 \\theta", function () {
				Para.Root.Add_Text('sin(2\\theta) = sin^2 \\theta', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), 'sin〖(2θ)〗 = sin^2 θ');
			});
			it("lim┬{2\\theta}\\theta", function () {
				Para.Root.Add_Text('lim_{2\\theta}\\theta', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), 'lim┬(2θ)θ');
			});
			it("lim┴{2\\theta}\\theta", function () {
				Para.Root.Add_Text('lim_{2\\theta}\\theta', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), 'lim┬(2θ)θ');
			});
			it("lim┬{x \\to \\infty}exp(-x)=0", function () {
				Para.Root.Add_Text('lim\\limits┬{x\\to\\infty}〖exp(-x)〗=0', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), 'lim_{x\\to\\infty}〖exp(-x)〗=0');
			});
		})
		describe("Проверка обработки больших операторов", function () {
			describe("Без контента:", function () {
				describe("Создание больших операторов без контента", function () {
					it("\\int", function () {
						Para.Root.Add_Text('\\int', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∫');
					});
					it("\\oint", function () {
						Para.Root.Add_Text('\\oint', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∮');
					});
					it("\\iint", function () {
						Para.Root.Add_Text('\\iint', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∬');
					});
					it("\\oiin", function () {
						Para.Root.Add_Text('\\oiint', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∯');
					});
					it("\\iiint", function () {
						Para.Root.Add_Text('\\iiint', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∭');
					});
					it("\\oiiint", function () {
						Para.Root.Add_Text('\\oiiint', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∰');
					});
					it("\\iiiint", function () {
						Para.Root.Add_Text('\\iiiint', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨌');
					});
					it("\\sum", function () {
						Para.Root.Add_Text('\\sum', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∑');
					});
					it("\\bigoplus", function () {
						Para.Root.Add_Text('\\bigoplus', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨁');
					});
					it("\\biguplus", function () {
						Para.Root.Add_Text('\\biguplus', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨄');
					});
					it("\\bigcap", function () {
						Para.Root.Add_Text('\\bigcap', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋂');
					});
					it("\\bigcup", function () {
						Para.Root.Add_Text('\\bigcup', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋃');
					});
					it("\\bigotimes", function () {
						Para.Root.Add_Text('\\bigotimes', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨂');
					});
					it("\\bigsqcup", function () {
						Para.Root.Add_Text('\\bigsqcup', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨆');
					});
					it("\\bigodot", function () {
						Para.Root.Add_Text('\\bigodot', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨀');
					});
					it("\\prod", function () {
						Para.Root.Add_Text('\\prod', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∏');
					});
					it("\\coprod", function () {
						Para.Root.Add_Text('\\coprod', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∐');
					});
					it("\\bigvee", function () {
						Para.Root.Add_Text('\\bigvee', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋁');
					});
					it("\\bigwedge", function () {
						Para.Root.Add_Text('\\bigwedge', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋀');
					});
				})
				describe("Создание больших операторов без контента", function () {
					it("\\int^()_()▒()", function () {
						Para.Root.Add_Text('\\int^()_()▒()', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∫');
					});
					it("\\oint^()_()▒()", function () {
						Para.Root.Add_Text('\\oint^()_()', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∮');
					});
					it("\\iint^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\iint^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∬');
					});
					it("\\oiint^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\oiint^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∯');
					});
					it("\\iiint^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\iiint^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∭');
					});
					it("\\oiiint^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\oiiint^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∰');
					});
					it("\\iiiint^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\iiiint^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨌');
					});
					it("\\sum^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\sum^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∑');
					});
					it("\\bigoplus^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\bigoplus^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨁');
					});
					it("\\biguplus^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\biguplus^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨄');
					});
					it("\\bigcap^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\bigcap^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋂');
					});
					it("\\bigcup^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\bigcup^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋃');
					});
					it("\\bigotimes^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\bigotimes^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨂');
					});
					it("\\bigsqcup^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\bigsqcup^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨆');
					});
					it("\\bigodot^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\bigodot^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨀');
					});
					it("\\prod^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\prod^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∏');
					});
					it("\\coprod^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\coprod^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∐');
					});
					it("\\bigvee^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\bigvee^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋁');
					});
					it("\\bigwedge^{}_{}▒{}", function () {
						Para.Root.Add_Text('\\bigwedge^{}_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋀');
					});
				})
				describe("Создание больших операторов без контента", function () {
					it("\\int_()▒()", function () {
						Para.Root.Add_Text('\\int_()▒()', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∫');
					});
					it("\\oint_()▒()", function () {
						Para.Root.Add_Text('\\oint_()', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∮');
					});
					it("\\iint_{}▒{}", function () {
						Para.Root.Add_Text('\\iint_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∬');
					});
					it("\\oiint_{}▒{}", function () {
						Para.Root.Add_Text('\\oiint_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∯');
					});
					it("\\iiint_{}▒{}", function () {
						Para.Root.Add_Text('\\iiint_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∭');
					});
					it("\\oiiint_{}▒{}", function () {
						Para.Root.Add_Text('\\oiiint_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∰');
					});
					it("\\iiiint_{}▒{}", function () {
						Para.Root.Add_Text('\\iiiint_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨌');
					});
					it("\\sum_{}▒{}", function () {
						Para.Root.Add_Text('\\sum_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∑');
					});
					it("\\bigoplus_{}▒{}", function () {
						Para.Root.Add_Text('\\bigoplus_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨁');
					});
					it("\\biguplus_{}▒{}", function () {
						Para.Root.Add_Text('\\biguplus_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨄');
					});
					it("\\bigcap_{}▒{}", function () {
						Para.Root.Add_Text('\\bigcap_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋂');
					});
					it("\\bigcup_{}▒{}", function () {
						Para.Root.Add_Text('\\bigcup_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋃');
					});
					it("\\bigotimes_{}▒{}", function () {
						Para.Root.Add_Text('\\bigotimes_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨂');
					});
					it("\\bigsqcup_{}▒{}", function () {
						Para.Root.Add_Text('\\bigsqcup_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨆');
					});
					it("\\bigodot_{}▒{}", function () {
						Para.Root.Add_Text('\\bigodot_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨀');
					});
					it("\\prod_{}▒{}", function () {
						Para.Root.Add_Text('\\prod_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∏');
					});
					it("\\coprod_{}▒{}", function () {
						Para.Root.Add_Text('\\coprod_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∐');
					});
					it("\\bigvee_{}▒{}", function () {
						Para.Root.Add_Text('\\bigvee_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋁');
					});
					it("\\bigwedge_{}▒{}", function () {
						Para.Root.Add_Text('\\bigwedge_{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋀');
					});
				})
				describe("Создание больших операторов без контента", function () {
					it("\\int^()▒()", function () {
						Para.Root.Add_Text('\\int^()▒()', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∫');
					});
					it("\\oint^()▒()", function () {
						Para.Root.Add_Text('\\oint^()', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∮');
					});
					it("\\iint^{}▒{}", function () {
						Para.Root.Add_Text('\\iint^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∬');
					});
					it("\\oiint^{}▒{}", function () {
						Para.Root.Add_Text('\\oiint^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∯');
					});
					it("\\iiint^{}▒{}", function () {
						Para.Root.Add_Text('\\iiint^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∭');
					});
					it("\\oiiint^{}▒{}", function () {
						Para.Root.Add_Text('\\oiiint^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∰');
					});
					it("\\iiiint^{}▒{}", function () {
						Para.Root.Add_Text('\\iiiint^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨌');
					});
					it("\\sum^{}▒{}", function () {
						Para.Root.Add_Text('\\sum^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∑');
					});
					it("\\bigoplus^{}▒{}", function () {
						Para.Root.Add_Text('\\bigoplus^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨁');
					});
					it("\\biguplus^{}▒{}", function () {
						Para.Root.Add_Text('\\biguplus^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨄');
					});
					it("\\bigcap^{}▒{}", function () {
						Para.Root.Add_Text('\\bigcap^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋂');
					});
					it("\\bigcup^{}▒{}", function () {
						Para.Root.Add_Text('\\bigcup^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋃');
					});
					it("\\bigotimes^{}▒{}", function () {
						Para.Root.Add_Text('\\bigotimes^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨂');
					});
					it("\\bigsqcup^{}▒{}", function () {
						Para.Root.Add_Text('\\bigsqcup^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨆');
					});
					it("\\bigodot^{}▒{}", function () {
						Para.Root.Add_Text('\\bigodot^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨀');
					});
					it("\\prod^{}▒{}", function () {
						Para.Root.Add_Text('\\prod^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∏');
					});
					it("\\coprod^{}▒{}", function () {
						Para.Root.Add_Text('\\coprod^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∐');
					});
					it("\\bigvee^{}▒{}", function () {
						Para.Root.Add_Text('\\bigvee^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋁');
					});
					it("\\bigwedge^{}▒{}", function () {
						Para.Root.Add_Text('\\bigwedge^{}▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋀');
					});
				})
				describe("Создание больших операторов без контента", function () {
					it("\\int▒()", function () {
						Para.Root.Add_Text('\\int▒()', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∫');
					});
					it("\\oint▒()", function () {
						Para.Root.Add_Text('\\oint▒()', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∮');
					});
					it("\\iint▒{}", function () {
						Para.Root.Add_Text('\\iint▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∬');
					});
					it("\\oiin▒{}", function () {
						Para.Root.Add_Text('\\oiint▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∯');
					});
					it("\\iiint▒{}", function () {
						Para.Root.Add_Text('\\iiint▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∭');
					});
					it("\\oiiint▒{}", function () {
						Para.Root.Add_Text('\\oiiint▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∰');
					});
					it("\\iiiint▒{}", function () {
						Para.Root.Add_Text('\\iiiint▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨌');
					});
					it("\\sum▒{}", function () {
						Para.Root.Add_Text('\\sum▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∑');
					});
					it("\\bigoplus▒{}", function () {
						Para.Root.Add_Text('\\bigoplus▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨁');
					});
					it("\\biguplus▒{}", function () {
						Para.Root.Add_Text('\\biguplus▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨄');
					});
					it("\\bigcap▒{}", function () {
						Para.Root.Add_Text('\\bigcap▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋂');
					});
					it("\\bigcup▒{}", function () {
						Para.Root.Add_Text('\\bigcup▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋃');
					});
					it("\\bigotimes▒{}", function () {
						Para.Root.Add_Text('\\bigotimes▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨂');
					});
					it("\\bigsqcup▒{}", function () {
						Para.Root.Add_Text('\\bigsqcup▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨆');
					});
					it("\\bigodot▒{}", function () {
						Para.Root.Add_Text('\\bigodot▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨀');
					});
					it("\\prod▒{}", function () {
						Para.Root.Add_Text('\\prod▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∏');
					});
					it("\\coprod▒{}", function () {
						Para.Root.Add_Text('\\coprod▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∐');
					});
					it("\\bigvee▒{}", function () {
						Para.Root.Add_Text('\\bigvee▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋁');
					});
					it("\\bigwedge▒{}", function () {
						Para.Root.Add_Text('\\bigwedge▒{}', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋀');
					});
				})
				describe("Создание больших операторов без контента с контентом после", function () {
					it("\\int^()_()▒() + 2", function () {
						Para.Root.Add_Text('\\int^()_()▒() + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∫ + 2');
					});
					it("\\oint^()_()▒() + 2", function () {
						Para.Root.Add_Text('\\oint^()_()▒() + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∮ + 2');
					});
					it("\\iint^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\iint^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∬ + 2');
					});
					it("\\oiint^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\oiint^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∯ + 2');
					});
					it("\\iiint^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\iiint^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∭ + 2');
					});
					it("\\oiiint^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\oiiint^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∰ + 2');
					});
					it("\\iiiint^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\iiiint^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨌ + 2');
					});
					it("\\sum^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\sum^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∑ + 2');
					});
					it("\\bigoplus^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\bigoplus^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨁ + 2');
					});
					it("\\biguplus^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\biguplus^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨄ + 2');
					});
					it("\\bigcap^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\bigcap^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋂ + 2');
					});
					it("\\bigcup^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\bigcup^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋃ + 2');
					});
					it("\\bigotimes^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\bigotimes^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨂ + 2');
					});
					it("\\bigsqcup^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\bigsqcup^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨆ + 2');
					});
					it("\\bigodot^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\bigodot^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨀ + 2');
					});
					it("\\prod^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\prod^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∏ + 2');
					});
					it("\\coprod^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\coprod^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∐ + 2');
					});
					it("\\bigvee^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\bigvee^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋁ + 2');
					});
					it("\\bigwedge^{}_{}▒{} + 2", function () {
						Para.Root.Add_Text('\\bigwedge^{}_{}▒{} + 2', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋀ + 2');
					});
				})
			})
			describe("С контентом:", function () {
				describe("Большой оператор без индексов/степеней тело идет сразу", function () {
					it("\\intX", function () {
						Para.Root.Add_Text('\\intX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∫▒X');
					});
					it("\\ointX", function () {
						Para.Root.Add_Text('\\ointX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∮▒X');
					});
					it("\\iintX", function () {
						Para.Root.Add_Text('\\iintX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∬▒X');
					});
					it("\\oiinX", function () {
						Para.Root.Add_Text('\\oiintX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∯▒X');
					});
					it("\\iiintX", function () {
						Para.Root.Add_Text('\\iiintX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∭▒X');
					});
					it("\\oiiintX", function () {
						Para.Root.Add_Text('\\oiiintX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∰▒X');
					});
					it("\\iiiintX", function () {
						Para.Root.Add_Text('\\iiiintX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨌▒X');
					});
					it("\\sumX", function () {
						Para.Root.Add_Text('\\sumX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∑▒X');
					});
					it("\\bigoplusX", function () {
						Para.Root.Add_Text('\\bigoplusX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨁▒X');
					});
					it("\\biguplusX", function () {
						Para.Root.Add_Text('\\biguplusX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨄▒X');
					});
					it("\\bigcapX", function () {
						Para.Root.Add_Text('\\bigcapX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋂▒X');
					});
					it("\\bigcupX", function () {
						Para.Root.Add_Text('\\bigcupX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋃▒X');
					});
					it("\\bigotimesX", function () {
						Para.Root.Add_Text('\\bigotimesX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨂▒X');
					});
					it("\\bigsqcupX", function () {
						Para.Root.Add_Text('\\bigsqcupX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨆▒X');
					});
					it("\\bigodotX", function () {
						Para.Root.Add_Text('\\bigodotX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨀▒X');
					});
					it("\\prodX", function () {
						Para.Root.Add_Text('\\prodX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∏▒X');
					});
					it("\\coprodX", function () {
						Para.Root.Add_Text('\\coprodX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∐▒X');
					});
					it("\\bigveeX", function () {
						Para.Root.Add_Text('\\bigveeX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋁▒X');
					});
					it("\\bigwedgeX", function () {
						Para.Root.Add_Text('\\bigwedgeX', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋀▒X');
					});
				})
				describe("Большой оператор с степенями/идексами с телом (степени сложные)", function () {
					it("\\int^(x)_(y)▒z", function () {
						Para.Root.Add_Text('\\int^(x)_(y)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∫^x_y▒z');
					});
					it("\\oint^(x)_(y)▒z", function () {
						Para.Root.Add_Text('\\oint^(x)_(y)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∮^x_y▒z');
					});
					it("\\iint^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\iint^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∬^x_y▒z');
					});
					it("\\oiint^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\oiint^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∯^x_y▒z');
					});
					it("\\iiint^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\iiint^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∭^x_y▒z');
					});
					it("\\oiiint^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\oiiint^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∰^x_y▒z');
					});
					it("\\iiiint^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\\iiiint^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨌^x_y▒z');
					});
					it("\\sum^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\sum^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∑^x_y▒z');
					});
					it("\\bigoplus^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\bigoplus^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨁^x_y▒z');
					});
					it("\\biguplus^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\biguplus^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨄^x_y▒z');
					});
					it("\\bigcap^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\bigcap^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋂^x_y▒z');
					});
					it("\\bigcup^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\bigcup^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋃^x_y▒z');
					});
					it("\\bigotimes^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\bigotimes^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨂^x_y▒z');
					});
					it("\\bigsqcup^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\bigsqcup^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨆^x_y▒z');
					});
					it("\\bigodot^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\bigodot^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨀^x_y▒z');
					});
					it("\\prod^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\prod^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∏^x_y▒z');
					});
					it("\\coprod^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\coprod^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∐^x_y▒z');
					});
					it("\\bigvee^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\bigvee^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋁^x_y▒z');
					});
					it("\\bigwedge^{x}_{y}▒z", function () {
						Para.Root.Add_Text('\\bigwedge^{x}_{y}▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋀^x_y▒z');
					});
				})
				describe("Большой оператор с степенями/идексами с телом (степени и тело сложные)", function () {
					it("\\int^(x)_(y)▒(z+1)", function () {
						Para.Root.Add_Text('\\int^(x)_(y)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∫^x_y▒〖z+1〗');
					});
					it("\\oint^(x)_(y)▒(z+1)", function () {
						Para.Root.Add_Text('\\oint^(x)_(y)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∮^x_y▒〖z+1〗');
					});
					it("\\iint^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\iint^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∬^x_y▒〖z+1〗');
					});
					it("\\oiint^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\oiint^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∯^x_y▒〖z+1〗');
					});
					it("\\iiint^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\iiint^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∭^x_y▒〖z+1〗');
					});
					it("\\oiiint^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\oiiint^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∰^x_y▒〖z+1〗');
					});
					it("\\iiiint^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\\iiiint^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨌^x_y▒〖z+1〗');
					});
					it("\\sum^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\sum^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∑^x_y▒〖z+1〗');
					});
					it("\\bigoplus^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\bigoplus^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨁^x_y▒〖z+1〗');
					});
					it("\\biguplus^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\biguplus^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨄^x_y▒〖z+1〗');
					});
					it("\\bigcap^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\bigcap^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋂^x_y▒〖z+1〗');
					});
					it("\\bigcup^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\bigcup^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋃^x_y▒〖z+1〗');
					});
					it("\\bigotimes^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\bigotimes^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨂^x_y▒〖z+1〗');
					});
					it("\\bigsqcup^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\bigsqcup^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨆^x_y▒〖z+1〗');
					});
					it("\\bigodot^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\bigodot^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨀^x_y▒〖z+1〗');
					});
					it("\\prod^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\prod^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∏^x_y▒〖z+1〗');
					});
					it("\\coprod^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\coprod^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∐^x_y▒〖z+1〗');
					});
					it("\\bigvee^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\bigvee^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋁^x_y▒〖z+1〗');
					});
					it("\\bigwedge^{x}_{y}▒(z+1)", function () {
						Para.Root.Add_Text('\\bigwedge^{x}_{y}▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋀^x_y▒〖z+1〗');
					});
				})
				describe("Большой оператор с степенями/идексами с телом (все одинарное)", function () {
					it("\\int^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\int^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∫^(x+1)_(y+1)▒z');
					});
					it("\\oint^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\oint^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∮^(x+1)_(y+1)▒z');
					});
					it("\\iint^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\iint^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∬^(x+1)_(y+1)▒z');
					});
					it("\\oiint^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\oiint^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∯^(x+1)_(y+1)▒z');
					});
					it("\\iiint^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\iiint^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∭^(x+1)_(y+1)▒z');
					});
					it("\\oiiint^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\oiiint^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∰^(x+1)_(y+1)▒z');
					});
					it("\\iiiint^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\\iiiint^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨌^(x+1)_(y+1)▒z');
					});
					it("\\sum^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\sum^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∑^(x+1)_(y+1)▒z');
					});
					it("\\bigoplus^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\bigoplus^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨁^(x+1)_(y+1)▒z');
					});
					it("\\biguplus^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\biguplus^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨄^(x+1)_(y+1)▒z');
					});
					it("\\bigcap^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\bigcap^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋂^(x+1)_(y+1)▒z');
					});
					it("\\bigcup^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\bigcup^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋃^(x+1)_(y+1)▒z');
					});
					it("\\bigotimes^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\bigotimes^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨂^(x+1)_(y+1)▒z');
					});
					it("\\bigsqcup^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\bigsqcup^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨆^(x+1)_(y+1)▒z');
					});
					it("\\bigodot^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\bigodot^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨀^(x+1)_(y+1)▒z');
					});
					it("\\prod^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\prod^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∏^(x+1)_(y+1)▒z');
					});
					it("\\coprod^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\coprod^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∐^(x+1)_(y+1)▒z');
					});
					it("\\bigvee^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\bigvee^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋁^(x+1)_(y+1)▒z');
					});
					it("\\bigwedge^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\bigwedge^(x+1)_(y+1)▒z', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋀^(x+1)_(y+1)▒z');
					});
				})
				describe("Большой оператор с степенями/идексами с телом (все одинарное)", function () {
					it("\\int^(x+1)_(y+1)▒z", function () {
						Para.Root.Add_Text('\\int^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∫^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\oint^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\oint^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∮^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\iint^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\iint^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∬^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\oiint^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\oiint^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∯^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\iiint^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\iiint^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∭^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\oiiint^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\oiiint^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∰^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\iiiint^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\\iiiint^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨌^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\sum^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\sum^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∑^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\bigoplus^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\bigoplus^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨁^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\biguplus^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\biguplus^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨄^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\bigcap^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\bigcap^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋂^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\bigcup^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\bigcup^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋃^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\bigotimes^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\bigotimes^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨂^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\bigsqcup^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\bigsqcup^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨆^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\bigodot^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\bigodot^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨀^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\prod^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\prod^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∏^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\coprod^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\coprod^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∐^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\bigvee^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\bigvee^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋁^(x+1)_(y+1)▒〖z+1〗');
					});
					it("\\bigwedge^(x+1)_(y+1)▒(z+1)", function () {
						Para.Root.Add_Text('\\bigwedge^(x+1)_(y+1)▒(z+1)', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋀^(x+1)_(y+1)▒〖z+1〗');
					});
				})
				describe("Большой оператор с степенями/идексами с телом (все одинарное)", function () {
					it("\\int^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\int^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∫^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\oint^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\oint^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∮^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\iint^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\iint^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∬^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\oiint^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\oiint^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∯^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\iiint^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\iiint^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∭^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\oiiint^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\oiiint^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∰^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\iiiint^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\\iiiint^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨌^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\sum^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\sum^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∑^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\bigoplus^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\bigoplus^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨁^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\biguplus^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\biguplus^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨄^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\bigcap^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\bigcap^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋂^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\bigcup^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\bigcup^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋃^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\bigotimes^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\bigotimes^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨂^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\bigsqcup^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\bigsqcup^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨆^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\bigodot^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\bigodot^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⨀^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\prod^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\prod^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∏^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\coprod^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\coprod^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '∐^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\bigvee^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\bigvee^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋁^(x+1)_(y+1)▒〖z+1〗-y');
					});
					it("\\bigwedge^(x+1)_(y+1)▒(z+1)-y", function () {
						Para.Root.Add_Text('\\bigwedge^(x+1)_(y+1)▒(z+1)-y', Para.Paragraph)
						Para.ConvertFromUnicodeMath()
						assert.equal(Para.Root.GetTextOfElement(), '⋀^(x+1)_(y+1)▒〖z+1〗-y');
					});
				})
			})
		})
		describe("Проверка обработки радикалов", function () {
			it("Создание пустого радикала: √", function () {
				Para.Root.Add_Text('√', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), '√');
			});
			it("Создание радикала с НЕ блочным контентом: √a", function () {
				Para.Root.Add_Text('√a', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), '√a');
			});
			it("Создание радикала с НЕ блочным контентом и данными после: √a+1", function () {
				Para.Root.Add_Text('√a+1', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), '√a+1');
			});
			it("Создание радикала с блочным конетнтом: √{a/b}", function () {
				Para.Root.Add_Text('√{a/b}', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), '√(a/b)');
			});
			it("Создание радикала с блочным конетнтом и пустым индексом: √{&a/b}", function () {
				Para.Root.Add_Text("√{&a/b}", Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), "√(a/b)");
			});
			it("Создание радикала с блочным конетнтом и индексом: √{n&1+x+x^2+x^3+\\dots+x^n}", function () {
				Para.Root.Add_Text('√{n&1+x+x^2+x^3+\\dots+x^n}', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), '√(n&1+x+x^2+x^3+…+x^n)');
			});
			it("\\sqrt{{a}/{b}}", function () {
				Para.Root.Add_Text('\\sqrt{{a}/{b}}', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), '√(a/b)');
			});
		})
		describe("Проверка обработки скобок", function () {
			
			function makeBrackets(Start, End, content, after) {
				if (!after) {after = ''}
				let str =  Start + content + End + after;
				it(str, function() {
					
					Para.Root.Add_Text(str, Para.Paragraph);
					Para.ConvertFromUnicodeMath();
					assert.equal(Para.Root.GetTextOfElement(),str);
				});
			}
			
			let StartBracets = ['{','(','[', '|']
			let CloseBracets = [')','}',']', '|']
			for (let i = 0; i < StartBracets.length; i++) {
				for (let j = 0; j < CloseBracets.length; j++) {
					makeBrackets(StartBracets[i], CloseBracets[j], '2+1')
					makeBrackets(StartBracets[i], CloseBracets[j], '2+1', '+z')
					makeBrackets(StartBracets[i], CloseBracets[j], '', '+z')
					makeBrackets(StartBracets[i], CloseBracets[j], '')
				}
			}
			for (let i = 0; i < StartBracets.length; i++) {
				for (let j = 0; j < CloseBracets.length; j++) {
					makeBrackets('\\open'+StartBracets[i], '\\close'+CloseBracets[j], '2+1')
				}
			}

			it("├]a+b┤[", function () {
				Para.Root.Add_Text('├]a+b┤[', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), '├]a+b┤[');
			});
			it("\\open{x^2\\close)", function () {
				Para.Root.Add_Text('\\open{x^2\\close)', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), '{x^2)');
			});
			it("\\open x^2\\close)", function () {
				Para.Root.Add_Text('\\open.x^2\\close)', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), '├ x^2┤)');
			});
			it("((x^2)/(y^3))", function () {
				Para.Root.Add_Text('(x^2)/(y^3)', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), '(x^2)/(y^3)');
			});
			it("P(A=2│{A^2}/{B}>4)", function () {
				Para.Root.Add_Text('P(A=2│{A^2}/{B}>4)', Para.Paragraph)
				Para.ConvertFromUnicodeMath()
				assert.equal(Para.Root.GetTextOfElement(), 'P(A=2│(A^2)/B>4)');
			});
		})
		describe("Проверка обработки индексов/степеней", function () {
			describe("Создание индексов/степеней без контента", function () {
				it("Создание стандартного деления: 2_()", function () {
					Para.Root.Add_Text('2_()', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), '2_()');
				});
				it("Создание стандартного деления: x_()", function () {
					Para.Root.Add_Text('x_()', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), 'x_()');
				});
				it("Создание стандартного деления: y_()^()", function () {
					Para.Root.Add_Text('y_()^()', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), 'y_()^()');
				});
				it("Создание стандартного деления: (^2_x)y", function () {
					Para.Root.Add_Text('(^2_x)y', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), '(_x^2)y');
				});

				it("Создание стандартного деления: {_x^2}y", function () {
					Para.Root.Add_Text('{_x^2}y', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), '(_x^2)y');
				});


			})

			describe("Наполнение индексов/степеней", function () {
				
				it("Создание стандартного деления: 2^2^2^2", function () {
					Para.Root.Add_Text('2^2^2^2', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), '2^2^2^2');
				});

				it("Создание стандартного деления: 2_(x)", function () {
					Para.Root.Add_Text('2_{x}', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), '2_x');
				});
				it("Создание стандартного деления: 2^(x)", function () {
					Para.Root.Add_Text('2^{x}', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), '2^x');
				});
				it("Создание стандартного деления: 2^(y)_(x)", function () {
					Para.Root.Add_Text('2^{y}_{x}', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), '2_x^y');
				});
				it("Создание стандартного деления: x^2x^2x^2x^2x^2", function () {
					Para.Root.Add_Text('x^2x^2x^2x^2x^2', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), 'x^2x^2x^2x^2x^2');
				});
				it("Создание стандартного деления: x_2x_2x_2x_2x_2", function () {
					Para.Root.Add_Text('x_2x_2x_2x_2x_2', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), 'x_2x_2x_2x_2x_2');
				});
				it("Создание стандартного деления: x^2^2^2^2^2^2^2", function () {
					Para.Root.Add_Text('x^2^2^2^2^2^2^2', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), 'x^2^2^2^2^2^2^2');
				});
				it("Создание стандартного деления: x_2_2_2_2_2_2_2", function () {
					Para.Root.Add_Text('x_2_2_2_2_2_2_2', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), 'x_2_2_2_2_2_2_2');
				});
				it("Создание стандартного деления: k_(n+1) = n^2 + k_n^2 - k_(n-1)", function () {
					Para.Root.Add_Text('k_(n+1) = n^2 + k_n^2 - k_(n-1)', Para.Paragraph)
					Para.ConvertFromUnicodeMath()
					assert.equal(Para.Root.GetTextOfElement(), 'k_(n+1) = n^2 + k_n^2 - k_(n-1)');
				});
			})
		})
	})


	it("Вставка новой строки", function () {
		Para.Root.Add_Text('45343 \\\\ 656454', Para.Paragraph)
		Para.ConvertFromLaTeX()
		assert.equal(Para.Root.GetTextOfElement(true), ' ');
	});
	it("Вставка новой строки", function () {
		Para.Root.Add_Text('45343 \\\\ 656454 \\\\445', Para.Paragraph)
		Para.ConvertFromLaTeX()
		assert.equal(Para.Root.GetTextOfElement(true), ' ');
	});
	
});
