class Player {
  constructor(props) {
    super(props);
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

export { RandomPlayer, AIPlayer };
