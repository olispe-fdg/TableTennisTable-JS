const { when } = require("jest-when");
const { readFileSync, writeFileSync } = require("fs");
const app = require("../../src/app");
const gameState = require("../../src/league");

jest.mock("fs");

afterEach(() => {
	jest.resetAllMocks();
});

test("prints empty game state", () => {
	const game = app.startGame(gameState.createLeague());

	expect(game.sendCommand("print")).toEqual("No players yet");
});

test("prints game state with players", () => {
	const game = app.startGame(gameState.createLeague());

	game.sendCommand("add player Alice");
	game.sendCommand("add player Bob");

	expect(game.sendCommand("print")).toEqual(`          -------------------
          |      Alice      |
          -------------------
------------------- -------------------
|       Bob       | |                 |
------------------- -------------------`);
});

test("records and returns winner", () => {
	const game = app.startGame(gameState.createLeague());

	game.sendCommand("add player Alice");
	game.sendCommand("add player Bob");
	game.sendCommand("record win Bob Alice");

	expect(game.sendCommand("winner")).toEqual("Bob");
});

test("prints game state after loading", () => {
	const loadPath = "some/file/path.json";
	when(readFileSync)
		.calledWith(loadPath, expect.any(String))
		.mockReturnValue('[["Alice"], ["Bob"]]')
		.defaultImplementation((path) => {
			throw new Error(`File ${path} does not exist`);
		});
	const game = app.startGame(gameState.createLeague());

	game.sendCommand(`load ${loadPath}`);

	expect(game.sendCommand("print")).toEqual(`          -------------------
          |      Alice      |
          -------------------
------------------- -------------------
|       Bob       | |                 |
------------------- -------------------`);
});

test("saves game state to file", () => {
	const savePath = "some/file/path.json";
	const game = app.startGame(gameState.createLeague());

	game.sendCommand("add player Alice");
	game.sendCommand("add player Bob");
	game.sendCommand(`save ${savePath}`);

	expect(writeFileSync).toHaveBeenCalledWith(savePath, JSON.stringify([["Alice"], ["Bob"]]), { flag: "w" });
});
