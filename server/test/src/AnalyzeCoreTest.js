var assert = require('assert'),
	AnalyzeCore = require('../../lib/analyze/AnalyzeCore'),
	analyzeCore = new AnalyzeCore('../resources/database');


describe('AnalyzeCore', () => {
	beforeEach(() => {
		analyzeCore = new AnalyzeCore('../resources/database');		
	});
	
	describe('#generateFilterFunction', () => {
		it('passing empty filter param should be return a alway returned true function', () => {

			var func1 = analyzeCore._test.generateFilterFunction({});
			var func2 = analyzeCore._test.generateFilterFunction();
			
			assert.deepStrictEqual(func1(), true);
			assert.deepStrictEqual(func2(), true);

			assert.deepStrictEqual(func1("ignore me"), true);
			assert.deepStrictEqual(func2("ignore me"), true);
			
			assert.deepStrictEqual(func1([]), true);
			assert.deepStrictEqual(func2([]), true);

		});

		it('generate failed and throw a error', () => {
			var isThrow = false;
			try {
				var func = analyzeCore._test.generateFilterFunction({
					unknownColumn: []
				});
			} catch (e) {
				isThrow = e.stack.indexOf('unknownColumn') >= 0;
			}
			assert.deepStrictEqual(isThrow, true);
		});
		
		it('enable filter', () => {
			var row = '0 1485281235871 8435 json a.json %2Fpath%2Fto%2FProject ubuntu'.split(' ');
			
			var funcPassing1 = analyzeCore._test.generateFilterFunction({
				project: ['%2Fpath%2Fto%2FProject']
			});
			var funcPassing2 = analyzeCore._test.generateFilterFunction({
				language: ['javascript', 'json'],
				computer: ['ubuntu', 'windows10']
			});
			
			var funcFailure1 = analyzeCore._test.generateFilterFunction({
				project: ['%2Fpath%2Fto%2FProject'],
				file: ['b.json', 'c.json']
			});
			
			assert.deepStrictEqual(funcPassing1(row), true);
			assert.deepStrictEqual(funcPassing2(row), true);

			assert.deepStrictEqual(funcFailure1(row), false);

		});
		

 	 });
});