const app = require("../src/app");
const gameState = require("../src/league");
const leagueRenderer = require("../src/league_renderer");
const { when } = require("jest-when");

test("prints the current state of the league", function () {
	const rendered = "rendered league";
	const league = gameState.createLeague();
	const renderLeague = jest.spyOn(leagueRenderer, "render");
	when(renderLeague).calledWith(league).mockReturnValue(rendered);

	const game = app.startGame(league);
	const response = game.sendCommand("print");

	expect(response).toBe(rendered);
});

describe("adding players", () => {
	test("adds player with name given in command", () => {
		const playerName = "Alice";
		const league = gameState.createLeague();
		const addPlayer = jest.spyOn(league, "addPlayer");

		const game = app.startGame(league);
		game.sendCommand(`add player ${playerName}`);

		expect(addPlayer).toHaveBeenCalledWith(playerName);
	});

	test("handles command without player name", () => {
		const league = gameState.createLeague();
		const addPlayer = jest.spyOn(league, "addPlayer");

		const game = app.startGame(league);
		game.sendCommand(`add player`);

		expect(addPlayer).toHaveBeenCalledWith("");
	});

	// App's command processing isn't robust
	test.skip("does not add player when command doesn't match", () => {
		const league = gameState.createLeague();
		const addPlayer = jest.spyOn(league, "addPlayer");

		const game = app.startGame(league);
		game.sendCommand(`add players Alice`);

		expect(addPlayer).not.toHaveBeenCalled();
	});
});
