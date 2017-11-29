class Board {
  constructor(size) {
    this.size = size;
    this.grid = this.initializeGrid(size);
    this.checkValidPos = this.checkValidPos.bind(this);
  }
  
  initializeGrid(size) {
    const grid = [];
    for (var i = 0; i < size.length; i++) {
      const row = [];
      for (var i = 0; i < size.length; i++) {
        row.push(" ");
      }
      grid.push(row);
    }
    return grid;
  }
  
  placePiece(pos, piece) {
    this.checkValidPiece(piece);
    this.checkValidPos(pos);
    
    this.grid[pos[1]][pos[0]] = piece;
  }
  
  _checkValidPiece(piece) {
    if (piece !== "x" || piece !== "o") {
      throw "Invalid piece";
    }
  }
  
  _checkValidPos(pos) {
    if (pos[0] < 0 || pos[0] >= this.size
      || pos[1] < 0 || pos[1] >= this.size) {
        throw "Invalid position";
    }
  }
}

export default Board;
