const KeywordProcessor = require('../build/index');

describe('basic functionalities', () => {
	test('extract keywords test', () => {
		const processor = new KeywordProcessor();

		processor.addKeyword('Big Apple', 'New York');
		processor.addKeyword('Bay Area');

		const keywordsFound = processor.extractKeywords('I love Big Apple and Bay Area.');
		const expected = ['New York', 'Bay Area'];

		expect(keywordsFound).toEqual(expected);
	});

	test('replace keywords test', () => {
		const processor = new KeywordProcessor();

		processor.addKeyword('Big Apple', 'New York');
		processor.addKeyword('New Delhi', 'NCR Region');

		const newSentence = processor.replaceKeywords('I love Big Apple and new delhi.');
		const expected = 'I love New York and NCR Region.';

		expect(newSentence).toEqual(expected);
	});

	test('case sensitive example test', () => {
		const processor = new KeywordProcessor(true);

		processor.addKeyword('Big Apple', 'New York');
		processor.addKeyword('Bay Area');

		const keywordsFound = processor.extractKeywords('I love big Apple and Bay Area.');
		const expected = ['Bay Area'];

		expect(keywordsFound).toEqual(expected);
	});

	test('add multiple keywords using Object test', () => {
		const processor = new KeywordProcessor();

		processor.addKeywordsFromObject({
			java: ['java_2e', 'java programming'],
			python: ['python2.7', 'python programming'],
		});

		const keywordsFound = processor.extractKeywords('I love java_2e and python programming.');
		expect(keywordsFound).toEqual(['java', 'python']);

		const newSentence = processor.replaceKeywords('I prefer python over java programming.');
		expect(newSentence).toEqual('I prefer python over java.');
	});

	test('add multiple keywords using Array test', () => {
		const processor = new KeywordProcessor();

		processor.addKeywordsFromArray(['java', 'product manager']);

		const keywordsFound = processor.extractKeywords('I am a product manager for a java platform');
		expect(keywordsFound).toEqual(['product manager', 'java']);
	});

	test('remove keywords test', () => {
		const processor = new KeywordProcessor();

		processor.addKeywordsFromArray(['react', 'angular', 'vue', 'javascript']);
		processor.removeKeywordsFromArray(['angular', 'vue']);
		processor.removeKeyword('javascript');

		const keywordsFound = processor.extractKeywords('I know React, Angular and Vue. I love JavaScript.');

		expect(keywordsFound).toEqual(['react']);
	});

	test('remove keywords from object test', () => {
		const processor = new KeywordProcessor();

		processor.addKeywordsFromObject({
			java: ['java_2e', 'java programming'],
			python: ['python2.7', 'python programming'],
		});

		let keywordsFound = processor.extractKeywords('I love java_2e and python programming.');
		expect(keywordsFound).toEqual(['java', 'python']);

		processor.removeKeywordsFromObject({ java: ['java_2e', 'java programming'] });

		keywordsFound = processor.extractKeywords('I love java_2e and python programming.');
		expect(keywordsFound).toEqual(['python']);

		const sentence = 'I prefer python over java programming.';
		const newSentence = processor.replaceKeywords(sentence);
		expect(newSentence).toEqual(sentence);
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

	test('set non word boundaries', () => {
		const processor = new KeywordProcessor();
		const arrayOfKeywords = ['java-script', 'javascript', 'Javascript'];
		processor.addKeywordsFromObject({
			JavaScript: arrayOfKeywords,
		});

		const result = 'I love JavaScript';
		arrayOfKeywords.forEach(keyword => {
			const sentence = `I love ${keyword}`;
			expect(processor.replaceKeywords(sentence)).toEqual(result);
		});

		processor.setNonWordBoundaries([' ']);
		const sentence = 'I love java-script';
		expect(processor.extractKeywords(sentence)).toEqual([]);
		expect(processor.replaceKeywords(sentence)).toEqual(sentence);
	});
});

describe('common use cases', () => {
	test('shorter search string then keywords', () => {
		const processorCaseInsensitive = new KeywordProcessor();
		const processorCaseSensitive = new KeywordProcessor(true);

		const before = 'I work at Google';
		const after = 'I work at Alphabet';

		processorCaseInsensitive.addKeyword('Google', 'Alphabet');
		expect(processorCaseInsensitive.replaceKeywords(before)).toEqual(after);

		const sentence = 'I work google';

		processorCaseSensitive.addKeyword('Google', 'Alphabet');
		expect(processorCaseSensitive.replaceKeywords(before)).toEqual(after);
		expect(processorCaseSensitive.replaceKeywords(sentence)).toEqual(sentence);
	});
});

describe('reported edge cases', () => {
	test('recreating a bug related to sentence ending with a half matching keyword', () => {
		const processor = new KeywordProcessor();

		processor.addKeyword('Appl1', 'app_1');
		processor.addKeyword('Appl2', 'app_2');
		expect(processor.replaceKeywords('appl1')).toEqual('app_1');
		expect(processor.replaceKeywords('appl2')).toEqual('app_2');
		expect(processor.replaceKeywords('app')).toEqual('app');

		const sentence = 'I am using an App';
		const after = processor.replaceKeywords(sentence);

		expect(after).toEqual(sentence);
	});
});
