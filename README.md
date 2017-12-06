## Machine-Learning TTT

![sample image](https://github.com/hanhee-song/machine-learning-ttt/blob/master/docs/Screen%20Shot%202017-12-05%20at%2023.18.44.png?raw=true)

[Live Site](https://hanhee-song.github.io/machine-learning-ttt/)

This TTT AI is built on the basic principles of machine learning and combines dynamic programming with flexible OOP to create a highly customizable AI.

### How it learns

It starts off knowing nothing about the game except for two rules: it can only put its pieces in one of nine squares, and it can't put its piece on top of another.

Because it's never seen the game before, it first attempts to randomly place pieces on the board. Every time it places pieces, it remembers what the board looked like and where it went.
```JavaScript
makeMove(board) {
  // ...
  if (!this.brain.has(boardStr)) {
    move = this._findRandomMove(board);
  }
  // ...
  this.currentGameMemory.push([boardStr, moveState]);
  // ...
}
```

When the game ends, the AI is alerted to the result. It will calculate a value based on the result - for example, losing after 3 moves and having a loseFactor of -2 would cause it to associate the three moves with values of -2, -4, and -10, respectively. It will store these values into its brain.

```JavaScript
this.currentGameMemory.forEach((arr, i) => {
  // calculate val...
  this.brain.add(board, move, val);
});
```

The ```Brain``` class is a simple wrapper for an object. All the board states are stored as keys, and the values are hash tables with moves as keys and the associated values as values.

```JavaScript
class Brain {
  constructor() {
    this.memory = {};
    this.factorCap = 50;
  }
  
  add(board, move, val) {
    // ...
    this.memory[board][move] = Math.min(this.memory[board][move] + val, this.factorCap);
    // ...
  }
  //...
}
```

As it makes moves, it learns over time to avoid move with a historically low value and prefer moves with a high value.
* If it sees at least one good move, it will explore by randomly choosing one, with a higher chance of picking the one with more success.
* If all moves have negative values, it will regress and choose the safest move every time, even if the safest move is not necessarily the best. Regressive behavior can be observed by matching it against the Hard AI - it will lose roughly 100-400 times before learning to repeat a set of safe actions.

### Bonus

The Hard AI is not a perfect AI. When a ML AI with reward values of ```{ win: 5, tie: -1, lose: -1 }``` is matched against the hard AI, the ML AI will learn to aggressively exploit loopholes in the Hard AI's logic and achieve a win rate of ~30%.

When two ML players with similar reward values are matched, they quickly achieve a Nash equilibrium, usually within ~200 games.
