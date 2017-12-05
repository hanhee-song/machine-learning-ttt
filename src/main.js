const Game = require('./game.js');
const Players = require('./player.js');
const EasyPlayer = Players.EasyPlayer;
const MediumPlayer = Players.MediumPlayer;
const HardPlayer = Players.HardPlayer;
const MLPlayer = require('./ml_player.js');

document.addEventListener("DOMContentLoaded", () => {
  
  // INITIALIZE GAME ==============
  const game = new Game();
  const score1Div = document.querySelector(".score-1");
  const score2Div = document.querySelector(".score-2");
  const tiesDiv = document.querySelector(".score-tie");
  
  game.onUpdateScores((score1, score2, ties) => {
    score1Div.innerHTML = `Player 1: ${score1}`;
    score2Div.innerHTML = `Player 2: ${score2}`;
    tiesDiv.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;Ties: ${ties}`;
  });
  
  const icon = document.querySelector(".toggle-play-icon");
  game.onPause((paused) => {
    if (paused) {
      icon.classList.add("fa-play");
      icon.classList.remove("fa-pause");
    } else {
      icon.classList.remove("fa-play");
      icon.classList.add("fa-pause");
    }
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
  const sliderSpeed = document.querySelector(".slider-speed");
  const sliderSpeedVal = document.querySelector(".slider-speed-value");
  
  const sliders = [
    [sliderWin1, sliderWinVal1],
    [sliderTie1, sliderTieVal1],
    [sliderLose1, sliderLoseVal1],
    [sliderWin2, sliderWinVal2],
    [sliderTie2, sliderTieVal2],
    [sliderLose2, sliderLoseVal2],
    [sliderSpeed, sliderSpeedVal]
  ];
  
  sliders.forEach((arr) => {
    arr[0].addEventListener("input", (e) => {
      arr[1].innerHTML = arr[0].value;
    });
  });
  
  sliderSpeed.addEventListener("input", (e) => {
    game.updateSpeed(sliderSpeed.value);
  });
  
  const select1 = document.querySelector(".select-1");
  const sliderContainer1 = document.querySelector(".sliders-container-1");
  const select2 = document.querySelector(".select-2");
  const sliderContainer2 = document.querySelector(".sliders-container-2");
  const selectArr = [
    [select1, sliderContainer1],
    [select2, sliderContainer2]
  ];
  sliderContainer2.style.height = "80px";
  sliderContainer2.setAttribute("height", "80px");
  selectArr.forEach((arr) => {
    arr[0].addEventListener("change", (e) => {
      if (arr[0].value === "ML") {
        arr[1].style.height = "80px";
        arr[1].setAttribute("height", "80px");
      } else {
        arr[1].style.height = "0";
        arr[1].setAttribute("height", "0");
      }
    });
  });
  
  // BUTTONS ====================
  
  const inputs = [
    sliderWin1, sliderTie1, sliderLose1,
    sliderWin2, sliderTie2, sliderLose2,
    select1, select2
  ];
  
  function parseOptions(options) {
    let player1;
    let player2;
    switch (options.player1.type) {
      case "Easy":
      player1 = new EasyPlayer();
      break;
      case "Medium":
      player1 = new MediumPlayer();
      break;
      case "Hard":
      player1 = new HardPlayer();
      break;
      case "ML":
      player1 = new MLPlayer(options.player1.mods.win, options.player1.mods.tie, options.player1.mods.lose);
      break;
    }
    switch (options.player2.type) {
      case "Easy":
      player2 = new EasyPlayer();
      break;
      case "Medium":
      player2 = new MediumPlayer();
      break;
      case "Hard":
      player2 = new HardPlayer();
      break;
      case "ML":
      player2 = new MLPlayer(options.player2.mods.win, options.player2.mods.tie, options.player2.mods.lose);
      break;
    }
    return [player1, player2];
  }
  
  const playButton = document.querySelector(".play-button");
  
  playButton.addEventListener("click", (e) => {
    const options = {
      player1: {
        type: select1.value,
        mods: {
          win: Number(sliderWin1.value),
          tie: Number(sliderTie1.value),
          lose: Number(sliderLose1.value)
        }
      },
      player2: {
        type: select2.value,
        mods: {
          win: Number(sliderWin2.value),
          tie: Number(sliderTie2.value),
          lose: Number(sliderLose2.value)
        }
      }
    };
    
    game.playGame(...parseOptions(options));
    
    inputs.forEach((input) => {
      input.disabled = true;
    });
  });
  
  const stopButton = document.querySelector(".stop-button");
  stopButton.addEventListener("click", (e) => {
    game.stopGame();
    inputs.forEach((input) => {
      input.disabled = false;
    });
  });
});
