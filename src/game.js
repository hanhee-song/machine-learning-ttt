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
  
  newGame(size = 3, player1 = new MLPlayer(), player2 = new EasyPlayer()) {
    this.size = size;
    this.board = new Board(size);
    this.player1 = player1;
    this.player1.piece = "x";
    this.player2 = player2;
    this.player2.piece = "o";
    this.currentPlayer = this.player1;
  }
  
  playGame() {
    if (!this.running) {
      this.startGame();
    } else {
      this.changePauseState();
    }
  }
  
  startGame() {
    this._takeTurn();
    this.running = true;
    this.changeIcon();
  }
  
  changePauseState() {
    this.paused = !this.paused;
    this.changeIcon();
    if (!this.paused && this.running) {
      this.board.resetGrid();
      this._takeTurn();
    }
  }
  
  changeIcon() {
    const icon = document.querySelector(".toggle-play-icon");
    if (this.paused) {
      icon.classList.add("fa-play");
      icon.classList.remove("fa-pause");
    } else {
      icon.classList.remove("fa-play");
      icon.classList.add("fa-pause");
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
        document.querySelector(".score-1").innerHTML = `Player 1: ${this.score1}`;
        break;
      case "o":
        this.score2++;
        document.querySelector(".score-2").innerHTML = `Player 2: ${this.score2}`;
        break;
      case "t":
        this.ties++;
        document.querySelector(".score-tie").innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;Ties: ${this.ties}`;
        break;
    }
    // document.querySelector(".scores-number").innerHTML = `${this.score1} / ${this.score2} / ${this.ties}`;
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
