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
