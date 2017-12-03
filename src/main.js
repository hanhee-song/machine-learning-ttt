const Game = require('./game.js');

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  
  game.newGame(3);
  
  const playButton = document.querySelector(".play-button");
  playButton.addEventListener("click", (e) => {
    game.playGame();
  });
  
  const startButton = document.querySelector(".start-button");
  startButton.addEventListener("click", (e) => {
  });
  
});
