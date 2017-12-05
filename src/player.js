class Player {
  constructor() {
    this.piece = null;
  }
  
  setPiece(piece) {
    this.piece = piece;
  }
  
  makeMove(board) {
    
  }
  
  receiveGameEnd(winner) {
    
  }
  
  _makeRandomMove(board) {
    const move = this._findRandomMove(board);
    return this._promisifyMove(move);
  }
  
  _findRandomMove(board) {
    const positions = board.openPositions();
    const randPos = Math.floor(Math.random() * positions.length);
    return positions[randPos];
  }
  
  _promisifyMove(move) {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        return resolve(move);
      }, 0);
    });
  }
}

class RandomPlayer extends Player {
  constructor() {
    super();
  }
  
  makeMove(board) {
    return this._makeRandomMove(board);
  }
}

// PRE-BUILD AI PLAYERS ==================================

class AIPlayer extends Player {
  constructor() {
    super();
  }
  
  _findTwoInRow(board, piece) {
    let move;
    // rows & col
    for (var i = 0; i < board.size; i++) {
      const row = [];
      const col = [];
      for (var j = 0; j < board.size; j++) {
        row.push(board.getPiece([i, j]));
        col.push(board.getPiece([j, i]));
      }
      if (row.count(piece) === 2 && row.includes(" ")) {
        move = [i, row.indexOf(" ")];
      }
      if (col.count(piece) === 2 && col.includes(" ")) {
        move = [col.indexOf(" "), i];
      }
    }
    
    // diags
    const diag1 = [];
    const diag2 = [];
    for (var i = 0; i < board.size; i++) {
      diag1.push(board.getPiece([i, i]));
      diag2.push(board.getPiece([i, board.size - i - 1]));
    }
    if (diag1.count(piece) === 2 && diag1.includes(" ")) {
      move = [diag1.indexOf(" "), diag1.indexOf(" ")];
    }
    if (diag2.count(piece) === 2 && diag2.includes(" ")) {
      move = [diag2.indexOf(" "), board.size - diag2.indexOf(" ") - 1];
    }
    return move;
  }
}

class EasyPlayer extends AIPlayer {
  constructor() {
    super();
  }
  
  makeMove(board) {
    let move;
    const otherPiece = this.piece === "x" ? "o" : "x";
    move = this._findRandomMove(board);
    return this._promisifyMove(move);
  }
}
  
class MediumPlayer extends AIPlayer {
  constructor() {
    super();
  }
  
  makeMove(board) {
    let move;
    const otherPiece = this.piece === "x" ? "o" : "x";
    move = this._findTwoInRow(board, this.piece) || this._findTwoInRow(board, otherPiece);
    
    if (!move) {
      const goodMoves = [
        [0, 0],
        [0, 2],
        [1, 1],
        [2, 0],
        [2, 2]
      ];
      shuffle(goodMoves);
      
      const moves = goodMoves.map(pos => JSON.stringify(pos));
      const positions = board.openPositions().map(pos => JSON.stringify(pos));
      for (var i = 0; i < moves.length; i++) {
        if (positions.includes(moves[i])) {
          move = goodMoves[i];
          break;
        }
      }
      move = move || this._findRandomMove(board);
    }
    return this._promisifyMove(move);
  }
}

class HardPlayer extends AIPlayer {
  constructor() {
    super();
  }
  
  makeMove(board) {
    let move;
    let corners = [
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2]
    ];
    let edges = [
      [0, 1],
      [1, 0],
      [2, 1],
      [1, 2]
    ];
    let freeCorners = [];
    corners = shuffle(corners);
    edges = shuffle(edges);
    const grid = [];
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        grid.push(board.getPiece([i, j]));
      }
    }
    const turn = 10 - grid.count(" ");
    
    const otherPiece = this.piece === "x" ? "o" : "x";
    move = this._findTwoInRow(board, this.piece) || this._findTwoInRow(board, otherPiece);
    if (move) {
      // This is to make it mutually exclusive with all the
      // following turn logic
    } else if (turn === 1) {
      // find a corner
      move = corners[0];
      
    } else if (turn === 2) {
      // If opponent chose corner, choose center
      // otherwise, choose corner
      for (var i = 0; i < corners.length; i++) {
        if (board.getPiece(corners[i]) !== " ") {
          move = [1, 1];
        }
      }
      if (!move) {
        move = corners[0];
      }
      
    } else if (turn === 3) {
      // If opponent chose center, choose opposite corner
      // If opponent chose corner, choose any corner
      // If opponent chose edge, take center
      if (board.getPiece([1, 1]) !== " ") {
        for (var i = 0; i < corners.length; i++) {
          if (board.getPiece(corners[i]) !== " ") {
            move = [(corners[i][0] + 2) % 4, (corners[i][1] + 2) % 4];
          }
        }
      } else {
        for (var i = 0; i < corners.length; i++) {
          if (board.getPiece(corners[i]) === " ") {
            freeCorners.push(corners[i]);
          }
        }
        if (freeCorners.length === 2) {
          move = freeCorners[0];
        } else {
          move = [1, 1];
        }
      }
      
    } else if (turn === 4) {
      // If the center hasn't been taken by now, take it
      // If opponent has two corner pieces, take an edge to force block
      // If the opponent chose an edge, choose the other edge
      // opposite of the opponent's corner piece
      let takenCorner;
      for (var i = 0; i < corners.length; i++) {
        if (board.getPiece(corners[i]) === " ") {
          freeCorners.push(corners[i]);
        } else {
          takenCorner = corners[i];
        }
      }
      if (board.getPiece([1, 1]) === " ") {
        move = [1, 1];
      } else if (freeCorners.length === 2) {
        move = edges[0];
      } else {
        const edge1 = [(takenCorner[0] + 2) % 3, (takenCorner[1] + 1) % 3];
        const edge2 = [(takenCorner[0] + 1) % 3, (takenCorner[1] + 2) % 3];
        move = board.getPiece(edge1) === " " ?
          edge1 : edge2;
      }
    }
    
    move = move || this._findRandomMove(board);
    
    return this._promisifyMove(move);
  }
}

// MACHINE LEARNING PLAYER ==========================

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

// Good ol' Fisher-Yates Shuffle

function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let i = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[i];
    array[i] = temp;
  }
  return array;
}

Array.prototype.count = function(obj) {
  let counter = 0;
  for (var i = 0; i < this.length; i++) {
    if (this[i] === obj) counter++;
  }
  return counter;
};

module.exports = {
  RandomPlayer,
  MLPlayer,
  EasyPlayer,
  MediumPlayer,
  HardPlayer,
};
