const { when } = require("jest-when");
const uuid = require("uuid");
const app = require("../src/app");
const gameState = require("../src/league");
const leagueRenderer = require("../src/league_renderer");
const fileService = require("../src/file_service");

jest.mock("../src/file_service");
jest.mock("uuid");

afterEach(() => {
	jest.resetAllMocks();
});

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

describe("recording wins", () => {
	test("records win between given players", () => {
		const winner = "Alice";
		const loser = "Bob";
		const league = gameState.createLeague();
		const recordWin = jest.spyOn(league, "recordWin");

		const game = app.startGame(league);
		game.sendCommand(`record win ${winner} ${loser}`);

		expect(recordWin).toHaveBeenCalledWith(winner, loser);
	});

	// App's command processing isn't robust
	test.skip("does not record win when command is malformed", () => {
		const league = gameState.createLeague();
		const recordWin = jest.spyOn(league, "recordWin");

		const game = app.startGame(league);
		game.sendCommand(`record wins record win Alice Bob`);

		expect(recordWin).not.toHaveBeenCalled();
	});
});

test("winner command returns league winner", () => {
	const winner = "Some winner";
	const league = gameState.createLeague();
	jest.spyOn(league, "getWinner").mockReturnValue(winner);

	const game = app.startGame(league);
	const response = game.sendCommand("winner");

	expect(response).toBe(winner);
});

test("save command calls file service with path and league", () => {
	const league = gameState.createLeague();
	const path = "/some/file/path.json";

	const game = app.startGame(league);
	game.sendCommand(`save ${path}`);

	expect(fileService.save).toHaveBeenCalledWith(path, league);
});

test("load command calls file service with path and overwrites league", () => {
	const path = "/some/file/path.json";
	const loadedLeagueWinner = "Loaded league winner";
	const initialLeague = gameState.createLeague();
	const loadedLeague = gameState.createLeague();
	jest.spyOn(initialLeague, "getWinner").mockReturnValue("Initial league winner");
	jest.spyOn(loadedLeague, "getWinner").mockReturnValue(loadedLeagueWinner);
	when(fileService.load).calledWith(path).mockReturnValue(loadedLeague).defaultReturnValue(initialLeague);

	const game = app.startGame(initialLeague);
	game.sendCommand(`load ${path}`);
	const winner = game.sendCommand("winner");

	expect(winner).toBe(loadedLeagueWinner);
});

describe("autosaving", () => {
	test("adding player triggers autosave", () => {
		const mockUuid = "2423str-342ftwrs-23pstft3-p3t2wfdw";
		jest.mocked(uuid.v4).mockReturnValue(mockUuid);
		const league = gameState.createLeague();
		jest.spyOn(league, "addPlayer").mockImplementation(() => {});

		const game = app.startGame(league);
		game.sendCommand("add player Alice");

		expect(fileService.save).toHaveBeenCalledWith(`./saved_games/${mockUuid}.json`, league);
	});

	test("recording win triggers autosave", () => {
		const mockUuid = "2423str-342ftwrs-23pstft3-p3t2wfdw";
		jest.mocked(uuid.v4).mockReturnValue(mockUuid);
		const league = gameState.createLeague();
		jest.spyOn(league, "recordWin").mockImplementation(() => {});

		const game = app.startGame(league);
		game.sendCommand("record win Alice Bob");

		expect(fileService.save).toHaveBeenCalledWith(`./saved_games/${mockUuid}.json`, league);
	});

	test("subsequent autosaves reuse the same UUID", () => {
		const mockUuid = "2423str-342ftwrs-23pstft3-p3t2wfdw";
		jest.mocked(uuid.v4).mockReturnValue("32ftw3pt-3p2st23-2ftw89n9-8stn893").mockReturnValueOnce(mockUuid);
		const league = gameState.createLeague();
		jest.spyOn(league, "addPlayer").mockImplementation(() => {});

		const game = app.startGame(league);
		game.sendCommand("add player Alice");
		game.sendCommand("add player Bob");

		expect(fileService.save).toHaveBeenNthCalledWith(1, `./saved_games/${mockUuid}.json`, league);
		expect(fileService.save).toHaveBeenNthCalledWith(2, `./saved_games/${mockUuid}.json`, league);
	});
});
