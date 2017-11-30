(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Board {
  constructor(size) {
    this.size = size;
    this.grid = this.initializeGrid(size);
  }
  
  initializeGrid(size) {
    const grid = [];
    for (var i = 0; i < this.size; i++) {
      const row = [];
      for (var j = 0; j < this.size; j++) {
        row.push("");
      }
      grid.push(row);
    }
    return grid;
  }
  
  drawInitialBoard() {
    const board = document.getElementById('board');
    const length = board.style.width - 2;
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        const square = document.createElement('div');
        square.className = `square ${i}-${j}`;
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
      if (row.length === 1 && !row.has("")) {
        return row.values().next().value;
      }
      if (col.length === 1 && !col.has("")) {
        return row.values().next().value;
      }
    }
    
    // diags
    const diag1 = new Set();
    const diag2 = new Set();
    for (var i = 0; i < this.size; i++) {
      diag1.add(this.grid[i][i]);
      diag2.add(this.grid[i][this.size - i]);
    }
    if (diag1.length === 1 && !diag1.has("")) {
      return diag1.values().next().value;
    }
    if (diag2.length === 1 && !diag2.has("")) {
      return diag2.values().next().value;
    }
    
    return this.isBoardFull() ? "t" : undefined;
  }
  
  isBoardFull() {
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        if (this.board[i][j] === "") return false;
      }
    }
    return true;
  }
  
  placePiece(pos, piece) {
    this._checkValidPiece(piece);
    this.checkValidPos(pos);
    
    this.grid[pos[1]][pos[0]] = piece;
  }
  
  _checkValidPiece(piece) {
    if (piece !== "x" || piece !== "o") {
      throw "Invalid piece";
    }
  }
  
  checkValidPos(pos) {
    if ( this.openPositions().has(pos)
      || pos[0] < 0 || pos[0] >= this.size
      || pos[1] < 0 || pos[1] >= this.size) {
        throw "Invalid position";
    }
  }
  
  openPositions() {
    // returns set of available positions
    
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
  }
  
  newGame(size = 3, player1 = new RandomPlayer(), player2 = new RandomPlayer()) {
    this.size = size;
    this.board = new Board(size);
    this.board.drawInitialBoard();
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = this.player1;
  }
  
  startGame() {
    this._takeTurn();
  }
  
  _takeTurn() {
    this.currentPlayer.makeMove(this.board)
      .then(
        pos => {
          if (this.board.checkValidPos(pos)) {
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
  
});

},{"./game.js":2}],4:[function(require,module,exports){
class Player {
  constructor(props) {
    
  }
}

class RandomPlayer extends Player {
  constructor(props) {
    super(props);
  }
  
  makeMove(board) {
    // add logic for making move depending on
    // board.openPositions()
    
    let move = [0, 0];
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        return resolve(move);
      }, 500);
    });
  }
}

class AIPlayer extends Player {
  constructor(props) {
    super(props);
  }
}

module.exports = { RandomPlayer, AIPlayer };

},{}]},{},[3]);
