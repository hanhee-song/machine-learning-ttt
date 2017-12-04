const Players = require('./player.js');
const RandomPlayer = Players.RandomPlayer;
const MLPlayer = Players.MLPlayer;
const EasyPlayer = Players.EasyPlayer;
const MediumPlayer = Players.MediumPlayer;
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
    this._drawGraph();
    this.interval = 0;
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
    
    this._queueDraw();
    this._takeTurn();
    this._changeIcon();
    this._refreshAllScores();
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
    this._changeIcon();
    setTimeout(() => {
      this.board.resetGrid();
      this._refreshAllScores();
    }, 0);
  }
  
  changePauseState() {
    this.paused = !this.paused;
    this._changeIcon();
    if (!this.paused && this.running) {
      this.board.resetGrid();
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
  
  _changeIcon() {
    const icon = document.querySelector(".toggle-play-icon");
    if (this.paused) {
      icon.classList.add("fa-play");
      icon.classList.remove("fa-pause");
    } else {
      icon.classList.remove("fa-play");
      icon.classList.add("fa-pause");
    }
  }
  
  _refreshAllScores() {
    document.querySelector(".score-1").innerHTML = `Player 1: ${this.score1}`;
    document.querySelector(".score-2").innerHTML = `Player 2: ${this.score2}`;
    document.querySelector(".score-tie").innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;Ties: ${this.ties}`;
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
      this._drawGraph();
      this.board.resetGrid();
    }
    this.currentPlayer.makeMove(this.board)
      .then(
        pos => {
          if (this.board.validPos(pos)) {
            if (this.running) {
              this.board.setPiece(pos, this.currentPlayer.piece);
              this._switchPlayers();
              setTimeout(() => {
                this._takeTurn();
              }, this.interval);
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
        document.querySelector(".score-1").innerHTML = `Player 1: ${this.score1}`;
        break;
      case "o":
        this.score2++;
        this.recentScore2++;
        document.querySelector(".score-2").innerHTML = `Player 2: ${this.score2}`;
        break;
      case "t":
        this.ties++;
        this.recentTies++;
        document.querySelector(".score-tie").innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;Ties: ${this.ties}`;
        break;
    }
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
    if (this.scoreRatios.length > 200) {
      this.scoreRatios.shift();
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
    this._queueDraw();
  }
}

module.exports = Game;
