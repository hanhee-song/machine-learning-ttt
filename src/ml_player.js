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
    
    this.brain = new Brain();
  }
  
  makeMove(board) {
    // Machine learning happens here
    const boardStr = JSON.stringify(board.grid);
    let move;
    
    const positions = board.openPositions();
    
    if (!this.brain.has(boardStr)) {
      move = this._findRandomMove(board);
    } else {
      // Build up probability array
      let totalWeight = 0;
      const weightArr = [];
      // If all moves have <=0 weight, take the move with
      // the greatest val
      let greatestMove;
      let greatestMoveVal;
      
      positions.forEach((pos) => {
        const stringPos = JSON.stringify(pos);
        const score = this.brain.score(boardStr, stringPos);
        if (greatestMoveVal === undefined || score > greatestMoveVal) {
          greatestMove = pos;
          greatestMoveVal = score;
        }
        if (score > -this.factorThreshold) {
          totalWeight += this.factorThreshold + score;
        }
        weightArr.push(totalWeight);
      });
      
      // If no score has pos value, choose the greatest
      // Otherwise, pick a random one from the positives
      if (totalWeight === 0) {
        move = greatestMove;
      } else {
        const rand = Math.floor(Math.random() * totalWeight);
        for (var i = 0; i < weightArr.length; i++) {
          if (rand < weightArr[i]) {
            move = positions[i];
            break;
          }
        }
      }
      
      if (!move) {
        move = this._findRandomMove(board);
      }
    }
    
    const moveState = JSON.stringify(move);
    this.currentGameMemory.push([boardStr, moveState]);
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
      this.brain.add(board, move, val);
    });
    this.currentGameMemory = [];
  }
}

class Brain {
  constructor() {
    this.memory = {};
    this.factorCap = 50;
  }
  
  has(board) {
    return Boolean(this.memory[board]);
  }
  
  add(board, move, val) {
    if (this.memory[board]) {
      if (this.memory[board][move]) {
        this.memory[board][move] = Math.min(this.memory[board][move] + val, this.factorCap);
      } else {
        this.memory[board][move] = val;
      }
    } else {
      this.memory[board] = { [move]: val };
    }
  }
  
  score(board, move) {
    return this.memory[board][move] || 0;
  }
}

module.exports = MLPlayer;
