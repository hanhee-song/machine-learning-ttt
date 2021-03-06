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
    this.currentPlayer = this.currentPlayer === this.player1 ?
      this.player2 : this.player1;
  }
}

module.exports = Game;
