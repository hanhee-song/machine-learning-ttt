const Game = require('./game.js');

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  
  
  // BUTTONS ====================
  
  const playButton = document.querySelector(".play-button");
  playButton.addEventListener("click", (e) => {
    game.playGame();
  });
  const stopButton = document.querySelector(".stop-button");
  stopButton.addEventListener("click", (e) => {
    game.stopGame();
  });
  
  // SLIDERS =====================
  
  const sliderWin1 = document.querySelector(".slider-win-1");
  const sliderWinVal1 = document.querySelector(".slider-win-value-1");
  const sliderTie1 = document.querySelector(".slider-tie-1");
  const sliderTieVal1 = document.querySelector(".slider-tie-value-1");
  const sliderLose1 = document.querySelector(".slider-lose-1");
  const sliderLoseVal1 = document.querySelector(".slider-lose-value-1");
  const sliderWin2 = document.querySelector(".slider-win-2");
  const sliderWinVal2 = document.querySelector(".slider-win-value-2");
  const sliderTie2 = document.querySelector(".slider-tie-2");
  const sliderTieVal2 = document.querySelector(".slider-tie-value-2");
  const sliderLose2 = document.querySelector(".slider-lose-2");
  const sliderLoseVal2 = document.querySelector(".slider-lose-value-2");
  
  const sliders = [
    [sliderWin1, sliderWinVal1],
    [sliderTie1, sliderTieVal1],
    [sliderLose1, sliderLoseVal1],
    [sliderWin2, sliderWinVal2],
    [sliderTie2, sliderTieVal2],
    [sliderLose2, sliderLoseVal2]
  ];
  
  sliders.forEach((arr) => {
    arr[0].addEventListener("change", (e) => {
      arr[1].innerHTML = arr[0].value;
    });
    arr[0].addEventListener("mousemove", (e) => {
      arr[1].innerHTML = arr[0].value;
    });
  });
  
  const select1 = document.querySelector(".select-1");
  const sliderContainer1 = document.querySelector(".sliders-container-1");
  const select2 = document.querySelector(".select-2");
  const sliderContainer2 = document.querySelector(".sliders-container-2");
  const selectArr = [
    [select1, sliderContainer1],
    [select2, sliderContainer2]
  ];
  sliderContainer1.style.height = "100px";
  sliderContainer1.setAttribute("height", "100px");
  selectArr.forEach((arr) => {
    arr[0].addEventListener("change", (e) => {
      if (arr[0].value === "ML") {
        arr[1].style.height = "100px";
        arr[1].setAttribute("height", "100px");
      } else {
        arr[1].style.height = "0";
        arr[1].setAttribute("height", "0");
      }
    });
  });
});
