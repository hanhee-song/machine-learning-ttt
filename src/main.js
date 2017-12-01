const Game = require('./game.js');

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  
  game.newGame(3);
  game.startGame();
  
  const pauseButton = document.querySelector(".pause-button");
  pauseButton.addEventListener("click", (e) => {
    game.changePauseState();
  });
  
});
