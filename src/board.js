class Board {
  constructor(size) {
    this.size = size;
    this.grid = this.initializeGrid(size);
  }
  
  initializeGrid(size) {
    const grid = [];
    for (var i = 0; i < this.size; i++) {
      const row = [];
      for (var j = 0; j < this.size; j++) {
        row.push("");
      }
      grid.push(row);
    }
    return grid;
  }
  
  drawInitialBoard() {
    const board = document.getElementById('board');
    const length = board.style.width - 2;
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        const square = document.createElement('div');
        square.className = `square ${i}-${j}`;
        square.style.width = `${Math.floor(length / this.size)}px`;
        square.style.height = `${Math.floor(length / this.size)}px`;
        board.append(square);
      }
    }
  }
  
  winner() {
    // rows & col
    for (var i = 0; i < this.size; i++) {
      const row = new Set();
      const col = new Set();
      for (var j = 0; j < this.size; j++) {
        row.add(this.grid[i][j]);
        col.add(this.grid[j][i]);
      }
      if (row.length === 1 && !row.has("")) {
        return row.values().next().value;
      }
      if (col.length === 1 && !col.has("")) {
        return row.values().next().value;
      }
    }
    
    // diags
    const diag1 = new Set();
    const diag2 = new Set();
    for (var i = 0; i < this.size; i++) {
      diag1.add(this.grid[i][i]);
      diag2.add(this.grid[i][this.size - i]);
    }
    if (diag1.length === 1 && !diag1.has("")) {
      return diag1.values().next().value;
    }
    if (diag2.length === 1 && !diag2.has("")) {
      return diag2.values().next().value;
    }
    
    return this.isBoardFull() ? "t" : undefined;
  }
  
  isBoardFull() {
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        if (this.board[i][j] === "") return false;
      }
    }
    return true;
  }
  
  placePiece(pos, piece) {
    this._checkValidPiece(piece);
    this.checkValidPos(pos);
    
    this.grid[pos[1]][pos[0]] = piece;
  }
  
  _checkValidPiece(piece) {
    if (piece !== "x" || piece !== "o") {
      throw "Invalid piece";
    }
  }
  
  checkValidPos(pos) {
    if ( this.openPositions().has(pos)
      || pos[0] < 0 || pos[0] >= this.size
      || pos[1] < 0 || pos[1] >= this.size) {
        throw "Invalid position";
    }
  }
  
  openPositions() {
    // returns set of available positions
    
  }
}

module.exports = Board;
