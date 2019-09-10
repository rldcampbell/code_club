// "Easy" sudoku solver
// solves sudoku only if there is always a move determined only by row/column elimination
function simpleSolve(sudoku) {
  let nLeft
  while (nLeft !== 0 && nEmpty(sudoku) !== nLeft) {
    nLeft = nEmpty(sudoku)
    for (let n = 1; n < 10; n++) {
      byNumber(n, sudoku)
    }
  }
}

function nEmpty(sudoku) {
  return sudoku.reduce((p, r) => p + r.reduce((q, n) => (n ? q : q + 1), 0), 0)
}

function byNumber(n, sudoku) {
  let rows = []
  let cols = []
  let boxes = []
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const k = boxNumber(i, j)
      if (sudoku[i][j] === n) {
        rows[i] = true
        cols[j] = true
        boxes[k] = true
      }
    }
  }
  for (let k = 0; k < 9; k++) {
    if (boxes[k]) continue // n already appears in this box
    let box = []
    for (let l = 0; l < 9; l++) {
      const i = rowNumber(k, l)
      const j = colNumber(k, l)
      if (!(rows[i] || cols[j] || (sudoku[i][j] && sudoku[i][j] !== n)))
        box.push([i, j])
    }
    if (box.length === 1) {
      const [i, j] = box[0]
      sudoku[i][j] = n
      rows[i] = true
      cols[j] = true
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function boxNumber(i, j) {
  return ~~(i / 3) * 3 + ~~(j / 3)
}

function boxPosition(i, j) {
  return (i % 3) * 3 + (j % 3)
}

function rowNumber(k, l) {
  return ~~(k / 3) * 3 + ~~(l / 3)
}

function colNumber(k, l) {
  return (k % 3) * 3 + (l % 3)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// "BFS" Sudoku Solver
function bruteForceSolve(sudoku) {
  const gaps = unassigned(sudoku)
  const nBlank = gaps.length
  let n = 0
  while (n < nBlank) {
    const [i, j] = gaps[n]
    sudoku[i][j] += 1
    if (sudoku[i][j] > 9) {
      // backtrack
      sudoku[i][j] = 0
      n -= 1
    } else if (isValidMove(sudoku, i, j)) {
      // move on
      n += 1
    }
  }
}

function unassigned(sudoku) {
  const u = []
  sudoku.forEach((row, i) =>
    row.forEach((v, j) => {
      if (!v) u.push([i, j])
    })
  )
  return u
}

function isValidMove(sudoku, i, j) {
  // check that the move at (i, j) was valid
  const n = sudoku[i][j]
  const k = boxNumber(i, j)
  const l = boxPosition(i, j)
  for (let m = 0; m < 9; m++) {
    if (
      (m !== j && sudoku[i][m] === n) ||
      (m !== i && sudoku[m][j] === n) ||
      (m !== l && sudoku[rowNumber(k, m)][colNumber(k, m)] === n)
    )
      return false
  }
  return true
}

// function isValid(sudoku) {
//   // full check that current state of sudoku is valid
//   const rows = [[], [], [], [], [], [], [], [], []]
//   const cols = [[], [], [], [], [], [], [], [], []]
//   const boxes = [[], [], [], [], [], [], [], [], []]
//   for (let i = 0; i < 9; i++) {
//     for (let j = 0; j < 9; j++) {
//       const k = boxNumber(i, j)
//       const v = sudoku[i][j]
//       if (!v) continue
//       if (rows[i][v] || cols[j][v] || boxes[k][v]) return false
//       rows[i][v] = true
//       cols[j][v] = true
//       boxes[k][v] = true
//     }
//   }

//   return true
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const easy1 = [
  [8, 7, 6, 9, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 6, 0, 0, 0],
  [0, 4, 0, 3, 0, 5, 8, 0, 0],
  [4, 0, 0, 0, 0, 0, 2, 1, 0],
  [0, 9, 0, 5, 0, 0, 0, 0, 0],
  [0, 5, 0, 0, 4, 0, 3, 0, 6],
  [0, 2, 9, 0, 0, 0, 0, 0, 8],
  [0, 0, 4, 6, 9, 0, 1, 7, 3],
  [0, 0, 0, 0, 0, 1, 0, 0, 4]
]

const easy2 = [
  [0, 0, 0, 0, 7, 0, 0, 0, 0],
  [0, 0, 0, 5, 0, 0, 0, 9, 0],
  [0, 0, 0, 4, 0, 9, 0, 0, 8],
  [0, 1, 9, 0, 5, 0, 0, 8, 0],
  [2, 0, 0, 6, 1, 0, 7, 0, 9],
  [0, 0, 4, 0, 0, 0, 0, 0, 3],
  [0, 0, 0, 0, 6, 0, 0, 5, 2],
  [0, 8, 0, 7, 0, 0, 9, 0, 0],
  [0, 0, 3, 0, 8, 5, 6, 0, 0]
]

const expert1 = [
  [0, 0, 6, 0, 0, 0, 0, 0, 4],
  [0, 0, 0, 8, 6, 0, 7, 3, 0],
  [0, 4, 0, 3, 5, 0, 0, 0, 2],
  [1, 7, 0, 4, 0, 0, 6, 0, 0],
  [0, 9, 0, 0, 0, 0, 0, 8, 0],
  [0, 0, 8, 0, 0, 6, 0, 1, 7],
  [2, 0, 0, 0, 8, 1, 0, 4, 0],
  [0, 6, 7, 0, 4, 3, 0, 0, 0],
  [8, 0, 0, 0, 0, 0, 3, 0, 0]
]

let s = expert1

console.time("time")
bruteForceSolve(s)
console.timeEnd("time")
console.log(printSudoku(s))
// next step - exclusions in a box mean a number must be in a specific row or column - e.g. only 2 possible for 5
// but both same column, so can rule out this column for other boxes...

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function printSudoku(sudoku) {
  const top = "╔═╤═╤═╦═╤═╤═╦═╤═╤═╗\n"

  const sp1 = "╟─┼─┼─╫─┼─┼─╫─┼─┼─╢\n"

  const sp2 = "╠═╪═╪═╬═╪═╪═╬═╪═╪═╣\n"

  const bot = "╚═╧═╧═╩═╧═╧═╩═╧═╧═╝\n"

  const row = r =>
    [[], r.slice(0, 3), r.slice(3, 6), r.slice(6), []]
      .map(trio => trio.join("│"))
      .join("║") + "\n"

  return (
    top +
    [sudoku.slice(0, 3), sudoku.slice(3, 6), sudoku.slice(6)]
      .map(trio =>
        trio
          .map(r => r.map(v => v || " "))
          .map(row)
          // .join(sp1)
          .join("")
      )
      .join(sp2) +
    bot
  )
}
