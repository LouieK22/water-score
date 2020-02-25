module.exports = {
	env: {
		es6: true,
		node: true,
		browser: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/eslint-recommended"],
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly",
	},
	parser: "vue-eslint-parser",
	parserOptions: {
		parser: "@typescript-eslint/parser",
		ecmaVersion: 2018,
		sourceType: "module",
		tsconfigRootDir: ".",
	},
	plugins: ["@typescript-eslint"],
	rules: {
		indent: ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"no-var": ["error"],
		"prefer-const": ["error"],
		"no-unused-vars": ["off"],
		eqeqeq: ["error"],
		"@typescript-eslint/member-ordering": ["warn"],
	},
};
