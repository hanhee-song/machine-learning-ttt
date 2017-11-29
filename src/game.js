import { RandomPlayer, AIPlayer } from './player.js';
import Board from './board.js';

class TTT {
  constructor() {
    this.size = null;
    this.board = null;
    this.player1 = null;
    this.player2 = null;
    this.currentPlayer = this.player1;
  }
  
  newGame(size, player1, player2) {
    this.size = size;
    this.board = new Board(size);
    
    // hardcoding random player
    this.player1 = new RandomPlayer();
    this.player2 = new RandomPlayer();
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
