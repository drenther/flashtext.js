const KeywordProcessor = require('../src/index');

test('extract keywords test', () => {
	const processor = new KeywordProcessor();

	processor.addKeyword('Big Apple', 'New York');
	processor.addKeyword('Bay Area');

	const keywordsFound = processor.extractKeywords(
		'I love Big Apple and Bay Area.'
	);
	const expected = ['New York', 'Bay Area'];

	expect(keywordsFound).toEqual(expected);
});

test('replace keywords test', () => {
	const processor = new KeywordProcessor();

	processor.addKeyword('Big Apple', 'New York');
	processor.addKeyword('New Delhi', 'NCR Region');

	const newSentence = processor.replaceKeywords(
		'I love Big Apple and new delhi.'
	);
	const expected = 'I love New York and NCR Region.';

	expect(newSentence).toEqual(expected);
});

test('case sensitive example test', () => {
	const processor = new KeywordProcessor(true);

	processor.addKeyword('Big Apple', 'New York');
	processor.addKeyword('Bay Area');

	const keywordsFound = processor.extractKeywords(
		'I love big Apple and Bay Area.'
	);
	const expected = ['Bay Area'];

	expect(keywordsFound).toEqual(expected);
});

test('add multiple keywords using Object test', () => {
	const processor = new KeywordProcessor();

	processor.addKeywordsFromObject({
		java: ['java_2e', 'java programming'],
		python: ['python2.7', 'python programming'],
	});

	const keywordsFound = processor.extractKeywords(
		'I love java_2e and python programming.'
	);
	expect(keywordsFound).toEqual(['java', 'python']);

	const newSentence = processor.replaceKeywords(
		'I prefer python over java programming.'
	);
	expect(newSentence).toEqual('I prefer python over java.');
});

test('add multiple keywords using Array test', () => {
	const processor = new KeywordProcessor();

	processor.addKeywordsFromArray(['java', 'product manager']);

	const keywordsFound = processor.extractKeywords(
		'I am a product manager for a java platform'
	);
	expect(keywordsFound).toEqual(['product manager', 'java']);
});

test('remove keywords test', () => {
	const processor = new KeywordProcessor();

	processor.addKeywordsFromArray(['react', 'angular', 'vue', 'javascript']);
	processor.removeKeywordsFromArray(['angular', 'vue']);
	processor.removeKeyword('javascript');

	const keywordsFound = processor.extractKeywords(
		'I know React, Angular and Vue. I love JavaScript.'
	);

	expect(keywordsFound).toEqual(['react']);
});

test('add characters as part of word characters', () => {
	const processor = new KeywordProcessor();

	processor.addKeyword('Big Apple');

	const before = processor.extractKeywords('I love Big Apple/Bay Area.');
	expect(before).toEqual(['Big Apple']);

	processor.addNonWordBoundaries('/');
	const after = processor.extractKeywords('I love Big Apple/Bay Area.');
	expect(after).toEqual([]);
});
