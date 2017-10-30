let readlineSync = require('readline-sync');
let util = require('./util.js');

let n; // height
let m; // width
let mines; // number of mines
let board = []; // rows columns
let display = [];

console.log('Welcome to Minesweeper Game in NodeJS!');

// Get Height
while(!parseInt(n)) {
  n = readlineSync.question('Enter height of grid: ');
}

// Get Width
while(!parseInt(m)) {
  m = readlineSync.question('Enter width of grid: ');
}

// Get Mines
while(!parseInt(mines) || mines < 0 || mines > n*m) {
  mines = parseInt(readlineSync.question(`Enter number of mines (0-${n*m}): `));
}

// console.log(`Initializing ${n}x${m} Grid with ${mines} mines...`);
 
// Create board
for(let i = 0; i < n; i++) {
  board[i] = [];
  for(let j = 0; j < m; j++) {
    board[i][j] = 0;
  }
}

// console.log('Board\n' + util.boardToString(board));

// Create random mines

let minesToPlace = mines;

while(minesToPlace > 0) {
  let x = Math.floor(Math.random() * n);
  let y = Math.floor(Math.random() * m);
  if(board[x][y] === 0) {
    board[x][y] = 'M';
    minesToPlace--;
  }
}

// console.log('Mined Board\n' + util.boardToString(board));

// Map board with numbers for adjacent mines

for(let i = 0; i < n; i++) {
  for(let j = 0; j < m; j++) {
    if(board[i][j] === 0) {
      let adjMines = 0;

      // Get number of adjacent mines
      let checkList = [
        [i-1,j-1],
        [i-1,j],
        [i-1,j+1],
        [i, j-1],
        [i,j+1],
        [i+1,j-1],
        [i+1,j],
        [i+1,j+1]
        ];

      checkList.forEach(tuple => {
        if(!!board[tuple[0]] && board[tuple[0]][tuple[1]] === 'M') {
          adjMines++;
        }
      });
      board[i][j] = adjMines;
    }
  }
}

// console.log('Mapped with adjacent mines numbers\n' + util.boardToString(board));

// Create display for user
// State of each place: 'H' hidden, 'S' shown, 'F' flagged
// if hidden, we display question mark
// if shown, we display number of adjacent mines (board value)
// if flagged, we display 'F'

for(let i = 0; i < n; i++) {
  display[i] = [];
  for(let j = 0; j < m; j++) {
    display[i][j] = 'H';
  }
}

// console.log('Set Up Display Board \n' + util.displayToString(display, board));

// Later, if user selects a place and the place is hidden on display, and mine on board,
// Game Over game state, and show display

while(true) {
  console.log('------------------------------------------------');
  console.log('Total Mines:', mines);
  console.log('Flags Left:', util.getNumFlags(display));
  console.log('Board\n' + util.displayToString(display, board));
  // console.log('Debug Board Values\n' + util.boardToString(board));
  console.log('Commands: quit, flag [row] [col], unflag [row] [col], select [row] [col]');

  let command = readlineSync.question('--> ');
  command = command.split(' ');

  if(command[0] === 'quit') {
    break;
  } else if(command[0] === 'flag') {
    console.log('Flagging', command[1], command[2]);

    let row = parseInt(command[1]);
    let col = parseInt(command[2]);

    if(util.getNumFlags(display) >= mines) {
      console.log('No more flags left...');
      continue;
    }

    if(isNaN(row) || isNaN(col) || row < 0 || row >= n || col < 0 || col > m) {
      console.log('Invalid arguments!');
    } else {
      if(display[row][col] !== 'F') {
        display[row][col] = 'F';

        // Check if game over, after flagging
        if(util.checkEndGame(display, board, mines)) {
          console.log('Congratulations! You\'ve Won!\n' + util.boardToString(board));
          break;
        }
      }
    }

  } else if(command[0] === 'unflag') {
    console.log('Unflagging', command[1], command[2]);

    let row = parseInt(command[1]);
    let col = parseInt(command[2]);

    if(isNaN(row) || isNaN(col) || row < 0 || row >= n || col < 0 || col > m) {
      console.log('Invalid arguments!');
    } else {
      if(display[row][col] === 'F') {
        display[row][col] = 'H';
      }
    }
  } else if(command[0] === 'select') {
    console.log('Selecting', command[1], command[2]);

    let row = parseInt(command[1]);
    let col = parseInt(command[2]);

    if(isNaN(row) || isNaN(col) || row < 0 || row >= n || col < 0 || col > m) {
      console.log('Invalid arguments!');
    } else {
      if(display[row][col] === 'H') {
        util.recurseShowDisplay(display, board, row, col);

        // Check if game over, after selecting
        if(board[row][col] === 'M') {
          console.log('You Lose!\n' + util.boardToString(board));
          break;
        }
      }
    }

  } else {
    console.log('Invalid Input! Please look above to see valid input...');
  }

  console.log('\n\n')
}

console.log('\n\n');
console.log('------------------------------------------------');
console.log('Thanks for playing!\nCheck out huawillian on github for more fun stuff!');
console.log('------------------------------------------------');
console.log('exiting...');
