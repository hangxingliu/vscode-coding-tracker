module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	rules: {
		"no-useless-escape": "off",
		"prefer-const": "warn",
		"@typescript-eslint/no-var-requires": "off"
	},
	env: {
		browser: true,
		node: true,
	},
};
