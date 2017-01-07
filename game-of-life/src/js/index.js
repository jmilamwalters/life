/*
 * Game of Life:
 **/
(function() {

  /*
   * Experimental: state module
   **/
  let stateModule = (function () {
    // private variable
    let state;
    // public object - returned at end of module
    let pub = {};

    pub.changeState = function (newstate) {
      state = newstate;
    };

    pub.getState = function() {
      return state;
    }

    // expose externally
    return pub;
  }());

  function aggrNextGrid(grid, coll = []) {
    const newGrid = _.concat(grid, coll);
    return newGrid;
  }

  /*
   * Stitch together two arrays by increments of pairs; returns new array.
   * @param {Array} arrX - An array to be zipped with its counterpart.
   * @param {Array} arrY - An array to be zipped with its counterpart.
   * @returns {Array}
   **/
  function zip(arrX, arrY) {
    const newArr = arrX.map((item, index) => {
      return [item, arrY[index]];
    });

    return newArr;
  }

  /*
   * Return new array mapping all values in collection q to each item in p.
   **/
  function mapAllToEach(p, q) {
    let arr = [];
    for (let i = 0; i < p.length; i++) {
      for (let k = 0; k < q.length; k++) {
        arr.push([p[i], q[k]]);
      }
    }

    return arr;
  }

  /*
   * Return new array non-inclusive of sub-array p from collection q.
   **/
  function discardFromSet(p, q) {
    let arr = [];
    for (let i = 0; i < q.length; i++) {
      if (arraysEqual(p, q[i])) {
        continue;
      } else {
        arr.push(q[i]);
      }
    }

    return arr;
  }

  /*
   * Return all x-y coordinates within two cells of a given point.
   * @param {Number} x - The point's x coordinate.
   * @param {Number} y - The point's y coordinate.
   * @returns {Array} Array of all x-y coordinates surrounding an
   * x-y coordinate within two cells on a coordinate plane.
   **/
  function getReach(x, y) {
    const arrX = [x - 2, x - 1, x, x + 1, x + 2];
    const arrY = [y - 2, y - 1, y, y + 1, y + 2];
    // let coords = zip(arrX, arrY);
    let coords = mapAllToEach(arrX, arrY);
    coords = discardFromSet([x, y], coords);

    return coords;
  }

  /*
   * Return all x-y coordinates within two cells of a given point.
   * @param {Number} x - The point's x coordinate.
   * @param {Number} y - The point's y coordinate.
   * @returns {Array} Array of all x-y coordinates surrounding an
   * x-y coordinate on a coordinate plane.
   **/
  function getNeighbors(x, y) {
    let arr = [];
    arr = [
      [x, y - 1],
      [x, y + 1],
      [x + 1, y],
      [x + 1, y + 1],
      [x + 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x - 1, y - 1],
    ];

    return arr;
  }

  /*
   * Seed x-y coordinate plane with three adjacent, alive cells.
   **/
  function seedBlinker(n) {
    const arr = [
      [n - 1, n],
      [n, n],
      [n + 1, n],
    ];

    return arr;
  }

  /*
   * Seed grid at random.
   **/
  function seedRandom(rows, cols, odds = 0.5) {
    let arr = [];
    for (let i = 0; i < rows; i++) {
      for (let k = 0; k < cols; k++) {
        const random = Math.random();
        if (random > odds) {
          arr.push([i, k]);
        } else {
          continue;
        }
      }
    }

    return arr;
  }

  /*
   * Returns true if values in two arrays are equivalent; otherwise, false.
   **/
  function arraysEqual(p, q) {
    for (let i = 0; i < p.length; ++i) {
      if (p[i] !== q[i]) return false;
    }

    return true;
  }

  /*
   * Extracts new collection of array pairs from p that also appear in q.
   * @param {Array} p
   * @param {Array} q
   **/
  function extractDuplicates(p, q) {
    let arr = [];
    for (let i = 0; i < p.length; i++) {
      for (let k = 0; k < q.length; k++) {
        if (arraysEqual(p[i], q[k])) {
          arr.push(p[i]);
        } else {
          continue;
        }
      }
    }

    return arr;
  }

  /*
   * Returns a new array of unique items.
   **/
  function resolveDuplicates(arr) {
    let hash = {}, result = [];
    for (let i = 0; i < arr.length; ++i) {
      if (!hash.hasOwnProperty(arr[i])) {
        hash[arr[i]] = true;
        result.push(arr[i]);
      }
    }

    return result;
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
    // stateModule.changeState('changeMe');
    // for every live cell (i.e., point) in our coordinate grid...
    for (let i = 0; i < grid.length; i++) {
      let point = [grid[i][0], grid[i][1]];
      let neighbors = getNeighbors(grid[i][0], grid[i][1]);
      let alive = extractDuplicates(grid, neighbors);

      // Handle cases of reproduction
      // for all neighbors, living and dead
      for (let i = 0; i < neighbors.length; i++) {
        let neighboring = getNeighbors(neighbors[i][0], neighbors[i][1]);
        let living = extractDuplicates(grid, neighboring);
        if (living.length === 3) {
          arr.push([neighbors[i][0], neighbors[i][1]]);
        } else {
          continue;
        }
      }

      // Handle all other cases, i.e., next generation (i.e., 2/3),
      // overpopulation (> 3), and underpopulation (< 2).
      if (alive.length === 3) {
        arr.push([grid[i][0], grid[i][1]]);
        continue;
      } else if (alive.length === 2) {
        arr.push([grid[i][0], grid[i][1]]);
        continue;
      } else {
        continue;
      }
    }

    arr = resolveDuplicates(arr)
    paint(arr);
    // requestAnimationFrame(cb);

    return tick(arr);
  }

  /*
   * Paint canvas using coordinates.
   **/
  function paint(coords) {
    const c = document.getElementById('canvas');
    const ctx = c.getContext('2d');
    // clear previous state
    ctx.clearRect(0, 0, 1000, 1000);
    for (let i = 0; i < coords.length; i++) {
      ctx.fillRect(coords[i][0], coords[i][1], 1, 1)
    }
  }

  /*
   * Invoke life.
   **/
  (function() {
    const grid = seedRandom(10, 10);
    // const grid = seedBlinker(5);
    tick(grid);
  })();
})();
