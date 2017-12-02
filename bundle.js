(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Board {
  constructor(size) {
    this.size = size;
    this.grid = undefined;
    this.drawInitialBoard();
    this.resetGrid(size);
  }
  
  resetGrid(size) {
    const grid = [];
    for (var i = 0; i < this.size; i++) {
      const row = [];
      for (var j = 0; j < this.size; j++) {
        row.push(" ");
        const square = document.querySelector(`.s${i}${j}`);
        square.innerHTML = "";
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
      diag2.add(this.grid[i][this.size - i]);
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
  
  placePiece(pos, piece) {
    if (this.validPos(pos) && this._validPiece(piece)) {
      this.grid[pos[0]][pos[1]] = piece;
    }
    const square = document.querySelector(`.s${pos[0]}${pos[1]}`);
    square.innerHTML = piece;
  }
  
  _validPiece(piece) {
    return piece === "x" || piece === "o";
  }
  
  validPos(pos) {
    return this.openPositions().map((arr) => {
      return JSON.stringify(arr);
    }).includes(JSON.stringify(pos));
      // && pos[0] >= 0 && pos[0] < this.size
      // && pos[1] >= 0 && pos[1] < this.size;
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
for (var i = 0; i < 200; i++) {
  ORDERED_ARR.push(i);
}

function drawGraph(data) {
  // debugger;
  
  const svg = d3.select("svg");
  svg.selectAll("g").remove();
  
  const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = Number(svg.attr("width")) - margin.left - margin.right,
    height = Number(svg.attr("height")) - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  const x = d3.scaleBand()
    .rangeRound([0, width]);
  const y = d3.scaleLinear()
    .rangeRound([height, 0]);
  
  const area1 = d3.area()
    .x(d => x(d.id))
    .y0(height)
    .y1(d => y(d.player1));
    
  const line1 = d3.line()
    .x(d => x(d.id))
    .y(d => y(d.player1));
  
  const area2 = d3.area()
    .x(d => x(d.id))
    .y0(d => y(d.player1))
    .y1(d => y(d.ties + d.player1));
    
  const line2 = d3.line()
    .x(d => x(d.id))
    .y(d => y(d.ties + d.player1));
  
  const area3 = d3.area()
    .x(d => x(d.id))
    .y0(d => y(d.ties + d.player1))
    .y1(d => y(1));
    
  const line3 = d3.line()
    .x(d => x(d.id))
    .y(d => y(1));
  
  let xArr;
  if (data.length < 200) {
    xArr = ORDERED_ARR;
  } else {
    xArr = data.map(d => d.id);
  }
  
  x.domain(xArr);
  y.domain([0, 1]);
  
  g.append("path")
    .data([data])
    .attr("fill", "orange")
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

  // g.append("g")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(d3.axisBottom(x))
  //     .ticks(10);
  
  g.append("g")
      .call(d3.axisLeft(y))
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
const RandomPlayer = Players.RandomPlayer;
const MLPlayer = Players.MLPlayer;
const EasyPlayer = Players.EasyPlayer;
const MediumPlayer = Players.MediumPlayer;
const Board = require('./board.js');
const drawGraph = require('./draw_graph.js');

class Game {
  constructor() {
    this.size = null;
    this.board = null;
    this.player1 = null;
    this.player2 = null;
    this.currentPlayer = this.player1;
    this.score1 = 0;
    this.score2 = 0;
    this.ties = 0;
    this.scoreboard = [];
    this.scoreRatios = [];
    this.paused = false;
    this.running = false;
  }
  
  newGame(size = 3, player1 = new MLPlayer(), player2 = new MediumPlayer()) {
    this.size = size;
    this.board = new Board(size);
    this.player1 = player1;
    this.player1.piece = "x";
    this.player2 = player2;
    this.player2.piece = "o";
    this.currentPlayer = this.player1;
  }
  
  startGame() {
    this._takeTurn();
    this.running = true;
  }
  
  changePauseState() {
    this.paused = !this.paused;
    if (!this.paused && this.running) {
      this.board.resetGrid();
      this._takeTurn();
    }
  }
  
  _takeTurn() {
    const winner = this.board.winner();
    if (winner) {
      this._updateScore(winner);
      this.scoreboard.push(winner);
      this.player1.receiveGameEnd(winner);
      this.player2.receiveGameEnd(winner);
      this._drawGraph();
      if (this.paused) {
        return;
      }
      this.board.resetGrid();
    }
    this.currentPlayer.makeMove(this.board)
      .then(
        pos => {
          if (this.board.validPos(pos)) {
            this.board.placePiece(pos, this.currentPlayer.piece);
            this._switchPlayers();
            this._takeTurn();
          } else {
            debugger;
            // You hit this debugger because your AI made some
            // poor decisions that it should rethink.
          }
        }
      );
  }
  
  _updateScore(winner) {
    // this.scoreboard.push(winner);
    switch (winner) {
      case "x":
        this.score1++;
        document.querySelector(".score-1-number").innerHTML = this.score1;
        break;
      case "o":
        this.score2++;
        document.querySelector(".score-2-number").innerHTML = this.score2;
        break;
      case "t":
        this.ties++;
        document.querySelector(".score-tie-number").innerHTML = this.ties;
        break;
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
  
  // D3 MAGIC HAPPENS HERE ============
  
  _queueDraw() {
    if (!this.drawing) {
      this.drawing = true;
      setTimeout(() => {
        this.drawing = false;
        drawGraph(this.scoreRatios);
      }, 40);
    }
  }
  
  _drawGraph() {
    const totalRuns = this.score1 + this.score2 + this.ties;
    
    // TODO: Lots of room for optimizations here!
    
    let score1 = 0;
    let score2 = 0;
    let ties = 0;
    let runs = 0;
    
    for (var i = Math.max(0, this.scoreboard.length - 200); i < this.scoreboard.length; i++) {
      runs++;
      switch (this.scoreboard[i]) {
        case this.player1.piece:
          score1++;
          break;
        case this.player2.piece:
          score2++;
          break;
        case "t":
          ties++;
          break;
      }
    }
    
    this.scoreRatios.push({
      id: totalRuns,
      player1: score1 / runs,
      player2: score2 / runs,
      ties: ties / runs,
    });
    if (this.scoreRatios.length > 200) {
      this.scoreRatios.shift();
    }
    
    this._queueDraw();
  }
}

module.exports = Game;

},{"./board.js":1,"./draw_graph.js":2,"./player.js":5}],4:[function(require,module,exports){
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

},{"./game.js":3}],5:[function(require,module,exports){
class Player {
  constructor(props) {
    this.piece = null;
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

class RandomPlayer extends Player {
  constructor(props) {
    super(props);
  }
  
  makeMove(board) {
    return this._makeRandomMove(board);
  }
}

// PRE-BUILD AI PLAYERS ==================================

class AIPlayer extends Player {
  constructor(props) {
    super(props);
  }
  
  _findTwoInRow(board, piece) {
    let move;
    // rows & col
    for (var i = 0; i < board.size; i++) {
      const row = [];
      const col = [];
      for (var j = 0; j < board.size; j++) {
        row.push(board.grid[i][j]);
        col.push(board.grid[j][i]);
      }
      if (row.includes(this.piece) && row.includes(" ")) {
        move = [i, row.indexOf(" ")];
      }
      if (col.includes(this.piece) && col.includes(" ")) {
        move = [col.indexOf(" "), i];
      }
    }
    
    // diags
    const diag1 = [];
    const diag2 = [];
    for (var i = 0; i < board.size; i++) {
      diag1.push(board.grid[i][i]);
      diag2.push(board.grid[i][board.size - i]);
    }
    if (diag1.includes(this.piece) && diag1.includes(" ")) {
      move = [diag1.indexOf(" "), diag1.indexOf(" ")];
    }
    if (diag2.includes(this.piece) && diag2.includes(" ")) {
      move = [diag2.indexOf(" "), board.size - diag2.indexOf(" ")];
    }
    return move;
  }
}

class EasyPlayer extends AIPlayer {
  constructor(props) {
    super(props);
  }
  
  makeMove(board) {
    let move;
    const otherPiece = this.piece === "x" ? "o" : "x";
    move = this._findTwoInRow(board, this.piece) || this._findTwoInRow(board, otherPiece);
    
    move = move || this._findRandomMove(board);
    return this._promisifyMove(move);
  }
}

class MediumPlayer extends AIPlayer {
  constructor(props) {
    super(props);
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

// MACHINE LEARNING PLAYER ==========================

class MLPlayer extends Player {
  constructor(props) {
    super(props);
    this.currentGameMemory = [];
    this.memory = {};
    
    // LEARNING FACTORS
    this.winFactor = 1;
    this.tieFactor = 0;
    this.loseFactor = -5;
    this.factorThreshold = 10;
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
      positions.forEach((pos) => {
        const stringPos = JSON.stringify(pos);
        const score = this.memory[boardState][stringPos] || 0;
        if (score > -this.factorThreshold) {
          totalWeight += this.factorThreshold + score;
        }
        weightArr.push(totalWeight);
      });
      
      const rand = Math.floor(Math.random() * totalWeight);
      for (var i = 0; i < weightArr.length; i++) {
        if (rand <= weightArr[i]) {
          move = positions[i];
          break;
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
          this.memory[board][move] += val;
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

// Good ol' Fisher-Yates Shuffle

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

module.exports = { RandomPlayer, MLPlayer, EasyPlayer, MediumPlayer };

},{}]},{},[4]);
