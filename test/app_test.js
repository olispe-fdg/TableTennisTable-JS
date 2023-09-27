const app = require("../src/app");
const gameState = require("../src/league");
const leagueRenderer = require("../src/league_renderer");
const { when } = require("jest-when");

describe("app command processing", function () {
	test("prints the current state of the league", function () {
		const rendered = "rendered league";
		const league = gameState.createLeague();
		const renderLeague = jest.spyOn(leagueRenderer, "render");
		when(renderLeague).calledWith(league).mockReturnValue(rendered);

		const game = app.startGame(league);
		const response = game.sendCommand("print");

		expect(response).toBe(rendered);
	});
});
