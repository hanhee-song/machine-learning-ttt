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

class AIPlayer extends Player {
  constructor(props) {
    super(props);
    this.currentGameMemory = [];
    this.memory = {};
    this.totalMoveFactor = 0;
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
      factor += factor;
      const board = arr[0];
      const move = arr[1];
      if (this.memory[board]) {
        if (this.memory[board][move]) {
          this.memory[board][move] += factor;
        } else {
          this.memory[board][move] = 10 + factor;
        }
      } else {
        this.memory[board] = { [move]: 10 + factor };
      }
    });
    this.currentGameMemory = [];
    console.log(this.memory);
  }
  
  makeMove(board) {
    // for now, it'll make a random move and remember it
    const move = this._findRandomMove(board);
    const boardState = JSON.stringify(board.grid);
    const moveState = JSON.stringify(move);
    this.currentGameMemory.push([boardState, moveState]);
    return this._returnMove(move);
  }
}

module.exports = { RandomPlayer, AIPlayer };
