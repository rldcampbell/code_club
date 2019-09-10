const BigNumber = require("bignumber.js")

// function whichFloor(n, m) {
//   const cache = {}

//   return _whichFloor(n, m)

//   function _whichFloor(n, m) {
//     if (n > m) return _whichFloor(m, m)
//     const key = `${n},${m}`
//     if (cache[key] === undefined) {
//       let sum = new BigNumber(0)
//       if (m !== 0 && n !== 0) {
//         for (let i = 0; i < m; i++) {
//           sum = sum.plus(1).plus(_whichFloor(n - 1, i))
//         }
//       }
//       cache[key] = sum
//     }
//     return cache[key]
//   }
// }

// function height(n, m) {
//   const cache = { "0,0": new BigNumber(0) }

//   return h(n, m)

//   function h(n, m) {
//     if (n > m) return h(m, m)
//     if (n === 0) m = 0
//     const key = `${n},${m}`
//     if (cache[key] === undefined) {
//       cache[key] = h(n - 1, m - 1)
//         .plus(h(n, m - 1))
//         .plus(1)
//     }
//     return cache[key]
//   }
// }

function height(n, m) {
  const cache = {
    "0,0": new BigNumber(0),
    "1,1": new BigNumber(1)
  }

  let caches = 0

  // try populating cache from ground up to avoid stack overflow
  // for (let i = 1; i < m; i++) {
  //   if (i % 100 === 0) console.log(`h(${n}, ${i})`)
  //   h(n, i)
  // }

  // for (let i = Math.min(n, m) - 1; i > 0; i--) {
  //   if (i % 100 === 0) console.log(`h(${n - i}, ${m - i})`)
  //   h(n - i, m - i)
  // }

  for (let i = 2; i <= m; i++) {
    for (let j = Math.max(1, n - m + i); j <= n; j++) {
      h(j, i)
    }
  }

  console.log(caches)

  return h(n, m)

  function h(n, m) {
    if (n > m) return h(m, m)
    if (n === 0) m = 0
    const key = `${n},${m}`
    if (!cache[key]) {
      caches++
      cache[key] =
        n === 1
          ? new BigNumber(m)
          : h(n - 1, m - 1)
              .plus(h(n, m - 1))
              .plus(1)
    }
    return cache[key]
  }
}

// now need to 'trampoline'? outside of cache most likely...
// or can build up cache first in reverse order? e.g. height(3, 6)
// cache (3, 1), (3,2), (3,3), (3, 4), (3, 5) and
// cache (1, 4), (2, 5)
// then finally (3, 6) - if done in this order call stack is not
// expanded

let n = 100
let m = 1000
// console.time("how long")
// console.log(n, m, height(n, m).toString())
// console.timeEnd("how long")

// n eggs
// m throws

// note!
// n >= m => 2^n - 1
// Can use to truncate area - maybe not that important?

// function otherWay(n, m) {
//   let arr = new Array(n).fill().map(() => new BigNumber(1))
//   for (let i = 1; i < m; i++) {
//     for (let j = n - 1; j >= Math.max(0, n - m + i); j--) {
//       arr[j] = j ? arr[j].plus(arr[j - 1]).plus(1) : new BigNumber(i + 1)
//     }
//   }
//   return arr[n - 1]
// }

function height(n, m) {
  if (!n || !m) return new BigNumber(0)
  if (n >= m) return new BigNumber(2).pow(m).minus(1)
  let arr = new Array(n)
    .fill()
    .map((_, i) => new BigNumber(2).pow(i + 1).minus(1))
  for (let i = 1; i < m; i++) {
    for (let j = Math.min(n - 1, i - 1); j >= Math.max(0, n - m + i); j--) {
      arr[j] = j ? arr[j].plus(arr[j - 1]).plus(1) : new BigNumber(i + 1)
    }
  }
  return arr[n - 1]
}

console.time("how long 2")
console.log(n, m, height(n, m).toString())
console.timeEnd("how long 2")
