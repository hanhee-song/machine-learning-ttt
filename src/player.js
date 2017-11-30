class Player {
  constructor(props) {
    
  }
}

class RandomPlayer extends Player {
  constructor(props) {
    super(props);
  }
  
  makeMove(board) {
    // Returns a promise
  }
}

class AIPlayer extends Player {
  constructor(props) {
    super(props);
  }
}

module.exports = { RandomPlayer, AIPlayer };
