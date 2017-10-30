let util = require('./util.js');

class Minesweeper {
  constructor(m, n, mines) {
    this.board = [];
    this.m = m;
    this.n = n;
    this.numMines = mines;
    this.flagsLeft = mines;

    // Initialize the board
    for(let i = 0; i < n; i++) {
      this.board[i] = [];
      for(let j = 0; j < m; j++) {
        this.board[i][j] = new Block();
      }
    }

    // Create random mines
    while(mines > 0) {
      let x = Math.floor(Math.random() * n);
      let y = Math.floor(Math.random() * m);
      if(this.board[x][y].value === 0) {
        this.board[x][y].value = 'mine';
        mines--;
      }
    }

    // Map board with numbers for adjacent mines
    for(let i = 0; i < n; i++) {
      for(let j = 0; j < m; j++) {
        if(this.board[i][j].value === 0) {
          let adjMines = 0;
          // Adjacent indexes
          let checkList = util.getAdjacentIndexes(i, j);
          checkList.forEach(tuple => {
            if(!!this.board[tuple[0]] 
              && !!this.board[tuple[0]][tuple[1]] 
              && this.board[tuple[0]][tuple[1]].value === 'mine') {
              adjMines++;
            }
          });
          // Update value with adjacent mines
          this.board[i][j].value = adjMines;
        }
      }
    }
  }

  // Display to user for the CLI
  boardDisplayToString() {
    return this.board.map(row => {
      return row.map(block => {
        if(block.state === 'hidden') {
          return '?';
        } else if(block.state === 'shown') {
          return block.value;
        } else if(block.state === 'flagged') {
          return 'F';
        }
      }).join(' ');
    }).join('\n');
  }

  // Debug values
  boardValuesToString() {
    return this.board.map(row => {
      return row.map(block => {
        if(block.value === 'mine') {
          return 'M';
        } else {
          return block.value;
        }
      }).join(' ');
    }).join('\n');
  }

  // Flag block
  flag(row, col) {
    if(this.flagsLeft === 0)
      return console.log('No more flags left...');

    if(!this.isValidIndex(row, col)) 
      return console.log('Invalid arguments!');

    if(this.board[row][col].state !== 'flagged') {
      this.board[row][col].state = 'flagged';
      this.flagsLeft--;
    }
    
    // Check if game over, after flagging
    return this.checkEndGame();
  }

  // Unflag block
  unflag(row, col) {
    if(!this.isValidIndex(row, col)) 
      return console.log('Invalid arguments!');

    if(this.board[row][col].state === 'flagged') {
      this.board[row][col].state = 'hidden';
      this.flagsLeft++;
    }
  }

  // Select block
  select(row, col) {
    if(!this.isValidIndex(row, col)) 
      return console.log('Invalid arguments!');

    if(this.board[row][col].state === 'hidden') {
      this.recurseShowDisplay(row, col);
      
      // Check if game over, after selecting
      if(this.board[row][col].value === 'mine')
        return true;
    }
  }

  // Check valid row and col
  isValidIndex(row, col) {
    return !(isNaN(row) || isNaN(col) || row < 0 || row >= this.n || col < 0 || col > this.m);
  }

  // Check if all flags are on all mines
  checkEndGame() {
    let minesFound = 0;
    for(let i = 0; i < this.n; i++) {
      for(let j = 0; j < this.m; j++) {
        if(this.board[i][j].value === 'mine' && this.board[i][j].state === 'flagged') minesFound++;
        if(this.board[i][j].value === 'mine' && this.board[i][j].value === 'hidden') return false;
      }
    }
    return minesFound === this.numMines;
  }

  recurseShowDisplay(i, j) {
    if(!this.board[i] || !this.board[i][j] || this.board[i][j].value === undefined) return;
    if(this.board[i][j].value === 'mine' || this.board[i][j].state === 'flagged' || this.board[i][j].state === 'shown') return;

    this.board[i][j].state = 'shown';
    let checkList = util.getAdjacentIndexes(i, j);
    checkList.forEach(tuple => {
      if(this.board[i] && this.board[i][j]) {
        if(this.board[i][j].value === 0) {
          this.recurseShowDisplay(tuple[0], tuple[1]);
        } else if(this.board[i][j].value > 0 && this.board[i][j].value !== 'mine') {
          this.board[i][j].state = 'shown';
        }
      }
    });
  }
}

// Each element in the grid is a block
// value is either mine or number of adjacent mines
// state is used to display to user with either, hidden, shown, or flagged
class Block {
  constructor(value = 0, state = 'hidden') {
    this.value = value;
    this.state = state;
  }
}

module.exports = Minesweeper;