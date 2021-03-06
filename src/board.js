class Board {
  constructor(size) {
    this.size = size;
    this.grid = undefined;
    this.squares = [];
    this.drawInitialBoard();
    this.resetGrid(size);
  }
  
  resetGrid(size) {
    const grid = [];
    for (let i = 0; i < this.size; i++) {
      const row = [];
      for (let j = 0; j < this.size; j++) {
        row.push(" ");
        this.squares[i * 3 + j].innerHTML = "";
      }
      grid.push(row);
    }
    this.grid = grid;
  }
  
  drawInitialBoard() {
    const board = document.getElementById('board');
    const length = board.style.width - 2;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const square = document.createElement('div');
        square.className = `square s${i}${j}`;
        square.style.width = `${Math.floor(length / this.size)}px`;
        square.style.height = `${Math.floor(length / this.size)}px`;
        board.append(square);
        this.squares.push(square);
      }
    }
  }
  
  winner() {
    // rows & col
    for (let i = 0; i < this.size; i++) {
      const row = new Set();
      const col = new Set();
      for (let j = 0; j < this.size; j++) {
        row.add(this.grid[i][j]);
        col.add(this.grid[j][i]);
      }
      if (row.size === 1 && !row.has(" ")) {
        return row.values().next().value;
      }
      if (col.size === 1 && !col.has(" ")) {
        return col.values().next().value;
      }
    }
    
    // diags
    const diag1 = new Set();
    const diag2 = new Set();
    for (let i = 0; i < this.size; i++) {
      diag1.add(this.grid[i][i]);
      diag2.add(this.grid[i][this.size - i - 1]);
    }
    if (diag1.size === 1 && !diag1.has(" ")) {
      return diag1.values().next().value;
    }
    if (diag2.size === 1 && !diag2.has(" ")) {
      return diag2.values().next().value;
    }
    return this.isFull() ? "t" : undefined;
  }
  
  isFull() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === " ") return false;
      }
    }
    return true;
  }
  
  setPiece(pos, piece) {
    if (this.validPos(pos) && this._validPiece(piece)) {
      this.grid[pos[0]][pos[1]] = piece;
    }
    const square = document.querySelector(`.s${pos[0]}${pos[1]}`);
    square.innerHTML = piece;
  }
  
  getPiece(pos) {
    return this.grid[pos[0]][pos[1]];
  }
  
  _validPiece(piece) {
    return piece === "x" || piece === "o";
  }
  
  validPos(pos) {
    return this.getPiece(pos) === " ";
  }
  
  openPositions() {
    // returns array of available positions
    const positions = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === " ") {
          positions.push([i, j]);
        }
      }
    }
    return positions;
  }
}

module.exports = Board;
