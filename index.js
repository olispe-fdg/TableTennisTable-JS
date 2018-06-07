const app = require('./src/app');
const gameState = require('./src/league');
const readline = require('readline-sync');

const league = gameState.createLeague();
const game = app.startGame(league);

console.log('Welcome to the table tennis table');

let isGameActive = true;

while (isGameActive) {
  const command = readline.prompt();

  if (command === 'quit') {
    isGameActive = false;
  } else {
    const response = game.sendCommand(command);
    if (response) {
      console.log(response);
    }
  }
}
