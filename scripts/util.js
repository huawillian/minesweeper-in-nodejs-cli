let getAdjacentIndexes = (i, j) => {
  return [
    [i-1,j-1],
    [i-1,j],
    [i-1,j+1],
    [i, j-1],
    [i,j+1],
    [i+1,j-1],
    [i+1,j],
    [i+1,j+1]
    ];
}

module.exports = {getAdjacentIndexes};