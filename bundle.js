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
  
  isGameOver() {
    const winner = this.winner();
    return winner && winner !== " ";
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
const Players = require('./player.js');
const RandomPlayer = Players.RandomPlayer;
const AIPlayer = Players.AIPlayer;
const Board = require('./board.js');

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
    this.paused = false;
    this.running = false;
  }
  
  newGame(size = 3, player1 = new AIPlayer(), player2 = new RandomPlayer()) {
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
    if (this.board.isFull() || this.board.isGameOver()) {
      // optimize later: winner is run 3 times here
      const winner = this.board.winner();
      this._updateScore();
      this.player1.receiveGameEnd(winner);
      this.player2.receiveGameEnd(winner);
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
  
  _endRound() {
    
  }
  
  _updateScore() {
    switch (this.board.winner()) {
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
}

module.exports = Game;

},{"./board.js":1,"./player.js":4}],3:[function(require,module,exports){
const Game = require('./game.js');

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  
  game.newGame();
  game.startGame();
  
  const pauseButton = document.querySelector(".pause-button");
  pauseButton.addEventListener("click", (e) => {
    game.changePauseState();
  });
  
});

},{"./game.js":2}],4:[function(require,module,exports){
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
    return this._returnMove(move);
  }
  
  _findRandomMove(board) {
    const positions = board.openPositions();
    const randPos = Math.floor(Math.random() * positions.length);
    return positions[randPos];
  }
  
  _returnMove(move) {
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

class NaivePlayer extends Player {
  constructor(props) {
    super(props);
  }
  
  makeMove(board) {
    let move;
  }
}

class AIPlayer extends Player {
  constructor(props) {
    super(props);
    this.currentGameMemory = [];
    this.memory = {};
    // this.totalMoveFactor = 0;
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
        if (score > -10) {
          totalWeight += 10 + score;
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
    return this._returnMove(move);
  }
  
  receiveGameEnd(winner) {
    let factor;
    if (winner === this.piece) {
      factor = 1;
    } else if (winner === "t") {
      factor = 0;
    } else {
      factor = -1;
    }
    this.currentGameMemory.forEach((arr, i) => {
      let val = factor * (i + 1);
      if (i === arr.length - 1) {
        
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

module.exports = { RandomPlayer, AIPlayer };

},{}]},{},[3]);
