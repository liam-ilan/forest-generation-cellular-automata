const readline = require('readline');

const treeNumber = 25; // amount of trees to grow

let ourX = 0;
let prevX = -2;
let fullWorld;
const worldWidth = 1000;

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

// generates matrix
function makeWorld(w, h) {
  const world = new Array(h).fill(null);
  world.forEach((item, i) => {
    world[i] = new Array(w).fill(0);
  });
  return world;
}

function spliceMatrix(world, width, inputX) {
  const res = makeWorld(world[0].length, world.length);

  world.forEach((row, y) => {
    world[y].forEach((item, x) => {
      res[y][x] = world[y][x];
    });
  });

  res.forEach((item, y) => {
    res[y] = res[y].slice(inputX, inputX + width);
  });
  return res;
}

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

          // which direction to grow
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

function render(world) {
  // for each row
  world.forEach((row, y) => {
    // turn 1 to full block and 0 to blank space
    let str = row
      .join('')
      .split('1')
      .join('█')
      .split('0')
      .join(' ');

    // record main color
    let color = '';

    // desert floor
    if (y > world.length - 2) {
      color = '\x1b[33m';
      str = str.split(' ').join('█');
    // white stump
    } else if (y > world.length - 5) {
      color = '\x1b[37m';
    // green leaves
    } else {
      color = '\x1b[32m';
    }

    // split row
    str = str.split('');

    // car offsetX in relation to screen
    const offsetX = Math.floor((process.stdout.columns - 3) / 2) - 10;

    // wheels
    if (y === world.length - 2) {
      str[offsetX - 1] = '\x1b[37mô';
      str[offsetX] = ' ';
      str[offsetX + 1] = 'ô\x1b[0m';
    }

    // body and windows
    if (y === world.length - 3) {
      str[(-(prevX - ourX) / Math.abs(prevX - ourX) || 0) + offsetX] = '\x1b[36m█\x1b[0m';
      str[offsetX] = '\x1b[31m█\x1b[0m';
      str[((prevX - ourX) / Math.abs(prevX - ourX) || 0) + offsetX] = '\x1b[31m█\x1b[0m';
    }

    // join row after split
    str = str.join('');

    // log final line
    console.log(color, str, '\x1b[0m'); // eslint-disable-line no-console
  });
}

function init(numTrees) {
  // generate world worldWidth*screenHeight
  fullWorld = makeWorld(worldWidth, process.stdout.rows - 1);

  // place trees at set intervals
  for (let i = 1; i < numTrees + 1; i += 1) {
    fullWorld[fullWorld.length - 1][Math.floor(fullWorld[0].length / 25 + 1) * i] = 1;
  }

  // evolve world 90 times
  for (let i = 0; i < 90; i += 1) {
    fullWorld = evolve(fullWorld);
  }

  // render world
  render(spliceMatrix(fullWorld, process.stdout.columns - 3, ourX));
}

// initialize
init(treeNumber);

// events
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    // do not block ctrl + c to end program
    process.exit();
  } else if (key.name === 'right') {
    // move forward
    if (ourX < worldWidth - (process.stdout.columns - 3)) {
      prevX = ourX;
      ourX += 2;
    }
  } else if (key.name === 'left') {
    // move backward
    if (ourX > 0) {
      prevX = ourX;
      ourX -= 2;
    }
  }
  render(spliceMatrix(fullWorld, process.stdout.columns - 3, ourX));
});
