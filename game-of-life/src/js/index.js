/*
 * Game of Life:
 **/
;(function() {
  function aggrNextGrid(grid, coll = []) {
    const newGrid = _.concat(grid, coll)
    return newGrid
  }

  /*
   * Stitch together two arrays by increments of pairs; returns new array.
   * @param {Array} arrX - An array to be zipped with its counterpart.
   * @param {Array} arrY - An array to be zipped with its counterpart.
   * @returns {Array}
   **/
  function zip(arrX, arrY) {
    const newArr = arrX.map((item, index) => {
      return [item, arrY[index]]
    })

    return newArr
  }

  /*
   * Return new array mapping all values in collection q to each item in p.
   **/
  function mapAllToEach(p, q) {
    let arr = []
    for (let i = 0; i < p.length; i++) {
      for (let k = 0; k < q.length; k++) {
        arr.push([p[i], q[k]])
      }
    }

    return arr
  }

  /*
   * Return new array non-inclusive of sub-array p from collection q.
   **/
  function discardFromSet(p, q) {
    let arr = []
    for (let i = 0; i < q.length; i++) {
      if (arraysEqual(p, q[i])) {
        continue
      } else {
        arr.push(q[i])
      }
    }

    return arr
  }

  /*
   * Return all x-y coordinates within two cells of a given point.
   * @param {Number} x - The point's x coordinate.
   * @param {Number} y - The point's y coordinate.
   * @returns {Array} Array of all x-y coordinates surrounding an
   * x-y coordinate within two cells on a coordinate plane.
   **/
  function getReach(x, y) {
    const arrX = [x - 2, x - 1, x, x + 1, x + 2]
    const arrY = [y - 2, y - 1, y, y + 1, y + 2]
    // let coords = zip(arrX, arrY);
    let coords = mapAllToEach(arrX, arrY)
    coords = discardFromSet([x, y], coords)

    return coords
  }

  /*
   * Return all x-y coordinates within two cells of a given point.
   * @param {Number} x - The point's x coordinate.
   * @param {Number} y - The point's y coordinate.
   * @returns {Array} Array of all x-y coordinates surrounding an
   * x-y coordinate on a coordinate plane.
   **/
  function getNeighbors(x, y) {
    let arr = []
    arr = [
      [x, y - 1],
      [x, y + 1],
      [x + 1, y],
      [x + 1, y + 1],
      [x + 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x - 1, y - 1],
    ]

    return arr
  }

  /*
   * Seed x-y coordinate plane with three adjacent, alive cells.
   **/
  function seedBlinker(n) {
    const arr = [[n - 1, n], [n, n], [n + 1, n]]

    return arr
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

  /*
   * Seed grid at random.
   **/
  function seedRandom(rows, cols, odds = 0.5) {
    let arr = []
    for (let i = 0; i < rows; i++) {
      for (let k = 0; k < cols; k++) {
        const random = Math.random()
        if (random > odds) {
          arr.push([i, k])
        } else {
          continue
        }
      }
    }

    return arr
  }

  /*
   * Returns true if values in two arrays are equivalent; otherwise, false.
   **/
  function arraysEqual(p, q) {
    for (let i = 0; i < p.length; ++i) {
      if (p[i] !== q[i]) return false
    }

    return true
  }

  /*
   * Extracts new collection of array pairs from p that also appear in q.
   * @param {Array} p
   * @param {Array} q
   **/
  function extractDuplicates(p, q) {
    let arr = []
    for (let i = 0; i < p.length; i++) {
      for (let k = 0; k < q.length; k++) {
        if (arraysEqual(p[i], q[k])) {
          arr.push(p[i])
        } else {
          continue
        }
      }
    }

    return arr
  }

  /*
   * Returns a new array of unique items.
   **/
  function resolveDuplicates(arr) {
    let hash = {},
      result = []
    for (let i = 0; i < arr.length; ++i) {
      if (!hash.hasOwnProperty(arr[i])) {
        hash[arr[i]] = true
        result.push(arr[i])
      }
    }

    return result
  }

  /*
   * 1. Any live cell with fewer than two live neighbours dies, as if caused by
   *    underpopulation.
   * 2. Any live cell with two or three live neighbours lives on to the next
   *    generation.
   * 3. Any live cell with more than three live neighbours dies, as if by
   *    overpopulation.
   * 4. Any dead cell with exactly three live neighbours becomes a live cell,
   *    as if by reproduction.
   */
  function tick(grid) {
    let arr = []

    // For every live cell (i.e., point) in our coordinate grid...
    for (let i = 0; i < grid.length; i++) {
      let point = [grid[i][0], grid[i][1]]
      let neighbors = getNeighbors(grid[i][0], grid[i][1])
      let alive = extractDuplicates(grid, neighbors)

      // Handle cases of reproduction
      // for all neighbors, living and dead
      for (let i = 0; i < neighbors.length; i++) {
        let neighboring = getNeighbors(neighbors[i][0], neighbors[i][1])
        let living = extractDuplicates(grid, neighboring)
        if (living.length === 3) {
          arr.push([neighbors[i][0], neighbors[i][1]])
        } else {
          continue
        }
      }

      // Handle all other cases, i.e., next generation (i.e., 2/3),
      // overpopulation (> 3), and underpopulation (< 2).
      if (alive.length === 3) {
        arr.push([grid[i][0], grid[i][1]])
        continue
      } else if (alive.length === 2) {
        arr.push([grid[i][0], grid[i][1]])
        continue
      } else {
        continue
      }
    }

    arr = resolveDuplicates(arr)
    paint(arr)
    // requestAnimationFrame(cb);

    requestAnimationFrame(() => tick(arr))
    // setTimeout(() => {
    //     tick(arr)
    // }, 100)
  }

  /*
   * Paint canvas using coordinates.
   **/
  function paint(coords) {
    const c = document.getElementById('canvas')
    const ctx = c.getContext('2d')
    // clear previous state
    ctx.clearRect(0, 0, 1512, 1512)
    for (let i = 0; i < coords.length; i++) {
      ctx.fillRect(coords[i][0] * 10, coords[i][1] * 10, 1 * 10, 1 * 10)
    }
  }

  /*
   * Invoke life.
   **/
  ;(function() {
    // const grid = seedRandom(50, 50)
    const grid = seedGosperGlidingGun()
    // const grid = seedBlinker(5);
    return tick(grid)
  })()
})()
