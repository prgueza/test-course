import { multiply, divide, sum, compute } from './examples.js'

describe('Multiply function test cases', () => {

  test('Multiply function returns the result of multiplying the arguments', () => {
    const a = 10, b = 2
    const result = multiply(a, b)
    expect(result).toBe(20)
  })

  test.each([
    [80, [ 10, 2, 4 ]],
    [-100, [ -5, 20 ]],
  ])('Multiply function returns %i when passing %p as arguments', (expected, values) => {
    const result = multiply(...values)
    expect(result).toBe(expected)
  })

  test('Multiply function returns undefined if no arguments are passed', () => {
    const result = multiply()
    expect(result).toBeUndefined()
  })
})

describe('Divide function test cases', () => {

  test('Divide function returns the result of dividing the arguments', () => {
    const a = 10, b = 2
    const result = divide(a, b)
    expect(result).toBe(5)
  })

  test.each([
    [2, [ 80, 4, 10 ]],
    [-1, [ -10, 10 ]],
  ])('Divide function returns %s when passing %p as arguments', (expected, values) => {
    const result = divide(...values)
    expect(result).toBe(expected)
  })

  test('Divide function returns undefined if no arguments are passed', () => {
    const result = divide()
    expect(result).toBeUndefined()
  })

})

describe('Sum function test cases', () => {

  test('Sum function returns the result of adding the arguments', () => {
    const a = 10, b = 2
    const result = sum(a, b)
    expect(result).toBe(12)
  })

  test.each([
    [94, [ 80, 4, 10 ]],
    [-8, [ -10, 2 ]],
  ])('Sum function returns %i when passing %p as arguments', (expected, values) => {
    const result = sum(...values)
    expect(result).toBe(expected)
  })

  test('Sum function returns undefined if no arguments are passed', () => {
    const result = sum()
    expect(result).toBeUndefined()
  })

})

describe('Compute function test cases', () => {

  test('Compute function calls the callback function passed as an argument', () => {
    const callback = jest.fn()
    const result = compute(callback)
    expect(callback).toHaveBeenCalled()
  })

  test('Compute function calls the callback function passing on the arguments', () => {
    const a = 10, b = 2
    const callback = jest.fn()
    const result = compute(callback, a, b)
    expect(callback).toHaveBeenCalledWith(a, b)
  })

  test('Compute function returns the callback result', () => {
    const a = 10, b = 2
    const callback = jest.fn((a, b) => `${a}, ${b}`)
    const result = compute(callback, a, b)
    expect(result).toBe('10, 2')
  })

  test('When callback is not a function Compute returns undefined', () => {
    const a = 10, b = 2
    const result = compute('not a function', a, b)
    expect(result).toBeUndefined()
  })

})
