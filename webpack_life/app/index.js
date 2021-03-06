import 'styles/index.scss'
import _, {intersectionBy, isEqual} from 'lodash/fp'
import {
  always,
  concat,
  cond,
  contains,
  equals,
  forEach,
  head,
  inc,
  intersection,
  last,
  map,
  range,
  reduce,
  T,
  tail,
  uniq,
} from 'ramda'

const measureTime = (name, func) => {
  console.time(name)
  const results = func()
  console.timeEnd(name)

  return results
}

function seedGosperGlidingGun() {
  return [
    [1, 5],
    [1, 6],
    [2, 5],
    [2, 6],
    [11, 5],
    [11, 6],
    [11, 7],
    [12, 4],
    [12, 8],
    [13, 3],
    [13, 9],
    [14, 3],
    [14, 9],
    [15, 6],
    [16, 4],
    [16, 8],
    [17, 5],
    [17, 6],
    [17, 7],
    [18, 6],
    [21, 3],
    [21, 4],
    [21, 5],
    [22, 3],
    [22, 4],
    [22, 5],
    [23, 2],
    [23, 6],
    [25, 1],
    [25, 2],
    [25, 6],
    [25, 7],
    [35, 3],
    [35, 4],
    [36, 3],
    [36, 4],
    // Random cells
    // If you wait enough time these will eventually take part
    // in destroying the glider gun, and the simulation will be in a "static" state.
    [60, 44],
    [61, 44],
    [62, 44],
    [60, 47],
    [61, 47],
    [62, 47],
    [60, 48],
    [61, 48],
    [62, 48],
    [60, 49],
    [61, 49],
    [62, 49],
    [60, 51],
    [61, 51],
    [62, 51],
    [60, 52],
    [61, 52],
    [62, 52],
  ]
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

function paint(arrIn = [], w = 8) {
  const context = document.getElementById('canvas').getContext('2d')
  context.clearRect(0, 0, 1512, 1512)
  return forEach(
    cell => context.fillRect(head(cell) * w, tail(cell) * w, 1 * w, 1 * w),
    arrIn
  )
}

// function unique(arr = []) {
//   let hash = {}
//   let result = []

//   for (let i = 0; i < arr.length; ++i) {
//     if (!hash.hasOwnProperty(arr[i])) {
//       hash[arr[i]] = true
//       result.push(arr[i])
//     }
//   }

//   return result
// }

// function unique(arr = []) {
//   let hash = {}
//   return reduce(
//     (acc, val) => {
//       if (!hash.hasOwnProperty(val)) {
//         hash[val] = true
//         return [...acc, val]
//       }
//       return acc
//     },
//     [],
//     arr
//   )
// }

function unique(arr = []) {
  return last(
    reduce(
      (acc, val) =>
        !head(acc).hasOwnProperty(val)
          ? [{...head(acc), [val]: true}, [...last(acc), val]]
          : acc,
      [{}, []],
      arr
    )
  )
}

// function intersectionLength(arrOne = [], arrTwo = []) {
//   let result = []
//   for (let i = 0; i < arrOne.length; i++) {
//     const [x1, y1] = arrOne[i]

//     for (let j = 0; j < arrTwo.length; j++) {
//       const [x2, y2] = arrTwo[j]

//       if (x1 === x2 && y1 === y2) {
//         result.push([x1, y1])
//       }
//     }
//   }

//   return result.length
// }

function intersectionLength(arrOne = [], arrTwo = []) {
  return reduce(
    (acc, [x1, y1]) =>
      acc +
      reduce(
        (innerAcc, [x2, y2]) =>
          x1 === x2 && y1 === y2 ? inc(innerAcc) : innerAcc,
        0,
        arrTwo
      ),
    0,
    arrOne
  )
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

function step(arrIn = []) {
  const arrOut = reduce(
    (acc, curr) =>
      cond([
        [equals(3), always([curr, ...acc])],
        [equals(4), () => (contains(curr, arrIn) ? [curr, ...acc] : acc)],
        [T, always(acc)],
        // ])(intersection(neighborhood(curr), arrIn).length),
      ])(intersectionLength(neighborhood(curr), arrIn)),
    [],
    // uniq(reduce((acc, curr) => [...acc, ...neighborhood(curr)], [], arrIn))
    unique(reduce((acc, curr) => [...acc, ...neighborhood(curr)], [], arrIn))
  )
  paint(arrOut)
  return requestAnimationFrame(() => step(arrOut))
}

;(() => step(seedGosperGlidingGun()))()
