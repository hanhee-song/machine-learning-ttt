import { RandomPlayer, AIPlayer } from './player.js';

class Board {
  constructor() {
    this.grid = this.initializeGrid;
  }
  
  initializeGrid() {
    return [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "]
    ];
  }
}
