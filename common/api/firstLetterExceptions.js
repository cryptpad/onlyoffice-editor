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

(function (window)
{
	const EXCEPTIONS = {};

	EXCEPTIONS[lcid_enUS] = {
		'a' : ["a", "abbr", "abs", "acct", "addn", "adj", "advt", "al", "alt", "amt", "anon", "approx", "appt", "apr", "apt", "assn", "assoc", "asst", "attn", "attrib", "aug", "aux", "ave", "avg"],
		'b' : ["b", "bal", "bldg", "blvd", "bot", "bro", "bros"],
		'c' : ["c", "ca", "calc", "cc", "cert", "certif", "cf", "cit", "cm", "co", "comp", "conf", "confed", "const", "cont", "contrib", "coop", "corp", "ct"],
		'd' : ["d", "dbl", "dec", "decl", "def", "defn", "dept", "deriv", "diag", "diff", "div", "dm", "dr", "dup", "dupl"],
		'e' : ["e", "encl", "eq", "eqn", "equip", "equiv", "esp", "esq", "est", "etc", "excl", "ext"],
		'f' : ["f", "feb", "ff", "fig", "freq", "fri", "ft", "fwd"],
		'g' : ["g", "gal", "gen", "gov", "govt"],
		'h' : ["h", "hdqrs", "hgt", "hist", "hosp", "hq", "hr", "hrs", "ht", "hwy"],
		'i' : ["i", "ib", "ibid", "illus", "in", "inc", "incl", "incr", "int", "intl", "irreg", "ital"],
		'j' : ["j", "jan", "jct", "jr", "jul", "jun"],
		'k' : ["k", "kg", "km", "kmh"],
		'l' : ["l", "lang", "lb", "lbs", "lg", "lit", "ln", "lt"],
		'm' : ["m", "mar", "masc", "max", "mfg", "mg", "mgmt", "mgr", "mgt", "mhz", "mi", "min", "misc", "mkt", "mktg", "ml", "mm", "mngr", "mon", "mph", "mr", "mrs", "msec", "msg", "mt", "mtg", "mtn", "mun"],
		'n' : ["n", "na", "name", "nat", "natl", "ne", "neg", "ng", "no", "norm", "nos", "nov", "num", "nw"],
		'o' : ["o", "obj", "occas", "oct", "op", "opt", "ord", "org", "orig", "oz"],
		'p' : ["p", "pa", "pg", "pkg", "pl", "pls", "pos", "pp", "ppt", "pred", "pref", "prepd", "prev", "priv", "prof", "proj", "pseud", "psi", "pt", "publ"],
		'q' : ["q", "qlty", "qt", "qty"],
		'r' : ["r", "rd", "re", "rec", "ref", "reg", "rel", "rep", "req", "reqd", "resp", "rev"],
		's' : ["s", "sat", "sci", "se", "sec", "sect", "sep", "sept", "seq", "sig", "soln", "soph", "spec", "specif", "sq", "sr", "st", "sta", "stat", "std", "subj", "subst", "sun", "supvr", "sw"],
		't' : ["t", "tbs", "tbsp", "tech", "tel", "temp", "thur", "thurs", "tkt", "tot", "transf", "transl", "tsp", "tues"],
		'u' : ["u", "univ", "util"],
		'v' : ["v", "var", "veg", "vert", "viz", "vol", "vs"],
		'w' : ["w", "wed", "wk", "wkly", "wt"],
		'x' : ["x"],
		'y' : ["y", "yd", "yr"],
		'z' : ["z"]
	};

	EXCEPTIONS[lcid_ruRU] = {
		'а' : ["а"],
		'б' : ["б"],
		'в' : ["вв"],
		'г' : ["гг", "гл"],
		'д' : ["д", "др"],
		'е' : ["е", "ед"],
		'ё' : ["ё"],
		'ж' : ["ж"],
		'з' : ["з"],
		'и' : ["и"],
		'й' : ["й"],
		'к' : ["к", "кв", "кл", "коп", "куб"],
		'л' : ["лл"],
		'м' : ["м", "мл", "млн", "млрд"],
		'н' : ["н", "наб", "нач"],
		'о' : ["о", "обл", "обр", "ок"],
		'п' : ["п", "пер", "пл", "пос", "пр"],
		'р' : ["руб"],
		'с' : ["сб", "св", "см", "соч", "ср", "ст", "стр"],
		'т' : ["тт", "тыс"],
		'у' : ["у"],
		'ф' : ["ф"],
		'х' : ["х"],
		'ц' : ["ц"],
		'ш' : ["ш", "шт"],
		'щ' : ["щ"],
		'ъ' : ["ъ"],
		'ы' : ["ы"],
		'ь' : ["ь"],
		'э' : ["э", "экз"],
		'ю' : ["ю"]
	};

	function CheckFirstLetterException(word, lang)
	{
		if (!word || !EXCEPTIONS[lang])
			return false;

		let exceptions = !EXCEPTIONS[lang];
	}

	//--------------------------------------------------------export----------------------------------------------------
	window['Asc']['FIRST_LETTER_EXCEPTIONS'] = window['Asc'].FIRST_LETTER_EXCEPTIONS = FIRST_LETTER_EXCEPTIONS;
	window['AscCommon']

})(window);
