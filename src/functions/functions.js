function multiply(...values) {
  if (!values.length) return undefined
  return values.reduce((result, value) => result * value)
}

// function divide(...values) {
//   if (!values.length) return undefined
//   return values.reduce((result, value) => result / value)
// }
//
// function sum(...values) {
//   if (!values.length) return undefined
//   return values.reduce((result, value) => result + value)
// }
//
// function compute(callback, ...values) {
//   if (!callback || typeof callback !== 'function') return undefined
//   return callback(...values)
// }

module.exports = {
  multiply,
  // divide,
  // sum,
  // compute,
}
