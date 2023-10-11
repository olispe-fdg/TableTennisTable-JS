const { setWorldConstructor } = require("@cucumber/cucumber");

const app = require("../../src/app");
const gameState = require("../../src/league");

// Create a 'Game World' that has a game already set up for our tests
class GameWorld {
	constructor() {
		this.league = gameState.createLeague();
		this.game = app.startGame(this.league);
	}
}

setWorldConstructor(GameWorld);
