const gameState = require("../src/league");
const leagueRenderer = require("../src/league_renderer");

describe("leagueRenderer", function () {
	test("states that the league is empty", function () {
		const league = gameState.createLeague();

		const rendered = leagueRenderer.render(league);

		expect(rendered).toBe("No players yet");
	});

	test("displays name centred in box", () => {
		const league = gameState.createLeague();
		league.addPlayer("LMR");

		const rendered = leagueRenderer.render(league);

		expect(rendered).toBe(`-------------------
|       LMR       |
-------------------`);
	});

	test("displays name off centre in box when name length does not align with max name length", () => {
		const league = gameState.createLeague();
		league.addPlayer("LR");

		const rendered = leagueRenderer.render(league);

		expect(rendered).toBe(`-------------------
|       LR        |
-------------------`);
	});

	test("truncates name when it's over max length", () => {
		const league = gameState.createLeague();
		league.addPlayer("Reallyreallyreallyreallylongname");

		const rendered = leagueRenderer.render(league);

		expect(rendered).toBe(`-------------------
|Reallyreallyre...|
-------------------`);
	});

	test("horizontally aligns boxes", () => {
		const league = gameState.createLeague();
		league.addPlayer("1");
		league.addPlayer("2");
		league.addPlayer("3");
		league.addPlayer("4");
		league.addPlayer("5");
		league.addPlayer("6");

		const rendered = leagueRenderer.render(league);

		expect(rendered).toBe(`                    -------------------
                    |        1        |
                    -------------------
          ------------------- -------------------
          |        2        | |        3        |
          ------------------- -------------------
------------------- ------------------- -------------------
|        4        | |        5        | |        6        |
------------------- ------------------- -------------------`);
	});
});
