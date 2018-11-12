// record itteration
let iteration = 0;

// Returns a 2 dimensional, 0 filled array, based on a specified width and height.
function makeWorld(w, h) {
  const world = new Array(h).fill(null);
  world.forEach((item, i) => {
    world[i] = new Array(w).fill(0);
  });
  return world;
}

// Gets the current world, runs a generation, and returns the next world.
function evolve(world) {
  // init res
  const res = makeWorld(world[0].length, world.length);

  // set res to world without refrencing problems.
  world.forEach((row, y) => {
    world[y].forEach((point, x) => {
      res[y][x] = world[y][x];
    });
  });

  // record which collum has growed here
  const collumGrowed = new Array(world[0].length).fill(false);

  // run on every pixel
  world.forEach((row, y) => {
    world[y].forEach((point, x) => {
      // if not on edge
      if (y > 0 && y < world.length && x > 0 && x < world[y].length) {
        // if cell is living, and collum has not grown yet.
        if (world[y][x] === 1 && collumGrowed[x] === false) {
          // This collum has grown
          collumGrowed[x] = true;

          // calculate chance for horizontal movement
          const horzChance = (world.length - 1 - y) / 30;

          // witch direction to grow
          // there is a [horzchance]% chance to grow right or left
          // there is a [(1 - horzChance) * 0.125]% chance to grow up
          if (Math.random() < horzChance) {
            res[y][x + 1] = 1;
          }
          if (Math.random() < horzChance) {
            res[y][x - 1] = 1;
          }

          if (Math.random() < (1 - horzChance) * 0.125) {
            res[y - 1][x] = 1;
          }
        }
      }
    });
  });

  return res;
}

// render world
function render(world) {
  world.forEach((row, y) => {
    const str = row.join('').split('1').join('█').split('0')
      .join(' ');
    const colors = [];
    if (y > world.length - 5) {
      colors.push('\x1b[37m');
      colors.push('\x1b[0m');
    } else {
      colors.push('\x1b[32m');
      colors.push('\x1b[0m');
    }
    console.log(colors[0], str, colors[1]); // eslint-disable-line no-console
  });
}

// animate world
function animate(interval, input, times) {
  iteration += 1;
  let world = input;
  world = evolve(world);
  render(world);

  if (iteration < times || times === undefined) {
    setTimeout(() => {
      animate(interval, world, times);
    }, interval);
  }
}

// make a world
const world = makeWorld(process.stdout.columns - 2, process.stdout.rows - 1);

for (let i = 1; i < (parseInt(process.argv[2], 10)) + 1; i += 1) {
  const y = world.length - 1;
  const x = Math.floor(world[0].length / (parseInt(process.argv[2], 10) + 1)) * i;
  world[y][x] = 1;
}

if (process.argv[2] !== undefined) {
  animate(100, world, 90);
} else {
  console.log('Error: please give a number'); // eslint-disable-line no-console
}
