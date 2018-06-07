const fs = require('fs');
const gameState = require('./league');
const path = require('path');

exports.save = function (absolutePath, league) {
  const players = league.getPlayers();
  fs.writeFileSync(absolutePath, JSON.stringify(players), { flag: 'w' }, function (err) {
    throw err;
  });
};

exports.load = function (absolutePath) {
  return gameState.load(JSON.parse(fs.readFileSync(absolutePath, 'utf8')));
};
