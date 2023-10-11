const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("expect");

Given("the league has no players", function () {
	// Nothing to do because a new league always has no players
});

When("I print the league", function () {
	this.response = this.game.sendCommand("print");
});

Then("I should see that there are no players", function () {
	expect(this.response).toBe("No players yet");
});

When("I add the player {string}", function (playerName) {
	this.game.sendCommand(`add player ${playerName}`);
});

Then("I should see the player {string}", function (playerName) {
	expect(this.game.sendCommand("print")).toContain(playerName);
});
