module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
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
		'@typescript-eslint/no-explicit-any': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
	},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	root: true,
	ignorePatterns: [
		'next.config.js',
		'__tests__/**/*',
		'.eslintrc.cjs',
		'src/api/generatedTypes.ts',
	],
}
