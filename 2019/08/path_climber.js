const randIntGenerator = (min, max) => () =>
  min + Math.floor(Math.random() * (1 + max - min))

const randInt = randIntGenerator(0, 9)

const someRand = () => (Math.random() > 0.5 ? randInt() : 0)

const generateMap = (n, filler = () => {}) =>
  new Array(n).fill().map(() => new Array(n).fill().map(filler))

const init = n => ({
  climbers: [
    {
      climb: 0,
      path: [],
      finished: false,
      last: [0, 0]
    }
  ],
  best: generateMap(n) // empty map to store best scores at each point
})

const printClimber = (climber, i) => `climber: ${i}
position: ${climber.last}
path: ${climber.path.join("|")}
steps: ${climber.path.length}
climb: ${climber.climb}
finished: ${climber.finished}
`

const printClimbers = climbers => climbers.map(printClimber).join("\n")

const getVal = map => coords => map[coords[0]][coords[1]]
const setVal = map => (coords, val) => (map[coords[0]][coords[1]] = val)

const split = (map, target) => {
  const n = map.length
  const height = getVal(map)
  const filterOutOfBounds = filterBoundary(n)
  return climber => {
    const lp = climber.last
    if (equal(target, lp)) {
      climber.finished = true
      climber.path.push(lp)
      return [climber]
    }
    return [
      [lp[0] - 1, lp[1]],
      [lp[0], lp[1] - 1],
      [lp[0] + 1, lp[1]],
      [lp[0], lp[1] + 1]
    ]
      .filter(filterOutOfBounds) // remove out-of-bounds
      .filter(filterBacktrack(climber)) // remove backtrack
      .filter(filterAdjacent(climber)) // remove running adjacent to self
      .map(c => ({
        path: climber.path.concat([climber.last]),
        climb: climber.climb + Math.abs(height(c) - height(lp)),
        last: c,
        finished: false
      }))
  }
}

// can't go out of bounds
const filterBoundary = n => coords =>
  coords[0] >= 0 && coords[0] < n && coords[1] >= 0 && coords[1] < n

const equal = (a, b) => a[0] === b[0] && a[1] === b[1]

// can't go back on itself
const filterBacktrack = climber => coords => {
  const { path } = climber
  const len = path.length
  return !(len > 0 && equal(path[len - 1], coords))
}

const diffEquals = n => (a, b) => Math.abs(a - b) === n

const diffEquals1 = diffEquals(1)

const adjacent = (a, b) =>
  (a[0] === b[0] && diffEquals1(a[1], b[1])) ||
  (a[1] === b[1] && diffEquals1(a[0], b[0]))

// can't return to be adjacent to own path
const filterAdjacent = climber => coords =>
  !climber.path.some(point => adjacent(point, coords))

const stepper = (map, target) => {
  const s = split(map, target)
  return state => {
    const bestAt = getVal(state.best)
    const updateBest = setVal(state.best)
    let climbers, tails
    ;({ climbers, tails } = state.climbers.reduce(
      (p, c) => {
        const cs = s(c) // split climber
        cs.forEach(c => {
          if (c.finished) {
            p.climbers.push(c) // finished climber
          } else if (bestAt(c.last) === undefined || c.climb < bestAt(c.last)) {
            updateBest(c.last, c.climb)
            p.climbers.push(c) // only continue if best
            p.tails.push(c.last)
          }
        })
        return p
      },
      { climbers: [], tails: [] }
    ))
    climbers = climbers
      .filter(underVal(bestAt(target)))
      .filter(notCrossed(tails))
      .filter(bestCurrent(climbers))
    return {
      climbers,
      best: state.best
    }
  }
}

const underVal = val => climber => val === undefined || climber.climb <= val

const bothWith = (a, b, comparator) =>
  a.some(aVal => b.some(bVal => comparator(aVal, bVal)))

const notCrossed = tails => climber => !bothWith(tails, climber.path, equal)

const bestCurrent = climbers => {
  let bests = climbers.reduce((p, c) => {
    const key = JSON.stringify(c.last)
    p[key] = Math.min(
      c.climb,
      p[key] === undefined ? Number.MAX_SAFE_INTEGER : p[key]
    )
    return p
  }, {})

  return climber => {
    const key = JSON.stringify(climber.last)
    if (bests[key] !== undefined && bests[key] === climber.climb) {
      delete bests[key]
      return true
    }
    return false
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const printMap = map =>
  map
    .map(row => row.map(v => (v === undefined ? " " : v)).join("|"))
    .join("\n") + "\n"

const inverse = str => `\x1b[30m\x1b[47m${str}\x1b[0m`
const green = str => `\x1b[32m${str}\x1b[0m`

const printMapWithPath = (map, points) => {
  const print = map.map(row => row.map(v => (v === undefined ? " " : `${v}`)))
  points.forEach(p => {
    print[p[0]][p[1]] = green(print[p[0]][p[1]])
  })
  return print.map(row => row.join("|")).join("\n") + "\n"
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const exec = (map, verbose) => {
  const n = map.length
  const target = [n - 1, n - 1]
  const step = stepper(map, target)
  let state = init(n)
  // console.log(printMap(map))
  while (!(state.climbers.length === 1 && state.climbers[0].finished)) {
    // console.log(printMap(state.best))
    // console.log(printClimbers(state.climbers))
    state = step(state)
  }
  if (verbose) {
    console.log(printMapWithPath(map, state.climbers[0].path))
  }
  return state.climbers[0].climb
}

////////////////////////

const alpinistTestCases = [
  [
    [
      `000
    000
    000`
    ],
    0,
    "completely flat"
  ],
  [
    [
      `010
    010
    010`
    ],
    2,
    "couple of bumps 1"
  ],
  [
    [
      `010
    101
    010`
    ],
    4,
    "couple of bumps 2"
  ],
  [
    [
      `0707
    7070
    0707
    7070`
    ],
    42,
    "the answer"
  ],
  [
    [
      `700000
    077770
    077770
    077770
    077770
    000007`
    ],
    14,
    "stay away from the middle"
  ],
  [
    [
      `777000
    007000
    007000
    007000
    007000
    007777`
    ],
    0,
    "dont go down"
  ],
  [
    [
      `000000
    000000
    000000
    000010
    000109
    001010`
    ],
    4,
    "avoid the nine"
  ],
  [
    [
      `555555555
000000005
555555555
500000000
555555555
000000005
555555555
500000000
555555555`
    ],
    0,
    "squiggle"
  ],
  [
    [
      `1111111111111
0000000000001
1111111111101
1000000000101
1011111110101
1010000010101
1010111110101
1010100000101
1010111111101
1010000000001
1011111111111
1000000000000
1111111111111`
    ],
    0,
    "spiral"
  ]
]

const execTest = ([map, expected, name]) => {
  map = map[0].split("\n").map(str =>
    str
      .trim()
      .split("")
      .map(s => Number(s))
  )

  const output = exec(map, true)

  if (output === expected) return true
  else {
    console.log(
      `Failed test ${name}. Expected ${expected}, returned ${output}.`
    )
    return false
  }
}

const execTests = tests => {
  if (!tests.map(execTest).includes(false)) console.log("All Passed")
}

// execTests(alpinistTestCases)

const map = generateMap(100, someRand)

console.time("process")
console.log(exec(map, true))
console.timeEnd("process")
