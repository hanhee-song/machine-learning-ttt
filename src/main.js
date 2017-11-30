const Game = require('./game.js');

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  
  game.newGame();
  game.startGame();
  
});
