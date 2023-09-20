const gameState = require("../src/league");
const InvalidArgumentException = require("../src/invalid_argument_exception");

describe("addPlayer", function () {
	test.each(["not%valid", "  Alice   ", ""])(
		`throws validation error when player name is "%s"`,
		(invalidPlayerName) => {
			const league = gameState.createLeague();

			const addInvalidPlayer = () => league.addPlayer(invalidPlayerName);

			expect(addInvalidPlayer).toThrow(
				new InvalidArgumentException(`Player name ${invalidPlayerName} contains invalid characters`)
			);
		}
	);

	it("throws error when player name already exists", () => {
		const playerName = "Alice";
		const league = gameState.createLeague();
		league.addPlayer(playerName);

		const addDuplicatePlayer = () => league.addPlayer(playerName);

		expect(addDuplicatePlayer).toThrow(
			new InvalidArgumentException(`Cannot add player '${playerName}' because they are already in the game`)
		);
	});

	it("adds player to expected rows in order", () => {
		const expectedRows = [["First"], ["Second", "Third"], ["Fourth", "Fifth", "Sixth"], ["Seventh"]];
		const league = gameState.createLeague();

		expectedRows.flat().forEach((player) => league.addPlayer(player));

		expect(league.getPlayers()).toEqual(expectedRows);
	});
});

describe("recordWin", () => {
	test("throws error when winner is not in the league", () => {
		const winner = "Alice";
		const loser = "Bob";
		const league = gameState.createLeague();
		league.addPlayer(loser);

		const recordWin = () => league.recordWin(winner, loser);

		expect(recordWin).toThrow(new InvalidArgumentException(`Player '${winner}' is not in the game`));
	});

	test("throws error when loser is not in the league", () => {
		const winner = "Alice";
		const loser = "Bob";
		const league = gameState.createLeague();
		league.addPlayer(winner);

		const recordWin = () => league.recordWin(winner, loser);

		expect(recordWin).toThrow(new InvalidArgumentException(`Player '${loser}' is not in the game`));
	});

	test("throws error when winner is in the same row as loser", () => {
		const winner = "Alice";
		const loser = "Bob";
		const league = gameState.createLeague();
		league.addPlayer("Player");
		league.addPlayer(winner);
		league.addPlayer(loser);
		expect(league.getPlayers()).toEqual([expect.any(Array), [winner, loser]]);

		const recordWin = () => league.recordWin(winner, loser);

		expect(recordWin).toThrow(
			new InvalidArgumentException(
				`Cannot record match result. Winner '${winner}' must be one row below loser '${loser}'`
			)
		);
	});

	test("throws error when winner is one row above loser", () => {
		const winner = "Alice";
		const loser = "Bob";
		const league = gameState.createLeague();
		league.addPlayer(winner);
		league.addPlayer(loser);
		expect(league.getPlayers()).toEqual([[winner], [loser]]);

		const recordWin = () => league.recordWin(winner, loser);

		expect(recordWin).toThrow(
			new InvalidArgumentException(
				`Cannot record match result. Winner '${winner}' must be one row below loser '${loser}'`
			)
		);
	});

	test("throws error when winner is two rows below loser", () => {
		const winner = "Alice";
		const loser = "Bob";
		const league = gameState.createLeague();
		league.addPlayer(winner);
		league.addPlayer("Player1");
		league.addPlayer("Player2");
		league.addPlayer(loser);
		expect(league.getPlayers()).toEqual([[winner], expect.any(Array), [loser]]);

		const recordWin = () => league.recordWin(winner, loser);

		expect(recordWin).toThrow(
			new InvalidArgumentException(
				`Cannot record match result. Winner '${winner}' must be one row below loser '${loser}'`
			)
		);
	});

	test("swaps winner and loser when winner is one row below loser", () => {
		const winner = "Alice";
		const loser = "Bob";
		const league = gameState.createLeague();
		league.addPlayer(loser);
		league.addPlayer(winner);
		expect(league.getPlayers()).toEqual([[loser], [winner]]);

		league.recordWin(winner, loser);

		expect(league.getPlayers()).toEqual([[winner], [loser]]);
	});
});

describe("getWinner", () => {
	test("returns nothing when there are no players", () => {
		const league = gameState.createLeague();

		const winner = league.getWinner();

		expect(winner).toBeNil();
	});

	test("returns the player at the top of the rankings", () => {
		const winner = "Alice";
		const league = gameState.createLeague();
		league.addPlayer(winner);
		league.addPlayer("Bob");
		league.addPlayer("Player1");
		league.addPlayer("Player2");
		league.addPlayer("Player3");
		expect(league.getPlayers()).toEqual([[winner], expect.any(Array), expect.any(Array)]);

		const receivedWinner = league.getWinner();

		expect(receivedWinner).toBe(winner);
	});
});
