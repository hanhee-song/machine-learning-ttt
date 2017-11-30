class Player {
  constructor(props) {
    
  }
}

class RandomPlayer extends Player {
  constructor(props) {
    super(props);
  }
  
  makeMove(board) {
    // add logic for making move depending on
    // board.openPositions()
    
    let move = [0, 0];
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        return resolve(move);
      }, 500);
    });
  }
}

class AIPlayer extends Player {
  constructor(props) {
    super(props);
  }
}

module.exports = { RandomPlayer, AIPlayer };
