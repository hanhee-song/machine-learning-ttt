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
    // this.totalMoveFactor = 0;
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
      positions.forEach((pos) => {
        const stringPos = JSON.stringify(pos);
        const score = this.memory[boardState][stringPos] || 0;
        if (score < 10) {
          totalWeight += 10 + score;
        }
        weightArr.push(totalWeight);
      });
      
      const rand = Math.floor(Math.random() * totalWeight);
      for (var i = 0; i < weightArr.length; i++) {
        if (rand <= weightArr[i]) {
          move = positions[i];
          break;
        }
      }
      if (!move) {
        debugger;
        move = this._findRandomMove(board);
      }
    }
    
    
    const moveState = JSON.stringify(move);
    
    
    this.currentGameMemory.push([boardState, moveState]);
    return this._returnMove(move);
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
      let val = factor * (i + 1);
      const board = arr[0];
      const move = arr[1];
      if (this.memory[board]) {
        if (this.memory[board][move]) {
          this.memory[board][move] += val;
        } else {
          this.memory[board][move] = val;
        }
      } else {
        this.memory[board] = { [move]: val };
      }
    });
    this.currentGameMemory = [];
  }
  
  // getMoveFactor(boardState) {
  //   let factor = 0;
  //   if (!this.memory[boardState]) {
  //     return factor;
  //   }
  //
  //   Object.values(this.memory[boardState]).forEach((val) => {
  //     factor += val;
  //   });
  //   return factor;
  // }
}

module.exports = { RandomPlayer, AIPlayer };
