/*
 * (c) Copyright Ascensio System SIA 2010-2019
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

function literalTests(test) {
	test(
		`1`,
		{
			type: "UnicodeEquation",
			body: {
				NumberLiteral: "2",
			},
		},
		"Проверка простого литерала: 1"
	);

	test(
		`1+2`,
		{
			type: "UnicodeEquation",
			body: [
				{
					NumberLiteral: "1",
				},
				{
					Operator: "+",
				},
				{
					NumberLiteral: "2",
				},
			],
		},
		"Проверка простого литерала: 1+2"
	);

	test(
		`1+2+3`,
		{
			type: "UnicodeEquation",
			body: [
				{
					NumberLiteral: "1",
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
					NumberLiteral: "3",
				},
			],
		},
		"Проверка простого литерала: 1+2+3"
	);

	test(
		`a`,
		{
			type: "UnicodeEquation",
			body: {
				CharLiteral: "a",
			},
		},
		"Проверка простого литерала: a"
	);

	test(
		"abc123def",
		{
			type: "UnicodeEquation",
			body: [
				[
					{
						CharLiteral: "abc",
					},
					{
						NumberLiteral: "123",
					},
				],
				{
					CharLiteral: "def",
				},
			],
		},
		"Проверка простого литерала: abc123def"
	);

	test(
		"abc+123+def",
		{
			type: "UnicodeEquation",
			body: [
				{
					CharLiteral: "abc",
				},
				{
					Operator: "+",
				},
				{
					NumberLiteral: "123",
				},
				{
					Operator: "+",
				},
				{
					CharLiteral: "def",
				},
			],
		},
		"Проверка простого литерала: abc+123+def"
	);

	test(
		"𝐀𝐁𝐂𝐨𝐹",
		{
			type: "UnicodeEquation",
			body: {
				CharLiteral: "𝐀𝐁𝐂𝐨𝐹",
			},
		},
		"Проверка простого литерала: 𝐀𝐁𝐂𝐨𝐹"
	);

	//spaces
	test(
		"   𝐀𝐁𝐂𝐨𝐹   ",
		{
			type: "UnicodeEquation",
			body: [
				{
					type: "SpaceLiteral",
					value: " ",
				},
				{
					type: "SpaceLiteral",
					value: " ",
				},
				{
					type: "SpaceLiteral",
					value: " ",
				},
				{
					CharLiteral: "𝐀𝐁𝐂𝐨𝐹",
				},
				{
					type: "SpaceLiteral",
					value: " ",
				},
				{
					type: "SpaceLiteral",
					value: " ",
				},
				{
					type: "SpaceLiteral",
					value: " ",
				},
			],
		},
		"Проверка простого литерала - пробелы: '   𝐀𝐁𝐂𝐨𝐹   '"
	);

	//spaces & tabs
	test(
		" 	𝐀𝐁𝐂𝐨𝐹  	 ",
		{
			type: "UnicodeEquation",
			body: [
				{
					type: "SpaceLiteral",
					value: " ",
				},
				{
					type: "SpaceLiteral",
					value: "\t",
				},
				{
					CharLiteral: "𝐀𝐁𝐂𝐨𝐹",
				},
				{
					type: "SpaceLiteral",
					value: " ",
				},
				{
					type: "SpaceLiteral",
					value: " ",
				},
				{
					type: "SpaceLiteral",
					value: "\t",
				},
				{
					type: "SpaceLiteral",
					value: " ",
				},
			],
		},
		"Проверка простого литерала - пробелы и табуляция: ' 	𝐀𝐁𝐂𝐨𝐹  	 '"
	);

	test(
		`1+fbnd+(3+𝐀𝐁𝐂𝐨𝐹)+c+5`,
		{
			type: "UnicodeEquation",
			body: [
				{
					NumberLiteral: "1",
				},
				{
					Operator: "+",
				},
				{
					CharLiteral: "fbnd",
				},
				{
					Operator: "+",
				},
				{
					type: "expBracketLiteral",
					exp: [
						{
							NumberLiteral: "3",
						},
						{
							Operator: "+",
						},
						{
							CharLiteral: "𝐀𝐁𝐂𝐨𝐹",
						},
					],
					open: "(",
					close: ")",
				},
				{
					Operator: "+",
				},
				{
					CharLiteral: "c",
				},
				{
					Operator: "+",
				},
				{
					NumberLiteral: "5",
				},
			],
		},
		"Проверка простого литерала - пробелы и табуляция: '1+fbnd+(3+𝐀𝐁𝐂𝐨𝐹)+c+5'"
	);

	// test(
	// 	`1/3.1416`,
	// 	{
	// 		type: "UnicodeEquation",
	// 		body: {
	// 			type: "expLiteral",
	// 			value: [
	// 				{
	// 					type: "fractionLiteral",
	// 					numerator: {
	// 						type: "numeratorLiteral",
	// 						value: [
	// 							{
	// 								type: "digitsLiteral",
	// 								value: [
	// 									{
	// 										type: "NumericLiteral",
	// 										value: "1",
	// 									},
	// 								],
	// 							},
	// 						],
	// 					},
	// 					opOver: {
	// 						type: "opOver",
	// 						value: "/",
	// 					},
	// 					operand: [
	// 						{
	// 							type: "numberLiteral",
	// 							number: {
	// 								type: "digitsLiteral",
	// 								value: [
	// 									{
	// 										type: "NumericLiteral",
	// 										value: "3",
	// 									},
	// 								],
	// 							},
	// 							decimal: ".",
	// 							after: {
	// 								type: "digitsLiteral",
	// 								value: [
	// 									{
	// 										type: "NumericLiteral",
	// 										value: "1416",
	// 									},
	// 								],
	// 							},
	// 						},
	// 					],
	// 				},
	// 			],
	// 		},
	// 	},
	// 	"Проверка простого литерала - пробелы и табуляция: '1/3.1416'"
	// );
}
module.exports = {
	literalTests,
};
