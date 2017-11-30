class Player {
  constructor(props) {
    this.piece = null;
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
  }
  
  makeMove(board) {
    // for now, it'll make a random move and remember it
    const move = this._findRandomMove(board);
    const boardState = JSON.stringify(board.grid);
    const moveState = JSON.stringify(move);
    this.currentGameMemory.push([boardState, moveState]);
    console.log(this.currentGameMemory);
    return this._returnMove(move);
  }
}

module.exports = { RandomPlayer, AIPlayer };
