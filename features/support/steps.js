const { defineFeature, loadFeature } = require("jest-cucumber");
const app = require("../../src/app");
const gameState = require("../../src/league");

const feature = loadFeature("features/game.feature");

defineFeature(feature, (test) => {
	let game;
	let response;

	beforeEach(() => {
		game = app.startGame(gameState.createLeague());
	});

	test("empty league", ({ given, when, then }) => {
		given("the league has no players", () => {
			// Nothing to do because a new league always has no players
		});

		when("I print the league", () => {
			response = game.sendCommand("print");
		});

		then("I should see that there are no players", () => {
			expect(response).toBe("No players yet");
		});
	});
});
