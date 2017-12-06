(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Board {
  constructor(size) {
    this.size = size;
    this.grid = undefined;
    this.squares = [];
    this.drawInitialBoard();
    this.resetGrid(size);
  }
  
  resetGrid(size) {
    const grid = [];
    for (var i = 0; i < this.size; i++) {
      const row = [];
      for (var j = 0; j < this.size; j++) {
        row.push(" ");
        this.squares[i * 3 + j].innerHTML = "";
      }
      grid.push(row);
    }
    this.grid = grid;
  }
  
  drawInitialBoard() {
    const board = document.getElementById('board');
    const length = board.style.width - 2;
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        const square = document.createElement('div');
        square.className = `square s${i}${j}`;
        square.style.width = `${Math.floor(length / this.size)}px`;
        square.style.height = `${Math.floor(length / this.size)}px`;
        board.append(square);
        this.squares.push(square);
      }
    }
  }
  
  winner() {
    // rows & col
    for (var i = 0; i < this.size; i++) {
      const row = new Set();
      const col = new Set();
      for (var j = 0; j < this.size; j++) {
        row.add(this.grid[i][j]);
        col.add(this.grid[j][i]);
      }
      if (row.size === 1 && !row.has(" ")) {
        return row.values().next().value;
      }
      if (col.size === 1 && !col.has(" ")) {
        return col.values().next().value;
      }
    }
    
    // diags
    const diag1 = new Set();
    const diag2 = new Set();
    for (var i = 0; i < this.size; i++) {
      diag1.add(this.grid[i][i]);
      diag2.add(this.grid[i][this.size - i - 1]);
    }
    if (diag1.size === 1 && !diag1.has(" ")) {
      return diag1.values().next().value;
    }
    if (diag2.size === 1 && !diag2.has(" ")) {
      return diag2.values().next().value;
    }
    return this.isFull() ? "t" : undefined;
  }
  
  isFull() {
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        if (this.grid[i][j] === " ") return false;
      }
    }
    return true;
  }
  
  setPiece(pos, piece) {
    if (this.validPos(pos) && this._validPiece(piece)) {
      this.grid[pos[0]][pos[1]] = piece;
    }
    const square = document.querySelector(`.s${pos[0]}${pos[1]}`);
    square.innerHTML = piece;
  }
  
  getPiece(pos) {
    return this.grid[pos[0]][pos[1]];
  }
  
  _validPiece(piece) {
    return piece === "x" || piece === "o";
  }
  
  validPos(pos) {
    return this.getPiece(pos) === " ";
  }
  
  openPositions() {
    // returns array of available positions
    const positions = [];
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        if (this.grid[i][j] === " ") {
          positions.push([i, j]);
        }
      }
    }
    return positions;
  }
}

module.exports = Board;

},{}],2:[function(require,module,exports){
const ORDERED_ARR = [];
for (var i = 0; i < 100; i++) {
  ORDERED_ARR.push(i * 2);
}

function drawGraph(data) {
  const svg = d3.select("svg");
  svg.selectAll("g").remove();
  
  const margin = {top: 5, right: 0, bottom: 5, left: 40},
    width = 400,
    height = Number(svg.attr("height")) - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + 40 + "," + margin.top + ")");
  const x = d3.scaleBand()
    .rangeRound([0, width]);
  const y = d3.scaleLinear()
    .rangeRound([height, 0]);
  
  const area1 = d3.area()
    .x(d => x(d.id))
    .y0(height)
    .y1(d => y(d.player2));
    
  const line1 = d3.line()
    .x(d => x(d.id))
    .y(d => y(d.player2));
  
  const area2 = d3.area()
    .x(d => x(d.id))
    .y0(d => y(d.player2))
    .y1(d => y(d.ties + d.player2));
    
  const line2 = d3.line()
    .x(d => x(d.id))
    .y(d => y(d.ties + d.player2));
  
  const area3 = d3.area()
    .x(d => x(d.id))
    .y0(d => y(d.ties + d.player2))
    .y1(d => y(1));
    
  const line3 = d3.line()
    .x(d => x(d.id))
    .y(d => y(1));
  
  let xArr;
  if (data.length < 100) {
    xArr = ORDERED_ARR;
  } else {
    xArr = data.map(d => d.id);
  }
  
  x.domain(xArr);
  y.domain([0, 1]);
  
  g.append("path")
    .data([data])
    .attr("class", "area area3")
    .attr("d", area3);
  
  g.append("path")
    .data([data])
    .attr("class", "line line3")
    .attr("d", line3);
  
  g.append("path")
    .data([data])
    .attr("class", "area area2")
    .attr("d", area2);
      
  g.append("path")
    .data([data])
    .attr("class", "line line2")
    .attr("d", line2);
    
  g.append("path")
    .data([data])
    .attr("class", "area area1")
    .attr("d", area1);
    
  g.append("path")
    .data([data])
    .attr("class", "line line1")
    .attr("d", line1);
  
  g.append("g")
      .call(d3.axisLeft(y))
      .attr("transform", "translate(0," + -1 + ")")
    .attr("class", "axis-y")
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Win Ratios");
}

module.exports = drawGraph;

},{}],3:[function(require,module,exports){
const Players = require('./player.js');
const EasyPlayer = Players.EasyPlayer;
const MediumPlayer = Players.MediumPlayer;
const HardPlayer = Players.HardPlayer;
const MLPlayer = require('./ml_player.js');
const Board = require('./board.js');
const drawGraph = require('./draw_graph.js');

class Game {
  constructor() {
    this.board = new Board(3);
    this.player1 = null;
    this.player2 = null;
    this.currentPlayer = this.player1;
    this.score1 = 0;
    this.score2 = 0;
    this.ties = 0;
    this.recentScore1 = 0;
    this.recentScore2 = 0;
    this.recentTies = 0;
    this.scoreboard = [];
    this.scoreRatios = [];
    this.paused = true;
    this.running = false;
    drawGraph(this.scoreRatios);
    this.interval = 0;
    this.updateScoresCallback = () => {};
    this.pauseCallback = () => {};
  }
  
  startGame(player1 = new MLPlayer(), player2 = new EasyPlayer()) {
    this.player1 = player1;
    this.player2 = player2;
    this.player1.setPiece("x");
    this.player2.setPiece("o");
    this.currentPlayer = this.player1;
    this.score1 = 0;
    this.score2 = 0;
    this.ties = 0;
    this.recentScore1 = 0;
    this.recentScore2 = 0;
    this.recentTies = 0;
    this.scoreboard = [];
    this.scoreRatios = [];
    this.paused = false;
    this.running = true;
    
    this._takeTurn();
    this.pauseCallback(this.paused);
    this.updateScoresCallback(this.score1, this.score2, this.ties);
  }
  
  playGame(player1, player2) {
    if (!this.running) {
      this.startGame(player1, player2);
    } else {
      this.changePauseState();
    }
  }
  
  stopGame() {
    this.running = false;
    this.paused = true;
    this.pauseCallback(this.paused);
    setTimeout(() => {
      this.board.resetGrid();
      this.updateScoresCallback(this.score1, this.score2, this.ties);
    }, 0);
  }
  
  changePauseState() {
    this.paused = !this.paused;
    this.pauseCallback(this.paused);
    if (!this.paused && this.running) {
      this._takeTurn();
    }
  }
  
  updateSpeed(val) {
    const intervals = {
      10: 0,
      9: 20,
      8: 40,
      7: 70,
      6: 100,
      5: 150,
      4: 300,
      3: 500,
      2: 700,
      1: 1000
    };
    this.interval = intervals[val];
  }
  
  onUpdateScores(call) {
    this.updateScoresCallback = call;
  }
  
  onPause(call) {
    this.pauseCallback = call;
  }
  
  _takeTurn() {
    if (!this.running || this.paused) {
      return;
    }
    const winner = this.board.winner();
    if (winner) {
      this._updateScore(winner);
      this.scoreboard.push(winner);
      this.player1.receiveGameEnd(winner);
      this.player2.receiveGameEnd(winner);
      drawGraph(this.scoreRatios);
      this.board.resetGrid();
    }
    this.currentPlayer.makeMove(this.board)
      .then(
        pos => {
          if (this.board.validPos(pos)) {
            if (this.running) {
              this.board.setPiece(pos, this.currentPlayer.piece);
              this._switchPlayers();
              if (this.interval) {
                setTimeout(() => {
                  this._takeTurn();
                }, this.interval);
              } else {
                this._takeTurn();
              }
            }
          } else {
            debugger;
            // You hit this debugger because your AI made some
            // poor decisions that it should rethink.
          }
        }
      );
  }
  
  _updateScore(winner) {
    switch (winner) {
      case "x":
        this.score1++;
        this.recentScore1++;
        break;
      case "o":
        this.score2++;
        this.recentScore2++;
        break;
      case "t":
        this.ties++;
        this.recentTies++;
        break;
    }
    this.updateScoresCallback(this.score1, this.score2, this.ties);
    
    if (this.recentTies + this.recentScore1 + this.recentScore2 > 200) {
      switch (this.scoreboard[this.scoreboard.length - 201]) {
        case "x":
          this.recentScore1--;
          break;
        case "o":
          this.recentScore2--;
          break;
        case "t":
          this.recentTies--;
          break;
      }
    }
    
    const totalRuns = this.score1 + this.score2 + this.ties;
    if (totalRuns % 2 === 0) {
      let runs = this.recentScore1 + this.recentScore2 + this.recentTies;
      runs = runs || 1;
      // For the initial graph-drawing to not have
      // score1 / runs => NaN
      
      this.scoreRatios.push({
        id: totalRuns,
        player1: this.recentScore1 / runs,
        player2: this.recentScore2 / runs,
        ties: this.recentTies / runs,
      });
      if (this.scoreRatios.length > 100) {
        this.scoreRatios.shift();
      }
      drawGraph(this.scoreRatios);
    }
  }
  
  _switchPlayers() {
    // Maybe a more elegant way to do this
    if (this.currentPlayer === this.player1) {
      this.currentPlayer = this.player2;
    } else {
      this.currentPlayer = this.player1;
    }
  }
}

module.exports = Game;

},{"./board.js":1,"./draw_graph.js":2,"./ml_player.js":6,"./player.js":7}],4:[function(require,module,exports){
function initializeHelp() {
  const helpText = document.querySelector('.help-text');
  
  function clearHelp() {
    helpText.innerHTML = "";
  }
  
  const sliders = document.getElementsByClassName('sliders-container');
  for (var i = 0; i < sliders.length; i++) {
    sliders[i].addEventListener("mouseover", () => {
      helpText.innerHTML = "asdf";
    });
    sliders[i].addEventListener("mouseout", () => {
      clearHelp();
    });
  }
}

module.exports = initializeHelp;

},{}],5:[function(require,module,exports){
const Game = require('./game.js');
const Players = require('./player.js');
const EasyPlayer = Players.EasyPlayer;
const MediumPlayer = Players.MediumPlayer;
const HardPlayer = Players.HardPlayer;
const MLPlayer = require('./ml_player.js');
const initializeHelp = require('./help.js');

document.addEventListener("DOMContentLoaded", () => {
  initializeHelp();
  
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

},{"./game.js":3,"./help.js":4,"./ml_player.js":6,"./player.js":7}],6:[function(require,module,exports){
const Players = require('./player.js');
const Player = Players.Player;

class MLPlayer extends Player {
  constructor(win = 1, tie = 0, lose = -5) {
    super();
    this.currentGameMemory = [];
    this.memory = {};
    
    // LEARNING FACTORS
    this.winFactor = win;
    this.tieFactor = tie;
    this.loseFactor = lose;
    this.factorThreshold = 0;
    this.factorCap = 50;
  }
  
  makeMove(board) {
    // Machine learning happens here
    const boardState = JSON.stringify(board.grid);
    let move;
    
    const positions = board.openPositions();
    
    if (!this.memory[boardState]) {
      move = this._findRandomMove(board);
    } else {
      let totalWeight = 0;
      const weightArr = [];
      let greatestMove;
      let greatestMoveVal;
      positions.forEach((pos) => {
        const stringPos = JSON.stringify(pos);
        const score = this.memory[boardState][stringPos] || 0;
        if (greatestMoveVal === undefined || score > greatestMoveVal) {
          greatestMove = pos;
          greatestMoveVal = score;
        }
        if (score > -this.factorThreshold) {
          totalWeight += this.factorThreshold + score;
        }
        weightArr.push(totalWeight);
      });
      
      if (totalWeight === 0) {
        // If no score has pos value, choose the greatest
        move = greatestMove;
      } else {
        // Otherwise, pick a random one from the positives
        const rand = Math.floor(Math.random() * totalWeight);
        for (var i = 0; i < weightArr.length; i++) {
          if (rand < weightArr[i]) {
            move = positions[i];
            break;
          }
        }
      }
      if (!move) {
        // You hit this because your AI didn't find any favorable moves.
        // Your AI needs to rethink. Or maybe you need to rethink
        // for your AI.
        debugger;
        move = this._findRandomMove(board);
      }
    }
    
    const moveState = JSON.stringify(move);
    this.currentGameMemory.push([boardState, moveState]);
    return this._promisifyMove(move);
  }
  
  receiveGameEnd(winner) {
    let factor;
    if (winner === this.piece) {
      factor = this.winFactor;
    } else if (winner === "t") {
      factor = this.tieFactor;
    } else {
      factor = this.loseFactor;
    }
    this.currentGameMemory.forEach((arr, i) => {
      let val = factor * (i + 1);
      if (i === arr.length - 1) {
        val = factor * 5;
      }
      const board = arr[0];
      const move = arr[1];
      if (this.memory[board]) {
        if (this.memory[board][move]) {
          this.memory[board][move] = Math.min(this.memory[board][move] + val, this.factorCap);
        } else {
          this.memory[board][move] = val;
        }
      } else {
        this.memory[board] = { [move]: val };
      }
    });
    this.currentGameMemory = [];
  }
}

module.exports = MLPlayer;

},{"./player.js":7}],7:[function(require,module,exports){
class Player {
  constructor() {
    this.piece = null;
  }
  
  setPiece(piece) {
    this.piece = piece;
  }
  
  makeMove(board) {
    
  }
  
  receiveGameEnd(winner) {
    
  }
  
  _makeRandomMove(board) {
    const move = this._findRandomMove(board);
    return this._promisifyMove(move);
  }
  
  _findRandomMove(board) {
    const positions = board.openPositions();
    const randPos = Math.floor(Math.random() * positions.length);
    return positions[randPos];
  }
  
  _promisifyMove(move) {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        return resolve(move);
      }, 0);
    });
  }
}

// PRE-BUILT AI PLAYERS ==================================

class AIPlayer extends Player {
  constructor() {
    super();
  }
  
  _findTwoInRow(board, piece) {
    // rows & col
    for (var i = 0; i < board.size; i++) {
      const row = [];
      const col = [];
      for (var j = 0; j < board.size; j++) {
        row.push(board.getPiece([i, j]));
        col.push(board.getPiece([j, i]));
      }
      if (row.count(piece) === 2 && row.includes(" ")) {
        return [i, row.indexOf(" ")];
      }
      if (col.count(piece) === 2 && col.includes(" ")) {
        return [col.indexOf(" "), i];
      }
    }
    
    // diags
    const diag1 = [];
    const diag2 = [];
    for (var i = 0; i < board.size; i++) {
      diag1.push(board.getPiece([i, i]));
      diag2.push(board.getPiece([i, board.size - i - 1]));
    }
    if (diag1.count(piece) === 2 && diag1.includes(" ")) {
      return [diag1.indexOf(" "), diag1.indexOf(" ")];
    }
    if (diag2.count(piece) === 2 && diag2.includes(" ")) {
      return [diag2.indexOf(" "), board.size - diag2.indexOf(" ") - 1];
    }
  }
}

class EasyPlayer extends Player {
  constructor() {
    super();
  }
  
  makeMove(board) {
    return this._makeRandomMove(board);
  }
}
  
class MediumPlayer extends AIPlayer {
  constructor() {
    super();
  }
  
  makeMove(board) {
    let move;
    const otherPiece = this.piece === "x" ? "o" : "x";
    move = this._findTwoInRow(board, this.piece) || this._findTwoInRow(board, otherPiece);
    
    if (!move) {
      const goodMoves = [
        [0, 0],
        [0, 2],
        [1, 1],
        [2, 0],
        [2, 2]
      ];
      shuffle(goodMoves);
      
      const moves = goodMoves.map(pos => JSON.stringify(pos));
      const positions = board.openPositions().map(pos => JSON.stringify(pos));
      for (var i = 0; i < moves.length; i++) {
        if (positions.includes(moves[i])) {
          move = goodMoves[i];
          break;
        }
      }
      move = move || this._findRandomMove(board);
    }
    return this._promisifyMove(move);
  }
}

class HardPlayer extends AIPlayer {
  constructor() {
    super();
  }
  
  makeMove(board) {
    let move;
    let corners = [
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2]
    ];
    let edges = [
      [0, 1],
      [1, 0],
      [2, 1],
      [1, 2]
    ];
    let freeCorners = [];
    corners = shuffle(corners);
    edges = shuffle(edges);
    const grid = [];
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        grid.push(board.getPiece([i, j]));
      }
    }
    const turn = 10 - grid.count(" ");
    
    const otherPiece = this.piece === "x" ? "o" : "x";
    move = this._findTwoInRow(board, this.piece) || this._findTwoInRow(board, otherPiece);
    if (move) {
      // This is to make it mutually exclusive with all the
      // following turn logic
    } else if (turn === 1) {
      // find a corner
      move = corners[0];
      
    } else if (turn === 2) {
      // If opponent chose corner, choose center
      // otherwise, choose corner
      for (var i = 0; i < corners.length; i++) {
        if (board.getPiece(corners[i]) !== " ") {
          move = [1, 1];
        }
      }
      if (!move) {
        move = corners[0];
      }
      
    } else if (turn === 3) {
      // If opponent chose center, choose opposite corner
      // If opponent chose corner, choose any corner
      // If opponent chose edge, take center
      if (board.getPiece([1, 1]) !== " ") {
        for (var i = 0; i < corners.length; i++) {
          if (board.getPiece(corners[i]) !== " ") {
            move = [(corners[i][0] + 2) % 4, (corners[i][1] + 2) % 4];
          }
        }
      } else {
        for (var i = 0; i < corners.length; i++) {
          if (board.getPiece(corners[i]) === " ") {
            freeCorners.push(corners[i]);
          }
        }
        if (freeCorners.length === 2) {
          move = freeCorners[0];
        } else {
          move = [1, 1];
        }
      }
      
    } else if (turn === 4) {
      // If the center hasn't been taken by now, take it
      // If opponent has two corner pieces, take an edge to force block
      // If the opponent chose an edge, choose the other edge
      // opposite of the opponent's corner piece
      let takenCorner;
      for (var i = 0; i < corners.length; i++) {
        if (board.getPiece(corners[i]) === " ") {
          freeCorners.push(corners[i]);
        } else {
          takenCorner = corners[i];
        }
      }
      if (board.getPiece([1, 1]) === " ") {
        move = [1, 1];
      } else if (freeCorners.length === 2) {
        move = edges[0];
      } else {
        const edge1 = [(takenCorner[0] + 2) % 3, (takenCorner[1] + 1) % 3];
        const edge2 = [(takenCorner[0] + 1) % 3, (takenCorner[1] + 2) % 3];
        move = board.getPiece(edge1) === " " ?
          edge1 : edge2;
      }
    }
    
    move = move || this._findRandomMove(board);
    
    return this._promisifyMove(move);
  }
}

// Fisher-Yates Shuffle

function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let i = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[i];
    array[i] = temp;
  }
  return array;
}

Array.prototype.count = function(obj) {
  let counter = 0;
  for (var i = 0; i < this.length; i++) {
    if (this[i] === obj) counter++;
  }
  return counter;
};

module.exports = {
  Player,
  EasyPlayer,
  MediumPlayer,
  HardPlayer,
};

},{}]},{},[5]);
