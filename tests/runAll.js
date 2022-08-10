const path = require("path");

const allTests = [
	'../cell/.unit-tests/FormulaTests.html',
	'../cell/.unit-tests/subdir/PivotTests.html',
	'../cell/.unit-tests/CopyPasteTests.html',
	'word/unit-tests/paragraphContentPos.html',
	'word/document-calculation/paragraph.html',
	'word/forms/forms.html',
	'word/forms/complexForm.html'
];

const {performance} = require('perf_hooks');

const {
  runQunitPuppeteer,
  printResultSummary,
  printFailedTests
} = require("node-qunit-puppeteer");

async function Run()
{
	let startTime = performance.now();
	let count  = 0;
	let failed = [];
	for (let nIndex = 0, nCount = allTests.length; nIndex < nCount; ++nIndex)
	{
		await runQunitPuppeteer({targetUrl : path.join(__dirname, allTests[nIndex])})
			.then(result =>
			{
				count++;
				printResultSummary(result, console);

				if (result.stats.failed > 0)
				{
					printFailedTests(result, console);
					failed.push(allTests[nIndex]);
				}
			})
			.catch(ex =>
			{
				console.error(ex);
			});
	}

	console.log("\nOverall Elapsed " + (Math.round(( ((performance.now() - startTime) / 1000) + Number.EPSILON) * 1000) / 1000) + "s");
	console.log("\n"+ (count - failed.length) + "/" + count + " modules successfully passed the tests");

	if (failed.length)
	{
		console.log("\nFAILED".red.bold);
		for (let nIndex = 0, nCount = failed.length; nIndex < nCount; ++nIndex)
		{
			console.log(failed[nIndex]);
		}
	}
	else
	{
		console.log("\nPASSED".green.bold);
	}
}

Run();

