module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],
	rules: {
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/ban-types': [
			'error',
			{
				types: {
					'{}': false,
				},
			},
		],
	},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	root: true,
	ignorePatterns: ['next.config.js', '__tests__/**/*', '.eslintrc.cjs'],
}
