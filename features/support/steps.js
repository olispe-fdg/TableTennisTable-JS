const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const { expect } = require("expect");
const sinon = require("sinon");
const fs = require("fs");

Before(function () {
	this.sandbox = sinon.createSandbox();
	this.stubReadFileSync = this.sandbox.stub(fs, "readFileSync").throws("File not found");
	this.stubWriteFileSync = this.sandbox.stub(fs, "writeFileSync");
});

After(function () {
	this.sandbox.restore();
});

Given("the league has no players", function () {
	// Nothing to do because a new league always has no players
});

Given("the league has the player {string}", function (playerName) {
	this.game.sendCommand(`add player ${playerName}`);
});

Given("the file {string} contains {string}", function (path, contents) {
	this.stubReadFileSync.withArgs(path, sinon.match.string).returns(contents);
});

When("I print the league", function () {
	this.response = this.game.sendCommand("print");
});

When("I add the player {string}", function (playerName) {
	this.game.sendCommand(`add player ${playerName}`);
});

When("I record {string} winning against {string}", function (winner, loser) {
	this.game.sendCommand(`record win ${winner} ${loser}`);
});

When("I save to the file {string}", function (path) {
	this.game.sendCommand(`save ${path}`);
});

When("I load the file {string}", function (path) {
	this.game.sendCommand(`load ${path}`);
});

Then("I should see that there are no players", function () {
	expect(this.response).toBe("No players yet");
});

Then("I should see the player {string}", function (playerName) {
	expect(this.game.sendCommand("print")).toContain(playerName);
});

Then("the game's winner should be {string}", function (playerName) {
	expect(this.game.sendCommand("winner")).toBe(playerName);
});

Then("the league is written to {string}", function (path) {
	sinon.assert.calledWith(this.stubWriteFileSync, path, JSON.stringify(this.league.getPlayers()), { flag: "w" });
});
