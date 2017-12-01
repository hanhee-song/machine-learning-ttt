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
    this.board.drawInitialBoard();
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
      this._takeTurn();
    }
  }
  
  _takeTurn() {
    if (this.board.isFull() || this.board.isGameOver()) {
      // optimize later: winner is run 3 times here
      const winner = this.board.winner();
      this._updateScore();
      this.board.resetGrid();
      this.player1.receiveGameEnd(winner);
      this.player2.receiveGameEnd(winner);
      if (this.paused) {
        return;
      }
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
