/*
	A JavaScript (Node) fork of the Python Package @ https://github.com/vi3k6i5/flashtext
	Tried to keep the API as close as possible
*/
module.exports = class KeywordProcessor {
	/*
		Attrbs - 
			_keyword (String): Used as key to store keywords in trie dictionary.
				Defaults to '_keyword_'
			nonWordBoundaries (Set([String])): Characters that will determine if the word is continuing.
				Defaults to set([A-Za-z0-9_])
			keywordTrieDict (Map): trie dict built character by character, that is used for lookup.
				Defaults to empty Map
			caseSensitive (Boolean): if the search algorithm should be case sensitive or not.
				Defaults to False
	*/
	constructor(caseSensitive = false) {
		/*
			Args - 
				caseSensitive (Boolean): if the search algorithm should be case sensitive or not.
					Defaults to False
		*/
		this._keyword = '_keyword_';

		this.nonWordBoundaries = (() => {
			const getChars = (start, end, ascii) => {
				const temp = [];
				for (let i = start; i <= end; i++) {
					temp.push(ascii ? String.fromCharCode(i) : i);
				}
				return temp;
			};
			return new Set([...getChars(0, 9), ...getChars(65, 90, true), ...getChars(97, 122, true), '_']);
		})();

		this.keywordTrieDict = new Map();
		this.caseSensitive = caseSensitive;
		this.termsInTrie = 0;
	}

	size() {
		/*
			Returns:
				size (Number): Count of number of distince terms in trie dictionary
		*/
		return self.termsInTrie;
	}

	contains(word) {
		/*
			Args - 
				word (String): word that you want to check
			Returns -
				status (Boolean): true if word is present in keywordTrieDict otherwise false
		*/
		let chars;
		if (!this.caseSensitive) {
			chars = [...word.toLowerCase()];
		} else {
			chars = [...word];
		}

		let currentDict = this.keywordTrieDict;
		let lengthCovered = 0;
		
		chars.forEach(char => {
			if (currentDict.has(char)) {
				currentDict = currentDict.get(char);
				lenCovered++;
			} else {
				break;
			}
		})

		return currentDict.has(this._keyword) && len_covered === word.length;
	}

	setNonWordBoundaries(charsArray) {
		/*
			Args - 
				charsArray (Array(Strings)): array of characters that will be considered as part of word.
		*/
		this.nonWordBoundaries = new Set(charsArray);
	}

	addNonWordBoundaries(char) {
		/*
			Args - 
				char (String): add a character that will be considered as part of word.
			Returns:
				status (Boolean): True for success, False otherwise.
		*/
		if (char.length === 1) {
			this.nonWordBoundaries.add(char);
			return true;
		}
		return false;
	}

	addKeyword(keyword, cleanName) {
		/*
			Args -
				keyword (String): keyword that you want to identify
				cleanName (String): clean term for that keyword that you would want to get back in return or replace
					if not provided, keyword will be used as the clean name also
		*/
		if (!cleanName) {
			cleanName = keyword;
		}

		if (keyword && cleanName) {
			if (!this.caseSensitive) keyword = keyword.toLowerCase();
			let currentDictRef = this.keywordTrieDict;
			keyword.split('').forEach(char => {
				if (!currentDictRef.get(char)) currentDictRef.set(char, new Map());
				currentDictRef = currentDictRef.get(char);
			});
			currentDictRef.set(this._keyword, cleanName);
		}
	}

	removeKeyword(keyword) {
		/*
			Args -
				keyword (String): keyword that you want to remove if it's present.
			Returns - 
				status (Boolean): True for success, False otherwise.
		*/
		let status = false;
		if (keyword) {
			if (!this.caseSensitive) keyword = keyword.toLowerCase();
			let currentDictRef = this.keywordTrieDict;
			const characterTrieList = [];
			keyword.split('').forEach(char => {
				if (currentDictRef.has(char)) {
					characterTrieList.push([char, currentDictRef]);
					currentDictRef = currentDictRef.get(char);
				}
			});
			if (currentDictRef.has(this._keyword)) {
				characterTrieList.push([this._keyword, currentDictRef]);
				characterTrieList.reverse();
				for (let [keyToRemove, dictRef] of characterTrieList) {
					dictRef.delete(keyToRemove);
					if (dictRef.size !== 1) break;
				}
				status = true;
			}
		}
		return status;
	}

	addKeywordsFromObject(obj) {
		/*
			Used for bulk entry of keywords
			also supports multiple keywords for a single cleanName
			Args - 
				obj (Object): a JSON structure resembling something like this 
					{
						"first-clean-name": ["keyword-one", "keyword-two"],
						"second-clean-name": ["just-one-this-time"]
					}
		*/
		for (let [cleanName, keywords] of Object.entries(obj)) {
			if (typeof cleanName !== 'string' || keywords.constructor !== Array) {
				throw 'Please structure the Object as suggested for using addKeywordsFromObject';
			}
			keywords.forEach(keyword => {
				if (typeof keyword !== 'string') {
					throw 'Keywords must be of String type';
				}
				this.addKeyword(keyword, cleanName);
			});
		}
	}

	removeKeywordsFromObject(obj) {
		/*
			Used for bulk entry of keywords
			also supports multiple keywords for a single cleanName
			Args - 
				obj (Object): a JSON structure resembling something like this 
					{
						"first-clean-name": ["keyword-one", "keyword-two"],
						"second-clean-name": ["just-one-this-time"]
					}
		*/
		for (let [cleanName, keywords] of Object.entries(obj)) {
			if (typeof cleanName !== 'string' || keywords.constructor !== Array) {
				throw 'Please structure the Object as suggested for using removeKeywordsFromObject';
			}
			keywords.forEach(keyword => {
				if (typeof keyword !== 'string') {
					throw 'Keywords must be of String type';
				}
				this.removeKeyword(keyword);
			});
		}
	}

	addKeywordsFromArray(keywords) {
		/*
			Args - 
				keywords (Array(String)): Array of keywords to add
		*/
		if (keywords.constructor !== Array) {
			throw 'Please structure the Object as suggested for using removeKeywordsFromObject';
		}
		keywords.forEach(keyword => {
			if (typeof keyword !== 'string') {
				throw 'Keywords must be of String type';
			}
			this.addKeyword(keyword);
		});
	}

	removeKeywordsFromArray(keywords) {
		/*
			Args - 
				keywords (Array(String)): Array of keywords to remove
		*/
		if (keywords.constructor !== Array) {
			throw 'Please structure the Object as suggested for using removeKeywordsFromObject';
		}
		keywords.forEach(keyword => {
			if (typeof keyword !== 'string') {
				throw 'Keywords must be of String type';
			}
			this.removeKeyword(keyword);
		});
	}

	extractKeywords(sentence) {
		/*
			Args -
				sentence (String): Line of text where we will search for keywords
			Returns -
				keywordsExtracted (Array(String)): Array of terms/keywords found in the sentence that match our corpus
		*/
		const keywordsExtracted = [];
		const sentenceLength = sentence.length;

		if (typeof sentence !== 'string' && sentenceLength === 0) return keywordsExtracted;

		if (!this.caseSensitive) sentence = sentence.toLowerCase();

		let currentDictRef = this.keywordTrieDict;
		let sequenceEndPos = 0;
		let idx = 0;

		while (idx < sentenceLength) {
			let char = sentence[idx];

			let sequenceFound, longestSequenceFound, isLongerSequenceFound, idy;

			if (!this.nonWordBoundaries.has(char)) {
				if (currentDictRef.has(this._keyword) || currentDictRef.has(char)) {
					sequenceFound = '';
					longestSequenceFound = '';
					isLongerSequenceFound = false;

					if (currentDictRef.has(this._keyword)) {
						sequenceFound = currentDictRef.get(this._keyword);
						longestSequenceFound = currentDictRef.get(this._keyword);
						sequenceEndPos = idx;
					}

					if (currentDictRef.has(char)) {
						let currentDictContinued = currentDictRef.get(char);
						idy = idx + 1;

						while (idy < sentenceLength) {
							let innerChar = sentence[idy];

							if (!this.nonWordBoundaries.has(innerChar) && currentDictContinued.has(this._keyword)) {
								longestSequenceFound = currentDictContinued.get(this._keyword);
								sequenceEndPos = idy;
								isLongerSequenceFound = true;
							}

							if (currentDictContinued.has(innerChar)) {
								currentDictContinued = currentDictContinued.get(innerChar);
							} else {
								break;
							}
							++idy;
						}

						if (idy >= sentenceLength && currentDictContinued.has(this._keyword)) {
							longestSequenceFound = currentDictContinued.get(this._keyword);
							sequenceEndPos = idy;
							isLongerSequenceFound = true;
						}

						if (isLongerSequenceFound) {
							idx = sequenceEndPos;
						}
					}

					currentDictRef = this.keywordTrieDict;
					if (longestSequenceFound) {
						keywordsExtracted.push(longestSequenceFound);
					}
				} else {
					currentDictRef = this.keywordTrieDict;
				}
			} else if (currentDictRef.has(char)) {
				currentDictRef = currentDictRef.get(char);
			} else {
				currentDictRef = this.keywordTrieDict;
				idy = idx + 1;

				while (idy < sentenceLength) {
					char = sentence[idy];
					if (!this.nonWordBoundaries.has(char)) break;
					++idy;
				}

				idx = idy;
			}

			if (idx + 1 >= sentenceLength) {
				if (currentDictRef.has(this._keyword)) {
					sequenceFound = currentDictRef.get(this._keyword);
					keywordsExtracted.push(sequenceFound);
				}
			}

			++idx;
		}
		return keywordsExtracted;
	}

	replaceKeywords(sentence) {
		/*
			Args - 
				sentence (String): Line of text where we will search for keywords
			Returns -
				keywordsExtracted (String): Line of text with keywords replaced with their respective cleanNames
		*/
		const sentenceLength = sentence.length;

		if (typeof sentence !== 'string' && sentenceLength === 0) return sentence;
		const orgSentence = sentence;

		if (!this.caseSensitive) sentence = sentence.toLowerCase();
		let newSentence = '';

		let currentWord = '';
		let currentDictRef = this.keywordTrieDict;
		let currentWhiteSpace = '';
		let sequenceEndPos = 0;
		let idx = 0;

		while (idx < sentenceLength) {
			let char = sentence[idx];
			currentWord += orgSentence[idx];

			let sequenceFound, longestSequenceFound, isLongerSequenceFound, idy;

			if (!this.nonWordBoundaries.has(char)) {
				currentWhiteSpace = char;

				if (currentDictRef.has(this._keyword) || currentDictRef.has(char)) {
					sequenceFound = '';
					longestSequenceFound = '';
					isLongerSequenceFound = false;

					if (currentDictRef.has(this._keyword)) {
						sequenceFound = currentDictRef.get(this._keyword);
						longestSequenceFound = currentDictRef.get(this._keyword);
						sequenceEndPos = idx;
					}

					if (currentDictRef.has(char)) {
						let currentDictContinued = currentDictRef.get(char);
						let currentWordContinued = currentWord;
						idy = idx + 1;

						while (idy < sentenceLength) {
							let innerChar = sentence[idy];
							currentWordContinued += orgSentence[idy];

							if (!this.nonWordBoundaries.has(innerChar) && currentDictContinued.has(this._keyword)) {
								currentWhiteSpace = innerChar;
								longestSequenceFound = currentDictContinued.get(this._keyword);
								sequenceEndPos = idy;
								isLongerSequenceFound = true;
							}

							if (currentDictContinued.has(innerChar)) {
								currentDictContinued = currentDictContinued.get(innerChar);
							} else {
								break;
							}

							++idy;
						}

						if (idy >= sentenceLength && currentDictContinued.has(this._keyword)) {
							currentWhiteSpace = '';
							longestSequenceFound = currentDictContinued.get(this._keyword);
							sequenceEndPos = idy;
							isLongerSequenceFound = true;
						}

						if (isLongerSequenceFound) {
							idx = sequenceEndPos;
							currentWord = currentWordContinued;
						}
					}
					currentDictRef = this.keywordTrieDict;

					if (longestSequenceFound) {
						newSentence += longestSequenceFound + currentWhiteSpace;
						currentWord = '';
						currentWhiteSpace = '';
					} else {
						newSentence += currentWord;
						currentWord = '';
						currentWhiteSpace = '';
					}
				} else {
					currentDictRef = this.keywordTrieDict;
					newSentence += currentWord;
					currentWord = '';
					currentWhiteSpace = '';
				}
			} else if (currentDictRef.has(char)) {
				currentDictRef = currentDictRef.get(char);
			} else {
				currentDictRef = this.keywordTrieDict;
				idy = idx + 1;

				while (idy < sentenceLength) {
					char = sentence[idy];
					currentWord += orgSentence[idy];

					if (!this.nonWordBoundaries.has(char)) break;

					++idy;
				}
				idx = idy;
				newSentence += currentWord;
				currentWord = '';
				currentWhiteSpace = '';
			}

			if (idx + 1 >= sentenceLength) {
				if (currentDictRef.has(this._keyword)) {
					sequenceFound = currentDictRef.get(this._keyword);
					newSentence += sequenceFound;
				} else {
					newSentence += currentWord;
				}
			}

			++idx;
		}

		return newSentence;
	}
};
