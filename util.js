let boardToString = (board) => 
  board.map(row => row.join(' ')).join('\n');

let displayToString = (display, board) => {
  return display.map((row, i) => 
    row.map((v, j) => {
    if(v === 'H') {
      return '?';
    } else if(v === 'S') {
      return board[i][j];
    } else if(v === 'F') {
      return 'F';
    }
  }).join(' ')).join('\n')
};

let recurseShowDisplay = (display, board, i, j) => {
  if(display[i] === undefined || !!display[i][j] === undefined) return;
  if(board[i][j] === 'M' || display[i][j] === 'F' || display[i][j] === 'S') return;

  display[i][j] = 'S';

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
      if(board[tuple[0]] !== undefined && board[tuple[0]][tuple[1]] === 0) {
        recurseShowDisplay(display, board, tuple[0], tuple[1]);
      } else if(board[tuple[0]] !== undefined  && board[tuple[0]][tuple[1]] > 0 && board[tuple[0]][tuple[1]] !== 'M') {
        display[tuple[0]][tuple[1]] = 'S';
      }
    });
}

let checkEndGame = (display, board, mines) => {
  let minesFound = 0;

  for(let i = 0; i < display.length; i++) {
    for(let j = 0; j < display[0].length; j++) {
      if(board[i][j] === 'M' && display[i][j] === 'F') minesFound++;
      if(board[i][j] === 'M' && display[i][j] === 'H') return false;
    }
  }

  console.log(minesFound, mines);

  return minesFound === mines;
}

let getNumFlags = (display) => {
  let result = 0;
  display.forEach(row => {
    row.forEach(v => {
      if(v === 'F') result++;
    })
  });
  return result; 
}

module.exports = {boardToString, displayToString, recurseShowDisplay, checkEndGame, getNumFlags};