function pathFinder(area) {
  const map = area.split("\n").map(str =>
    str
      .trim()
      .split("")
      .map(s => Number(s))
  )

  const n = map.length
  const target = [n - 1, n - 1]
  const step = stepper(map, target)
  let state = init(n)
  while (!(state.climbers.length === 1 && state.climbers[0].finished)) {
    state = step(state)
  }
  return state.climbers[0].climb
}

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
      .filter(filterBacktrack(climber)) // remove backtrack
      .filter(filterOutOfBounds) // remove out-of-bounds
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

const stepper = (map, target) => {
  const s = split(map, target)
  return state => {
    const bestAt = getVal(state.best)
    const updateBest = setVal(state.best)
    let climbers = state.climbers.reduce((p, c) => {
      const cs = s(c) // split climber
      cs.forEach(c => {
        if (c.finished) {
          p.push(c) // finished climber
        } else if (bestAt(c.last) === undefined || c.climb < bestAt(c.last)) {
          updateBest(c.last, c.climb)
          p.push(c) // only continue if best
        }
      })
      return p
    }, [])
    climbers = climbers
      .filter(underVal(bestAt(target)))
      .filter(bestCurrent(climbers))
    return {
      climbers,
      best: state.best
    }
  }
}

const underVal = val => climber => val === undefined || climber.climb <= val

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
