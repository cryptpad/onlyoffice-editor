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
			it("\\sum^{10}_{i=1}{t_i+2}", function () {
				Para.Root.Add_Text('\\sum^{10}_{i=1}{t_i+2}', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), '\\sum^{10}_{i=1}{t_i+2}');
			});
			it("\\int_0^\\infty \\mathrm{e}^{-x},\\mathrm{d}x", function () {
				Para.Root.Add_Text('\\int_0^\\infty \\mathrm{e}^{-x},\\mathrm{d}x', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), '\\int_0^\\infty \\mathrm{e}^{-x},\\mathrm{d}x');
			});
		})
		describe("Проверка обработки радикалов", function () {
			it("\\sqrt{\\frac{a}{b}}", function () {
				Para.Root.Add_Text('\\sqrt{\\frac{a}{b}}', Para.Paragraph)
				Para.ConvertFromLaTeX();
				assert.equal(Para.Root.GetTextOfElement(true), '\\sqrt{\\frac{a}{b}}');
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
				assert.equal(Para.Root.GetTextOfElement(true), 'P\\left(A=2\\middle|\\frac{A^2}{B}>4\\right)');
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
				it("Создание стандартного деления: _{2}y", function () {
					Para.Root.Add_Text('_{2}y', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '_{2}y');
				});
				it("Создание стандартного деления: ^{2}y", function () {
					Para.Root.Add_Text('_{2}y', Para.Paragraph)
					Para.ConvertFromLaTeX();
					assert.equal(Para.Root.GetTextOfElement(true), '_{2}y');
				});
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
});
