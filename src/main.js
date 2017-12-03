const Game = require('./game.js');

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  
  game.newGame(3);
  
  const playButton = document.querySelector(".play-button");
  playButton.addEventListener("click", (e) => {
    game.playGame();
  });
  
  const sliderWin = document.querySelector(".slider-win");
  const sliderWinVal = document.querySelector(".slider-win-value");
  const sliderTie = document.querySelector(".slider-tie");
  const sliderTieVal = document.querySelector(".slider-tie-value");
  const sliderLose = document.querySelector(".slider-lose");
  const sliderLoseVal = document.querySelector(".slider-lose-value");
  
  sliderWin.addEventListener("change", (e) => {
    sliderWinVal.innerHTML = sliderWin.value;
  });
  sliderWin.addEventListener("mousemove", (e) => {
    sliderWinVal.innerHTML = sliderWin.value;
  });
  sliderTie.addEventListener("change", (e) => {
    sliderTieVal.innerHTML = sliderTie.value;
  });
  sliderTie.addEventListener("mousemove", (e) => {
    sliderTieVal.innerHTML = sliderTie.value;
  });
  sliderLose.addEventListener("change", (e) => {
    sliderLoseVal.innerHTML = sliderLose.value;
  });
  sliderLose.addEventListener("mousemove", (e) => {
    sliderLoseVal.innerHTML = sliderLose.value;
  });
  
  const select1 = document.querySelector(".select-1");
  const sliderContainer1 = document.querySelector(".sliders-container-1");
  select1.addEventListener("change", (e) => {
    if (select1.value === "ML") {
      sliderContainer1.style.height = "100px";
      sliderContainer1.setAttribute("height", "100px");
    } else {
      sliderContainer1.style.height = "0";
      sliderContainer1.setAttribute("height", "0");
    }
  });
});
