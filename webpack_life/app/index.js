import 'styles/index.scss'
import _, {compact, concat, isEqual, map, range, reduce} from 'lodash'
import * as R from 'ramda'
import {
  always,
  cond,
  contains,
  equals,
  forEach,
  head,
  inc,
  intersection,
  // map,
  T,
  tail,
  when,
  without,
} from 'ramda'

function neighborhood([x = 0, y = 0] = []) {
  return R.reduce(
    (acc, dx) => concat(acc, map(range(y - 1, y + 2), dy => [dx, dy])),
    [],
    range(x - 1, x + 2)
  )
}

function consGrid(size = 1) {
  return R.reduce(
    (acc, x) => concat(acc, map(range(size), y => [x, y])),
    [],
    range(size)
  )
}

function seedRandom(grid = [], odds = 0.5) {
  return R.reduce(
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

/* 
 * Implementation:
 * If the sum of all nine fields is 3, the inner field state for the next
 * generation will be life (no matter of its previous contents); if the
 * all-field sum is 4, the inner field retains its current state and every other
 * sum sets the inner field to death.  
 **/
function step(world = [], arrIn = []) {
  const arrOut = R.reduce(
    (acc, curr) =>
      cond([
        [equals(3), always([curr, ...acc])],
        [equals(4), () => (contains(curr, arrIn) ? [curr, ...acc] : acc)],
        [T, always(acc)],
      ])(intersection(neighborhood(curr), arrIn).length),
    [],
    world
  )
  paint(arrOut)
  return setTimeout(() => step(world, arrOut), 250)
}

;(() => step(consGrid(25), seedRandom(consGrid(25))))()
