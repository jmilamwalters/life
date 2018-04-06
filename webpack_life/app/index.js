import 'styles/index.scss'
import {
  always,
  concat,
  cond,
  contains,
  equals,
  forEach,
  head,
  intersection,
  map,
  range,
  reduce,
  T,
  tail,
} from 'ramda'

const measureTime = (name, func) => {
  console.time(name)
  const results = func()
  console.timeEnd(name)

  return results
}

function neighborhood([x = 0, y = 0] = []) {
  return reduce(
    (acc, dx) => concat(acc, map(dy => [dx, dy], range(y - 1, y + 2))),
    [],
    range(x - 1, x + 2)
  )
}

function neighbors(cell = ([x = 0, y = 0] = [])) {
  return without([cell], neighborhood(cell))
}

function consGrid(size = 1) {
  return reduce(
    (acc, x) => concat(acc, map(y => [x, y], range(0, size))),
    [],
    range(0, size)
  )
}

function seedRandom(grid = [], odds = 0.5) {
  return reduce(
    (acc, [x, y]) => (Math.random() > odds ? [[x, y], ...acc] : acc),
    [],
    grid
  )
}

function paint(arrIn = [], w = 10) {
  const context = document.getElementById('canvas').getContext('2d')
  context.clearRect(0, 0, 1000, 1000)
  return forEach(
    cell => context.fillRect(head(cell) * w, tail(cell) * w, 1 * w, 1 * w),
    arrIn
  )
}

function resolveDuplicates(arr = []) {
  let hash = {}
  let result = []

  for (let i = 0; i < arr.length; ++i) {
    if (!hash.hasOwnProperty(arr[i])) {
      hash[arr[i]] = true
      result.push(arr[i])
    }
  }

  return result
}

// function step(world = [], arrIn = []) {
//   const arrOut = reduce(
//     (acc, curr) =>
//       cond([
//         [equals(3), always([curr, ...acc])],
//         [equals(4), () => (contains(curr, arrIn) ? [curr, ...acc] : acc)],
//         [T, always(acc)],
//       ])(intersection(neighborhood(curr), arrIn).length),
//     [],
//     world
//   )
//   paint(arrOut)
//   // return requestAnimationFrame(() => step(world, arrOut))
//   return requestAnimationFrame(() =>
//     measureTime('step', () => step(world, arrOut))
//   )
// }

// function step(world = [], arrIn = []) {
function step(arrIn = []) {
  const cellsToEval = resolveDuplicates(
    reduce((acc, curr) => [...acc, ...neighborhood(curr)], [], arrIn)
  )
  const arrOut = reduce(
    (acc, curr) =>
      cond([
        [equals(3), always([curr, ...acc])],
        [equals(4), () => (contains(curr, arrIn) ? [curr, ...acc] : acc)],
        [T, always(acc)],
      ])(intersection(neighborhood(curr), arrIn).length),
    [],
    // world
    cellsToEval
  )
  paint(arrOut)
  // return requestAnimationFrame(() => step(world, arrOut))
  return requestAnimationFrame(() =>
    // measureTime('step', () => step(world, arrOut))
    measureTime('step', () => step(arrOut))
  )
}

// ;(() => step(consGrid(25), seedRandom(consGrid(25))))()
;(() => step(seedRandom(consGrid(25))))()
