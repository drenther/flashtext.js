# Flashtext.js

[![Build Status](https://travis-ci.org/drenther/flashtext.js.svg?branch=master)](https://travis-ci.org/drenther/flashtext.js) [![Coverage Status](https://coveralls.io/repos/github/drenther/flashtext.js/badge.svg?branch=master)](https://coveralls.io/github/drenther/flashtext.js?branch=master)

### JavaScript (ES6+ source and zero dependencies) port of the amazing Python package [flashtext](https://github.com/vi3k6i5/flashtext)

This module can be used to replace keywords in sentences or extract keywords from sentences.

#### Note - This is a quick experimental port. Please post [issues](https://github.com/drenther/flashtext.js/issues) for anything that doesn't work or can be improved

## Installation

```javascript
	$ npm install flashtext.js --save
```

#### or

```javascript
	$ yarn add flashtext.js
```

## Usage

### Extract Keywords

```javascript
const processor = new KeywordProcessor();

processor.addKeyword('Big Apple', 'New York');
processor.addKeyword('Bay Area');

const keywordsFound = processor.extractKeywords(
	'I love Big Apple and Bay Area.'
);
console.log(keywordsFound);
// output - ['New York', 'Bay Area']
```

### Replace Keywords

```javascript
const processor = new KeywordProcessor();

processor.addKeyword('Big Apple', 'New York');
processor.addKeyword('New Delhi', 'NCR Region');

const newSentence = processor.replaceKeywords(
	'I love Big Apple and new delhi.'
);
console.log(newSentence);
// output - 'I love New York and NCR Region.'
```

### Case Sensitive Example

```javascript
const processor = new KeywordProcessor(true);

processor.addKeyword('Big Apple', 'New York');
processor.addKeyword('Bay Area');

const keywordsFound = processor.extractKeywords(
	'I love big Apple and Bay Area.'
);
console.log(keywordsFound);
// output - ['Bay Area']
```

### Multiple Keywords Entry using Object

```javascript
const processor = new KeywordProcessor();

processor.addKeywordsFromObject({
	java: ['java_2e', 'java programming'],
	python: ['python2.7', 'python programming'],
});

const keywordsFound = processor.extractKeywords(
	'I love java_2e and python programming.'
);
console.log(keywordsFound);
// output - ['java', 'python']

const newSentence = processor.replaceKeywords(
	'I prefer python over java programming.'
);
console.log(newSentence);
// output - 'I prefer python over java.'
```

### Multiple Keywords Entry using Arrays

```javascript
const processor = new KeywordProcessor();

processor.addKeywordsFromArray(['java', 'product manager']);

const keywordsFound = processor.extractKeywords(
	'I am a product manager for a java platform'
);

console.log(keywordsFound);
// output - ['product manager', 'java']
```

### Remove Keywords (One/Multiple)

```javascript
const processor = new KeywordProcessor();

processor.addKeywordsFromArray(['react', 'angular', 'vue', 'javascript']);
processor.removeKeywordsFromArray(['angular', 'vue']);
processor.removeKeyword('javascript');

const keywordsFound = processor.extractKeywords(
	'I know React, Angular and Vue. I love JavaScript.'
);
console.log(keywordsFound);
// output - ['react'];
```

### Add characters as a part of word

```javascript
const processor = new KeywordProcessor();

processor.addKeyword('Big Apple');

const before = processor.extractKeywords('I love Big Apple/Bay Area.');
console.log(before);
// output - ['Big Apple']

processor.addNonWordBoundaries('/');
const after = processor.extractKeywords('I love Big Apple/Bay Area.');
console.log(after);
// output - []
```

## References

The original paper published on [FlashText algorithm](https://arxiv.org/abs/1711.00046)

The article published on [Medium freeCodeCamp](https://medium.freecodecamp.org/regex-was-taking-5-days-flashtext-does-it-in-15-minutes-55f04411025f)

## License

This code is under MIT license.
