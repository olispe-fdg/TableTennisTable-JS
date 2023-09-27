/** @type {import("jest").Config} */
const config = {
	testMatch: [
		"<rootDir>/test/league_test.js",
		"<rootDir>/test/league_renderer_test.js",
		"<rootDir>/test/app_test.js",
	],
	setupFilesAfterEnv: ["jest-extended/all"],
};

module.exports = config;
