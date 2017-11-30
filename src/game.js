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
    
    // hardcoding random player
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = this.player1;
  }
  
  _takeTurn() {
    this.currentPlayer.makeMove(this.board)
      .then(
        success => {
          this._takeTurn();
        }
      );
  }
  
  _promptMove(player) {
    
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
