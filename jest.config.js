/** @type {import("jest").Config} */
const config = {
	testMatch: ["<rootDir>/test/league_test.js"],
	setupFilesAfterEnv: ["jest-extended/all"],
};

module.exports = config;
