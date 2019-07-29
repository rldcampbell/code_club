// randInt :: _ -> Number
const randInt = () => Math.floor(Math.random() * 10)

// randInts :: Number -> [Number]
const randInts = n => new Array(n).fill().map(randInt)

// init :: _ -> State
const init = () => ({
  finished: false,
  index: 0,
  sum0: 0,
  sum1: 0
})

// machine :: [Number] -> State -> State
const machine = vals => state => {
  if (vals[state.index] === undefined)
    return Object.assign({}, state, { finished: true })
  else {
    const newState = { index: state.index + 1, finished: false }
    if (state.sum0 >= state.sum1) {
      newState.sum0 = state.sum0
    } else {
      newState.sum0 = state.sum1
    }
    newState.sum1 = state.sum0 + vals[state.index]
    return newState
  }
}

// run :: [Number] -> Number
const run = vals => {
  const m = machine(vals)
  let state = init()

  while (!state.finished) {
    state = m(state)
  }

  return Math.max(state.sum0, state.sum1)
}

const myInts = randInts(100)

console.log(run(myInts))
