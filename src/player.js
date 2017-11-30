class Player {
  constructor(props) {
    this.piece = null;
  }
}

class RandomPlayer extends Player {
  constructor(props) {
    super(props);
  }
  
  makeMove(board) {
    // add logic for making move depending on
    const positions = board.openPositions();
    const randPos = Math.floor(Math.random() * positions.length);
    const move = positions[randPos];
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        return resolve(move);
      }, 0);
    });
  }
}

class AIPlayer extends Player {
  constructor(props) {
    super(props);
  }
}

module.exports = { RandomPlayer, AIPlayer };
