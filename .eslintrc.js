module.exports = {
	env: {
		es6: true,
		node: true,
		'jest/globals': true,
	},
	plugins: ['jest', 'prettier'],
	extends: ['eslint:recommended', 'plugin:jest/recommended', 'prettier'],
	parserOptions: {
		sourceType: 'module',
	},
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
	},
};
