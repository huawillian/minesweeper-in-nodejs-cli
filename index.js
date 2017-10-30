let readlineSync = require('readline-sync');
let Minesweeper = require('./scripts/minesweeper.js');

let n; // height
let m; // width
let mines; // number of mines

console.log('Welcome to Minesweeper Game in NodeJS!');

// Get Height
while(!n) 
  n = parseInt(readlineSync.question('Enter height of grid: '));

// Get Width
while(!m)
  m = parseInt(readlineSync.question('Enter width of grid: '));

// Get Mines
while(!mines || mines <= 0 || mines > n*m)
  mines = parseInt(readlineSync.question(`Enter number of mines (1-${n*m}): `));

// Initialize Game
console.log(`Initializing ${n}x${m} Grid with ${mines} mines...`);
let game = new Minesweeper(n, m, mines);

while(true) {
  console.log('------------------------------------------------');
  console.log('Total Mines:', game.numMines);
  console.log('Flags Left:', game.flagsLeft);
  console.log('Board\n' + game.boardDisplayToString());
  // console.log('Debug Board Values\n' + game.boardValuesToString());
  console.log('Commands: quit, flag [row] [col], unflag [row] [col], select [row] [col]');

  let command = readlineSync.question('--> ').split(' ');
  let row = parseInt(command[1]);
  let col = parseInt(command[2]);

  let isWin = false; // check if the return is true after flagging last mine for win
  let isLose = false; // check if the return is true after selecting a mine for lose

  if(command[0] === 'quit') {
    break;
  } else if(command[0] === 'flag') {
    console.log('Flagging', row, col);
    isWin = game.flag(row, col);
  } else if(command[0] === 'unflag') {
    console.log('Unflagging', row, col);
    game.unflag(row, col);
  } else if(command[0] === 'select') {
    console.log('Selecting', row, col);
    isLose = game.select(row, col);
  } else {
    console.log('Invalid Input! Please look above to see valid input...');
  }

  if(isWin) {
    console.log( game.boardValuesToString());
    console.log('Congratulations! You\'ve Won!');
    break;
  }

  if(isLose) {
    console.log(game.boardValuesToString());
    console.log('You Lose!');
    break;
  }
  console.log('\n\n')
}

console.log('\n\n');
console.log('------------------------------------------------');
console.log('Thanks for playing!\nCheck out huawillian on github for more fun stuff!');
console.log('------------------------------------------------');
console.log('exiting...');