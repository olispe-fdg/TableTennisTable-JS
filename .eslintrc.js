module.exports = {
	env: {
		es6: true,
		mocha: true,
		node: true,
	},
	extends: ["eslint:recommended", "prettier"],
	parserOptions: {
		sourceType: "module",
	},
	rules: {
		"no-console": 0,
	},
};
