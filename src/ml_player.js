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
