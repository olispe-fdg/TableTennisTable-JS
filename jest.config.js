/** @type {import("jest").Config} */
const config = {
	testMatch: ["<rootDir>/test/**/*_test.js", "<rootDir>/features/support/steps.js"],
	setupFilesAfterEnv: ["jest-extended/all"],
};

module.exports = config;
