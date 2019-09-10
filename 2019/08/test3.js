const BigNumber = require("bignumber.js")

// zero-based:
// (still best so far...)
function height(n, m) {
  if (n >= m) return new BigNumber(2).pow(m).minus(1)
  let arr = new Array(n + 1)
    .fill()
    .map((_, i) => new BigNumber(2).pow(i).minus(1))
  for (let i = 1; i <= m; i++) {
    for (let j = Math.min(n, i - 1); j >= Math.max(0, n - m + i); j--) {
      arr[j] = j ? arr[j].plus(arr[j - 1]).plus(1) : new BigNumber(0)
    }
  }
  return arr[n]
}

// the result of this will be some sort of binomial coefficients multiplied
// by the diagonal 2^n - 1 numbers...?

// yet another try...
// function height2(n, m) {
//   if (n >= m) return new BigNumber(2).pow(m).minus(1)
//   let result = binomial(m, n).minus(1)
//   for (let i = 1; i <= n; i++) {
//     result = result.plus(
//       new BigNumber(2)
//         .pow(i)
//         .minus(1)
//         .times(binomial(m - 1 - i, n - i))
//     )
//   }
//   return result
// }

// function binomial(n, k) {
//   let result = new BigNumber(1)
//   for (let i = n - k + 1; i <= n; i++) {
//     result = result.times(i)
//   }
//   for (let i = 2; i <= k; i++) {
//     result = result.div(i)
//   }
//   return result
// }

console.time("time")
console.log(height(477, 500).toString())
console.timeEnd("time")
