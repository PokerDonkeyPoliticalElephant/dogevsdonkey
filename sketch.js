let doge, donkey, moneySymbols, obstacles, tinyFaceEnemies;
let level = 1;
let score = 0;
let totalMoney = 0;
let collectedMoney = 0;
let donkeyCollectedMoney = 0;
let moneyForBonus = 0;
let messages = [
  "No more DEI llama training in Borneo!",
  "Woke contract cancelled!",
  "Gender-neutral bathrooms for penguins? Denied!",
  "Microaggression workshops for squirrels—vetoed!",
  "Mandatory pronoun classes for fish—gone!",
  "Woke contract cancelled!",
  "DEI consultant for Mars rovers? Nope!",
  "Safe spaces for jellyfish—cancelled!",
  "Equity training for mountain goats—out!",
  "Woke contract cancelled!",
  "Pronoun seminars for cacti—axed!",
  "DEI training for Antarctic ice—melted!",
  "Woke budget for moon rocks—denied!",
  "Safe spaces for asteroids—not today!",
  "Equity audits for deep-sea vents—sunk!",
  "Woke contract cancelled!",
  "Gender studies for coral reefs—coralled!",
  "DEI workshops for desert lizards—dried up!",
  "Microaggression training for seagulls—grounded!",
  "Woke contract cancelled!"
];
let tinyFaceMessages = {
  "Hillary": { caught: "Hillary’s Hazard Hit! -$3M", dodged: "Hillary’s Hazard Halted!" },
  "Schumer": { caught: "Schumer’s Scheme Smacked! -$3M", dodged: "Schumer’s Scheme Sidestepped!" },
  "Pelosi": { caught: "Pelosi’s Plot Pounced! -$3M", dodged: "Pelosi’s Plot Prevented!" },
  "Cooper": { caught: "Caught by Cooper! -$3M", dodged: "Cooper’s Chase Conquered!" },
  "AOC": { caught: "AOC’s Agenda Attacked! -$3M", dodged: "AOC’s Agenda Avoided!" },
  "Biden": { caught: "Biden’s Blunder Bumped! -$3M", dodged: "Biden’s Blunder Blocked!" }
};
let gameOverMessages = [
  "Government savings negative. Nice job, Polly Pansy!",
  "You bankrupted the nation, Snowflake Sally!",
  "Savings in the red. Way to go, Woke Warrior!",
  "Negative funds? Stellar work, Crybaby Carl!",
  "You blew the budget, Triggered Timmy!",
  "Government broke. Good one, Sensitive Sammy!",
  "Savings depleted. Bravo, Fragile Freddy!",
  "You tanked the economy, Delicate Daisy!",
  "No more money left. Nice try, Whiny Wendy!",
  "Funds at zero. Well done, Buttercup Bob!"
];
let messageTimer = 0;
let currentMessage = "";
let tinyFaceOccurrences = [];
let currentTinyFaceIndex = 0;
let gameState = "SPLASH"; // Start with the splash screen
let stateTimer = 0;
let invulnerabilityTimer = 0;
let donkeyPath = [];
let donkeyMoveTimer = 0;
let donkeyDisplayX, donkeyDisplayY;
let donkeyTarget = null;
let donkeyAnimation = null;
let countdownTimer = 0;

// Variables to store the loaded images
let moneySymbolImg, democratDonkeyImg, dogeCoinImg;
let tinyEnemyImgs = {
  "Hillary": null,
  "Schumer": null,
  "Pelosi": null,
  "Cooper": null,
  "AOC": null,
  "Biden": null
};

// Constants for penalties
const PENALTY_DONKEY = -5;
const PENALTY_TINYFACE = -3;

// Constants for countdown
const COUNTDOWN_DURATION = 180; // 3 seconds at 60 fps (3 * 60)

obstacles = [];
tinyFaceEnemies = [];

const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;
const TILE_SIZE = 40;
const CANVAS_WIDTH = GRID_WIDTH * TILE_SIZE;
const CANVAS_HEIGHT = GRID_HEIGHT * TILE_SIZE;
const PLAYABLE_TOP = 1;
const PLAYABLE_BOTTOM = GRID_HEIGHT - 1;
const DOGE_RADIUS = TILE_SIZE / 2.5;

// Preload function to load images before setup
function preload() {
  moneySymbolImg = loadImage('images/money_symbol.png');
  democratDonkeyImg = loadImage('images/democrat_donkey.png');
  dogeCoinImg = loadImage('images/doge_coin.png');
  tinyEnemyImgs["Hillary"] = loadImage('images/tiny_hillary.png');
  tinyEnemyImgs["Schumer"] = loadImage('images/tiny_schumer.png');
  tinyEnemyImgs["Pelosi"] = loadImage('images/tiny_pelosi.png');
  tinyEnemyImgs["Cooper"] = loadImage('images/tiny_cooper.png');
  tinyEnemyImgs["AOC"] = loadImage('images/tiny_aoc.png');
  tinyEnemyImgs["Biden"] = loadImage('images/tiny_biden.png');
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT + 50);
  frameRate(60);
  resetLevel();
  countdownTimer = COUNTDOWN_DURATION; // Initialize countdown timer
}

function isCollidingWithObstacle(x, y, size) {
  if (size === "circle") {
    let centerX = (x + 0.5) * TILE_SIZE;
    let centerY = (y + 0.5) * TILE_SIZE;
    let radius = DOGE_RADIUS;

    for (let o of obstacles) {
      let closestX = max(o.x * TILE_SIZE, min(centerX, (o.x + 1) * TILE_SIZE));
      let closestY = max(o.y * TILE_SIZE, min(centerY, (o.y + 1) * TILE_SIZE));
      let distanceX = centerX - closestX;
      let distanceY = centerY - closestY;
      if ((distanceX ** 2 + distanceY ** 2) <= (radius ** 2)) {
        return true;
      }
    }

    for (let t of tinyFaceEnemies) {
      let closestX = max(t.x * TILE_SIZE, min(centerX, (t.x + 1) * TILE_SIZE));
      let closestY = max(t.y * TILE_SIZE, min(centerY, (t.y + 1) * TILE_SIZE));
      let distanceX = centerX - closestX;
      let distanceY = centerY - closestY;
      if ((distanceX ** 2 + distanceY ** 2) <= (radius ** 2)) {
        return true;
      }
    }

    return false;
  }

  for (let o of obstacles) {
    let entityLeft = x * TILE_SIZE;
    let entityRight = (x + size) * TILE_SIZE;
    let entityTop = y * TILE_SIZE;
    let entityBottom = (y + size) * TILE_SIZE;

    let obsLeft = o.x * TILE_SIZE;
    let obsRight = (o.x + 1) * TILE_SIZE;
    let obsTop = o.y * TILE_SIZE;
    let obsBottom = (o.y + 1) * TILE_SIZE;

    if (entityRight > obsLeft && entityLeft < obsRight && entityBottom > obsTop && entityTop < obsBottom) {
      return true;
    }
  }

  return false;
}

function resetLevel() {
  frameCount = 0;
  doge = { x: floor(random(GRID_WIDTH)), y: floor(random(PLAYABLE_TOP, PLAYABLE_BOTTOM + 1)), speed: 0.1 };
  donkey = { x: floor(random(GRID_WIDTH)), y: floor(random(PLAYABLE_TOP, PLAYABLE_BOTTOM + 1)) };
  
  while (doge.x === donkey.x && doge.y === donkey.y) {
    doge = { x: floor(random(GRID_WIDTH)), y: floor(random(PLAYABLE_TOP, PLAYABLE_BOTTOM + 1)), speed: 0.1 };
  }
  donkey.x = floor(donkey.x);
  donkey.y = floor(donkey.y);
  donkeyDisplayX = donkey.x;
  donkeyDisplayY = donkey.y;

  totalMoney = 10 + level - 1;
  moneySymbols = [];
  for (let i = 0; i < totalMoney; i++) {
    let pos = getValidPosition();
    moneySymbols.push({ x: pos.x, y: pos.y });
  }

  let moneyReachable = areAllMoneySymbolsReachable();
  let moneyRetries = 0;
  const maxMoneyRetries = 100;
  while (!moneyReachable) {
    moneySymbols = [];
    for (let i = 0; i < totalMoney; i++) {
      let pos = getValidPosition();
      moneySymbols.push({ x: pos.x, y: pos.y });
    }
    moneyReachable = areAllMoneySymbolsReachable();
    moneyRetries++;
    if (moneyRetries >= maxMoneyRetries) {
      doge = { x: floor(random(GRID_WIDTH)), y: floor(random(PLAYABLE_TOP, PLAYABLE_BOTTOM + 1)), speed: 0.1 };
      donkey = { x: floor(random(GRID_WIDTH)), y: floor(random(PLAYABLE_TOP, PLAYABLE_BOTTOM + 1)) };
      while (doge.x === donkey.x && doge.y === donkey.y) {
        doge = { x: floor(random(GRID_WIDTH)), y: floor(random(PLAYABLE_TOP, PLAYABLE_BOTTOM + 1)), speed: 0.1 };
      }
      donkey.x = floor(donkey.x);
      donkey.y = floor(donkey.y);
      donkeyDisplayX = donkey.x;
      donkeyDisplayY = donkey.y;
      moneySymbols = [];
      for (let i = 0; i < totalMoney; i++) {
        let pos = getValidPosition();
        moneySymbols.push({ x: pos.x, y: pos.y });
      }
      moneyRetries = 0;
    }
  }

  collectedMoney = 0;
  donkeyCollectedMoney = 0;
  moneyForBonus = 0;

  obstacles = [];
  if (level >= 8) {
    let numObstacles = min(level - 6, 10);
    let maxRetries = 100;
    let retries = 0;
    for (let i = 0; i < numObstacles; i++) {
      let pos = getValidPosition();
      let tooClose = false;
      for (let o of obstacles) {
        let dx = Math.abs(pos.x - o.x);
        let dy = Math.abs(pos.y - o.y);
        if (dx + dy === 1 || (dx === 1 && dy === 1)) {
          tooClose = true;
          break;
        }
      }
      if (pos.y === PLAYABLE_TOP || pos.y === PLAYABLE_BOTTOM) {
        let hasWideGap = false;
        for (let x = max(0, pos.x - 1); x <= min(GRID_WIDTH - 1, pos.x + 1); x++) {
          let blocked = false;
          for (let o of obstacles) {
            if (o.x === x && o.y === pos.y) {
              blocked = true;
              break;
            }
          }
          if (!blocked) {
            hasWideGap = true;
            break;
          }
        }
        if (!hasWideGap) {
          retries++;
          if (retries >= maxRetries) {
            numObstacles--;
            retries = 0;
          }
          i--;
          continue;
        }
      }
      if (!tooClose) {
        obstacles.push({ x: pos.x, y: pos.y });
        let dogeReachable = false;
        let directions = [
          { dx: 0, dy: -1 },
          { dx: 0, dy: 1 },
          { dx: -1, dy: 0 },
          { dx: 1, dy: 0 }
        ];
        for (let dir of directions) {
          let newX = floor(doge.x) + dir.dx;
          let newY = floor(doge.y) + dir.dy;
          if (newX < 0 || newX >= GRID_WIDTH || newY < PLAYABLE_TOP || newY > PLAYABLE_BOTTOM) continue;
          if (!isCollidingWithObstacle(newX, newY, "circle")) {
            dogeReachable = true;
            break;
          }
        }
        if (!dogeReachable) {
          obstacles.pop();
          i--;
          retries++;
          if (retries >= maxRetries) {
            numObstacles--;
            retries = 0;
          }
          continue;
        }
        while (!areAllMoneySymbolsReachable()) {
          obstacles.pop();
          pos = getValidPosition();
          tooClose = false;
          for (let o of obstacles) {
            let dx = Math.abs(pos.x - o.x);
            let dy = Math.abs(pos.y - o.y);
            if (dx + dy === 1 || (dx === 1 && dy === 1)) {
              tooClose = true;
              break;
            }
          }
          if (pos.y === PLAYABLE_TOP || pos.y === PLAYABLE_BOTTOM) {
            let hasWideGap = false;
            for (let x = max(0, pos.x - 1); x <= min(GRID_WIDTH - 1, pos.x + 1); x++) {
              let blocked = false;
              for (let o of obstacles) {
                if (o.x === x && o.y === pos.y) {
                  blocked = true;
                  break;
                }
              }
              if (!blocked) {
                hasWideGap = true;
                break;
              }
            }
            if (!hasWideGap) {
              retries++;
              if (retries >= maxRetries) {
                numObstacles--;
                retries = 0;
              }
              i--;
              continue;
            }
          }
          if (!tooClose) {
            obstacles.push({ x: pos.x, y: pos.y });
            retries++;
            if (retries >= maxRetries) {
              numObstacles--;
              retries = 0;
              if (numObstacles <= 0) {
                break;
              }
            }
          } else {
            i--;
            retries++;
            if (retries >= maxRetries) {
              numObstacles--;
              retries = 0;
              if (numObstacles <= 0) {
                break;
              }
            }
          }
          if (retries >= 500) {
            doge = { x: floor(random(GRID_WIDTH)), y: floor(random(PLAYABLE_TOP, PLAYABLE_BOTTOM + 1)), speed: 0.1 };
            donkey = { x: floor(random(GRID_WIDTH)), y: floor(random(PLAYABLE_TOP, PLAYABLE_BOTTOM + 1)) };
            while (doge.x === donkey.x && doge.y === donkey.y) {
              doge = { x: floor(random(GRID_WIDTH)), y: floor(random(PLAYABLE_TOP, PLAYABLE_BOTTOM + 1)), speed: 0.1 };
            }
            donkey.x = floor(donkey.x);
            donkey.y = floor(donkey.y);
            donkeyDisplayX = donkey.x;
            donkeyDisplayY = donkey.y;
            moneySymbols = [];
            for (let i = 0; i < totalMoney; i++) {
              let pos = getValidPosition();
              moneySymbols.push({ x: pos.x, y: pos.y });
            }
            obstacles = [];
            i = -1;
            numObstacles = min(level - 6, 10);
            retries = 0;
            continue;
          }
        }
      } else {
        i--;
        retries++;
        if (retries >= maxRetries) {
          numObstacles--;
          retries = 0;
          if (numObstacles <= 0) {
            continue;
          }
        }
      }
    }
  }

  tinyFaceEnemies = [];
  tinyFaceOccurrences = [];
  currentTinyFaceIndex = 0;
  if (level >= 10) {
    let numOccurrences = floor(random(1, 5)) || 1;
    let estimatedDuration = level * 1;
    let minTime = estimatedDuration * 0.1 * 60;
    let maxTime = estimatedDuration * 0.9 * 60;
    let frame = floor(random(minTime, maxTime));
    frame = max(frame, 180);
    tinyFaceOccurrences = [{ frame: frame, spawned: false, name: random(["Hillary", "Schumer", "Pelosi", "Cooper", "AOC", "Biden"]) }];
    for (let i = 1; i < numOccurrences; i++) {
      if (tinyFaceOccurrences.length > i - 1) {
        let prevFrame = tinyFaceOccurrences[i - 1].frame;
        let gap = floor(random(120, 480));
        frame = prevFrame + gap;
        if (frame <= maxTime) {
          tinyFaceOccurrences.push({ frame: frame, spawned: false, name: random(["Hillary", "Schumer", "Pelosi", "Cooper", "AOC", "Biden"]) });
        }
      }
    }
    tinyFaceOccurrences.sort((a, b) => a.frame - b.frame);
  }

  donkeyPath = [];
  donkeyMoveTimer = 0;
  donkeyTarget = null;
  donkeyAnimation = null;
  invulnerabilityTimer = 120;
  // Note: gameState is now set to "SPLASH" at initialization, so we don't set it here
  countdownTimer = COUNTDOWN_DURATION;
}

function getValidPosition() {
  let x, y;
  let valid = false;
  while (!valid) {
    x = floor(random(GRID_WIDTH));
    y = floor(random(PLAYABLE_TOP, PLAYABLE_BOTTOM + 1));
    valid = true;
    if (x === doge.x && y === doge.y) valid = false;
    if (x === donkey.x && y === donkey.y) valid = false;
    for (let m of moneySymbols) {
      if (x === m.x && y === m.y) valid = false;
    }
    for (let o of obstacles) {
      if (x === o.x && y === o.y) valid = false;
    }
  }
  return { x: x, y: y };
}

function getFarthestPositionFromDoge() {
  let farthestX = 0;
  let farthestY = PLAYABLE_TOP;
  let maxDist = 0;

  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = PLAYABLE_TOP; y <= PLAYABLE_BOTTOM; y++) {
      let valid = true;
      if (x === doge.x && y === doge.y) valid = false;
      if (x === donkey.x && y === donkey.y) valid = false;
      for (let m of moneySymbols) {
        if (x === m.x && y === m.y) valid = false;
      }
      for (let o of obstacles) {
        if (x === o.x && y === o.y) valid = false;
      }
      if (valid) {
        let d = dist(x, y, doge.x, doge.y);
        if (d > maxDist) {
          maxDist = d;
          farthestX = x;
          farthestY = y;
        }
      }
    }
  }
  return { x: farthestX, y: farthestY };
}

function areAllMoneySymbolsReachable() {
  let visited = Array(GRID_WIDTH).fill().map(() => Array(GRID_HEIGHT).fill(false));
  let queue = [{ x: floor(doge.x), y: floor(doge.y) }];
  visited[floor(doge.x)][floor(doge.y)] = true;
  let directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 }
  ];

  while (queue.length > 0) {
    let { x, y } = queue.shift();
    for (let dir of directions) {
      let newX = x + dir.dx;
      let newY = y + dir.dy;
      if (newX < 0 || newX >= GRID_WIDTH || newY < PLAYABLE_TOP || newY > PLAYABLE_BOTTOM) continue;
      if (visited[newX][newY]) continue;
      if (!isCollidingWithObstacle(newX, newY, "circle")) {
        visited[newX][newY] = true;
        queue.push({ x: newX, y: newY });
      }
    }
  }

  for (let m of moneySymbols) {
    if (!visited[m.x][m.y]) {
      return false;
    }
  }
  return true;
}

function formatScore(score) {
  if (score >= 1000) {
    let billions = score / 1000;
    return `${billions.toFixed(2)}B`;
  }
  return `$${score}M`;
}

// A* Pathfinding
function findPath(startX, startY, goalX, goalY) {
  let openSet = [{ x: startX, y: startY, g: 0, h: heuristic(startX, startY, goalX, goalY), f: 0, parent: null }];
  let closedSet = Array(GRID_WIDTH).fill().map(() => Array(GRID_HEIGHT).fill(false));
  let cameFrom = Array(GRID_WIDTH).fill().map(() => Array(GRID_HEIGHT).fill(null));

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    let current = openSet.shift();

    if (current.x === goalX && current.y === goalY) {
      let path = [];
      while (current) {
        path.push({ x: current.x, y: current.y });
        current = cameFrom[current.x][current.y];
      }
      return path.reverse();
    }

    closedSet[current.x][current.y] = true;

    let directions = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 }
    ];

    for (let dir of directions) {
      let newX = current.x + dir.dx;
      let newY = current.y + dir.dy;

      if (newX < 0 || newX >= GRID_WIDTH || newY < PLAYABLE_TOP || newY > PLAYABLE_BOTTOM) continue;
      if (closedSet[newX][newY]) continue;
      if (isCollidingWithObstacle(newX, newY, 1)) continue;

      let g = current.g + 1;
      let h = heuristic(newX, newY, goalX, goalY);
      let f = g + h;

      let inOpenSet = openSet.find(node => node.x === newX && node.y === newY);
      if (inOpenSet) {
        if (g < inOpenSet.g) {
          inOpenSet.g = g;
          inOpenSet.f = f;
          inOpenSet.parent = current;
        }
      } else {
        openSet.push({ x: newX, y: newY, g: g, h: h, f: f, parent: current });
        cameFrom[newX][newY] = current;
      }
    }
  }

  return [];
}

function heuristic(x, y, goalX, goalY) {
  return Math.abs(x - goalX) + Math.abs(y - goalY);
}

function draw() {
  background(220);

  // Draw UI background (always visible)
  fill(200);
  rect(0, 0, CANVAS_WIDTH, TILE_SIZE);
  rect(0, CANVAS_HEIGHT, CANVAS_WIDTH, 50);

  // Draw playable area boundaries (top line only, always visible)
  stroke(150);
  line(0, TILE_SIZE, CANVAS_WIDTH, TILE_SIZE);
  noStroke();

  // Handle state transitions
  if (gameState === "SPLASH") {
    // Draw the splash screen
    fill(0);
    textAlign(CENTER);
    
    // Title
    textSize(48);
    text("Doge vs. Donkey", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
    
    // Brief overview
    textSize(20);
    text("Save the budget from woke spending!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    text("Collect money as Doge, avoid the donkey!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
    text("Don't be fooled by the easy levels. The game gets harder after level 10!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
    
    // Click/tap to continue prompt
    textSize(16);
    text(touches.length > 0 ? "Tap to continue" : "Click to continue", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100);
    
    return; // Wait for click/tap via mousePressed()
  }

  // Draw status bar (visible during COUNTDOWN, PLAYING, and other states)
  fill(0);
  textSize(16);
  textAlign(LEFT);
  text(`Government savings: ${formatScore(score)}`, 10, 20);
  textAlign(RIGHT);
  text(`Level ${level}/25`, CANVAS_WIDTH - 10, 20);
  textAlign(CENTER);

  if (gameState === "COUNTDOWN") {
    // Draw the board
    drawBoard();

    // Display the countdown
    fill(0);
    textSize(48);
    textAlign(CENTER);
    let countdownValue = ceil(countdownTimer / 60); // Convert frames to seconds (1-3)
    text(countdownValue.toString(), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    
    countdownTimer--;
    if (countdownTimer <= 0) {
      gameState = "PLAYING";
    }
    return;
  }

  if (gameState === "LEVEL_COMPLETE") {
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text(`Level ${level - 1} complete`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    stateTimer--;
    if (stateTimer <= 0) {
      transitionToNextLevel();
    }
    return;
  }

  if (gameState === "TRANSITIONING") {
    return;
  }

  if (gameState === "PENALTY") {
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text(currentMessage, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    stateTimer--;
    if (stateTimer <= 0) {
      gameState = "PLAYING";
      doge = { x: floor(random(GRID_WIDTH)), y: floor(random(PLAYABLE_TOP, PLAYABLE_BOTTOM + 1)), speed: 0.1 };
      while (doge.x === donkey.x && doge.y === donkey.y) {
        doge = { x: floor(random(GRID_WIDTH)), y: floor(random(PLAYABLE_TOP, PLAYABLE_BOTTOM + 1)), speed: 0.1 };
      }
      invulnerabilityTimer = 120;
      if (tinyFaceEnemies && tinyFaceEnemies.length > 0) {
        let t = tinyFaceEnemies[0];
        let targetX = doge.x;
        let targetY = doge.y;
        let dx = targetX - t.x;
        let dy = targetY - t.y;
        let magnitude = sqrt(dx * dx + dy * dy);
        if (magnitude > 0) {
          t.dx = dx / magnitude;
          t.dy = dy / magnitude;
        }
      }
    }
    return;
  }

  if (gameState === "GAME_OVER") {
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text(currentMessage, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
    textSize(16);
    text("Restarting from Level 1", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    text(touches.length > 0 ? "Tap to continue" : "Click to continue", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
    return;
  }

  if (gameState === "GAME_WON") {
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text("Proceeding to final boss!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    stateTimer--;
    if (stateTimer <= 0) {
      level = 1;
      score = 0;
      transitionToNextLevel();
    }
    return;
  }

  // Main gameplay logic (PLAYING state)
  if (gameState === "PLAYING") {
    if (messageTimer > 0) {
      fill(0);
      textAlign(CENTER);
      text(currentMessage, CANVAS_WIDTH / 2, CANVAS_HEIGHT + 40);
      messageTimer--;
    }

    // Draw the board
    drawBoard();

    // Move and draw Doge
    handleDogeMovement();

    // Move and draw donkey
    handleDonkeyMovement();

    // Check collisions first (may change gameState)
    checkCollisions();

    // If gameState changed, return early to avoid further gameplay logic
    if (gameState !== "PLAYING") return;

    // Handle tiny face enemies after confirming gameState
    handleTinyFaceEnemies();

    if (invulnerabilityTimer > 0) invulnerabilityTimer--;
  }
}

// Helper function to draw the board (used in both COUNTDOWN and PLAYING states)
function drawBoard() {
  // Draw obstacles
  fill(100);
  for (let o of obstacles) {
    rect(o.x * TILE_SIZE, o.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  // Draw money symbols using the image
  for (let i = moneySymbols.length - 1; i >= 0; i--) {
    let m = moneySymbols[i];
    image(moneySymbolImg, m.x * TILE_SIZE, m.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  // Draw Doge using the Doge coin image
  if (invulnerabilityTimer > 0 && frameCount % 20 < 10) {
    tint(255, 100); // Apply transparency during invulnerability
    image(dogeCoinImg, doge.x * TILE_SIZE, doge.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    noTint();
  } else {
    image(dogeCoinImg, doge.x * TILE_SIZE, doge.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  // Draw donkey using the Democrat donkey image
  image(democratDonkeyImg, donkeyDisplayX * TILE_SIZE, donkeyDisplayY * TILE_SIZE, TILE_SIZE, TILE_SIZE);

  // Draw tiny face enemies using their respective images
  if (tinyFaceEnemies) {
    for (let t of tinyFaceEnemies) {
      let enemyImg = tinyEnemyImgs[t.name];
      if (enemyImg) {
        image(enemyImg, t.x * TILE_SIZE, t.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

function handleDogeMovement() {
  if (gameState !== "PLAYING") return;

  let dx = 0;
  let dy = 0;
  if (keyIsDown(LEFT_ARROW)) dx -= doge.speed;
  if (keyIsDown(RIGHT_ARROW)) dx += doge.speed;
  if (keyIsDown(UP_ARROW)) dy -= doge.speed;
  if (keyIsDown(DOWN_ARROW)) dy += doge.speed;

  let newX = doge.x + dx;
  newX = constrain(newX, 0, GRID_WIDTH - 1);
  let newY = doge.y;
  newY = constrain(newY, PLAYABLE_TOP, PLAYABLE_BOTTOM);
  if (!isCollidingWithObstacle(newX, newY, "circle")) {
    doge.x = newX;
  }

  newX = doge.x;
  newY = doge.y + dy;
  newX = constrain(newX, 0, GRID_WIDTH - 1);
  newY = constrain(newY, PLAYABLE_TOP, PLAYABLE_BOTTOM);
  if (!isCollidingWithObstacle(newX, newY, "circle")) {
    doge.y = newY;
  }

  doge.x = round(doge.x * 10) / 10;
  doge.y = round(doge.y * 10) / 10;
}

function transitionToNextLevel() {
  gameState = "TRANSITIONING";
  resetLevel();
}

function handleDonkeyMovement() {
  if (gameState !== "PLAYING") return;

  // Use map() for efficiency, randomTargetChance, and moveInterval
  let efficiency = map(level, 1, 25, 0.05, 0.99); // 5% at Level 1, 99% at Level 25
  let randomTargetChance = level < 20 ? map(level, 1, 20, 0.9, 0.0) : 0.0; // 90% at Level 1, 0% by Level 20
  let moveInterval = level < 20 ? map(level, 1, 20, 12, 3) : 3; // 12 frames at Level 1, 3 frames by Level 20

  // Always update animation if in progress
  if (donkeyAnimation) {
    donkeyAnimation.timer++;
    let t = donkeyAnimation.timer / moveInterval;
    if (t >= 1) {
      donkeyDisplayX = donkeyAnimation.endX;
      donkeyDisplayY = donkeyAnimation.endY;
      donkeyAnimation = null;
    } else {
      donkeyDisplayX = lerp(donkeyAnimation.startX, donkeyAnimation.endX, t);
      donkeyDisplayY = lerp(donkeyAnimation.startY, donkeyAnimation.endY, t);
    }
  }

  // Move to the next position if no animation is in progress
  if (!donkeyAnimation) {
    donkeyMoveTimer++;
    if (donkeyMoveTimer >= moveInterval) {
      donkeyMoveTimer = 0;

      if (random(1) < efficiency) {
        donkeyTarget = null;
        let closest = moneySymbols[0];
        let minDist = dist(donkey.x, donkey.y, closest.x, closest.y);
        for (let m of moneySymbols) {
          let d = dist(donkey.x, donkey.y, m.x, m.y);
          if (d < minDist) {
            minDist = d;
            closest = m;
          }
        }
        donkeyPath = findPath(floor(donkey.x), floor(donkey.y), closest.x, closest.y);
      } else if (donkeyTarget && frameCount < donkeyTarget.endFrame) {
        if (donkeyPath.length === 0 || donkeyPath[donkeyPath.length - 1].x !== donkeyTarget.x || donkeyPath[donkeyPath.length - 1].y !== donkeyTarget.y) {
          donkeyPath = findPath(floor(donkey.x), floor(donkey.y), donkeyTarget.x, donkeyTarget.y);
        }
      } else if (random(1) < randomTargetChance) {
        let x, y;
        do {
          x = floor(random(GRID_WIDTH));
          y = floor(random(PLAYABLE_TOP, PLAYABLE_BOTTOM + 1));
        } while (isCollidingWithObstacle(x, y, 1) || (x === donkey.x && y === donkey.y));
        for (let m of moneySymbols) {
          if (x === m.x && y === m.y) {
            x = floor(random(GRID_WIDTH));
            y = floor(random(PLAYABLE_TOP, PLAYABLE_BOTTOM + 1));
            break;
          }
        }
        donkeyTarget = { x: x, y: y, endFrame: frameCount + 60 };
        donkeyPath = findPath(floor(donkey.x), floor(donkey.y), donkeyTarget.x, donkeyTarget.y);
      }

      if (donkeyPath.length > 1) {
        let next = donkeyPath[1];
        donkeyAnimation = {
          startX: donkey.x,
          startY: donkey.y,
          endX: next.x,
          endY: next.y,
          timer: 0
        };
        donkey.x = next.x;
        donkey.y = next.y;
        donkeyPath.shift();
      } else {
        donkeyPath = [];
      }
    }
  }
}

function checkCollisions() {
  for (let i = moneySymbols.length - 1; i >= 0; i--) {
    let m = moneySymbols[i];
    let distance = dist(doge.x + 0.5, doge.y + 0.5, m.x + 0.5, m.y + 0.5);
    if (distance < 0.75) {
      moneySymbols.splice(i, 1);
      score++;
      collectedMoney++;
      moneyForBonus++;
      if (moneyForBonus >= 5) {
        score += 5;
        moneyForBonus = 0;
        currentMessage = "Bonus: $5M!";
        messageTimer = 120;
      } else {
        currentMessage = random(messages);
        messageTimer = 120;
      }
    }
  }

  for (let i = moneySymbols.length - 1; i >= 0; i--) {
    let m = moneySymbols[i];
    let distance = dist(donkey.x + 0.5, donkey.y + 0.5, m.x + 0.5, m.y + 0.5);
    if (distance < 0.75) {
      moneySymbols.splice(i, 1);
      score--;
      donkeyCollectedMoney++;
      moneyForBonus = 0;
    }
  }

  if (moneySymbols.length === 0) {
    if (score < 0) {
      currentMessage = random(gameOverMessages);
      gameState = "GAME_OVER";
      stateTimer = 0;
    } else {
      tinyFaceEnemies = [];
      tinyFaceOccurrences = [];
      currentTinyFaceIndex = 0;
      gameState = "LEVEL_COMPLETE";
      stateTimer = 120;
      level++;
      if (level > 25) {
        currentMessage = "Proceeding to final boss!";
        gameState = "GAME_WON";
        stateTimer = 180;
      }
    }
    return;
  }

  if (invulnerabilityTimer <= 0) {
    let distance = dist(doge.x + 0.5, doge.y + 0.5, donkey.x + 0.5, donkey.y + 0.5);
    if (distance < 0.75) {
      score += PENALTY_DONKEY;
      gameState = "PENALTY";
      currentMessage = `Collided with donkey! ${PENALTY_DONKEY}M`;
      stateTimer = 180;
      if (tinyFaceEnemies && tinyFaceEnemies.length > 0) {
        let t = tinyFaceEnemies[0];
        let pos = getFarthestPositionFromDoge();
        t.x = pos.x;
        t.y = pos.y;
      }
    }
  }
}

function handleTinyFaceEnemies() {
  if (gameState !== "PLAYING") return;

  if (!tinyFaceEnemies) tinyFaceEnemies = [];

  if (tinyFaceEnemies.length === 0 && currentTinyFaceIndex < (tinyFaceOccurrences?.length || 0)) {
    let occ = tinyFaceOccurrences[currentTinyFaceIndex];
    if (occ && !occ.spawned && frameCount >= occ.frame) {
      occ.spawned = true;
      let pos = getFarthestPositionFromDoge();
      let targetX = doge.x;
      let targetY = doge.y;
      let dx = targetX - pos.x;
      let dy = targetY - pos.y;
      let magnitude = sqrt(dx * dx + dy * dy);
      if (magnitude > 0) {
        dx = dx / magnitude;
        dy = dy / magnitude;
      }
      let speed = map(level, 10, 25, 0.055, 0.165);
      tinyFaceEnemies.push({
        x: pos.x,
        y: pos.y,
        dx: dx,
        dy: dy,
        speed: speed,
        name: occ.name
      });
      currentTinyFaceIndex++;
    }
  }

  for (let i = tinyFaceEnemies.length - 1; i >= 0; i--) {
    let t = tinyFaceEnemies[i];

    t.x += t.dx * t.speed;
    t.y += t.dy * t.speed;

    if (t.x < 0 || t.x > GRID_WIDTH - 1 || t.y < PLAYABLE_TOP || t.y > PLAYABLE_BOTTOM) {
      currentMessage = tinyFaceMessages[t.name].dodged;
      messageTimer = 120;
      tinyFaceEnemies.splice(i, 1);
      continue;
    }

    if (invulnerabilityTimer <= 0) {
      let distance = dist(doge.x + 0.5, doge.y + 0.5, t.x + 0.5, t.y + 0.5);
      if (distance < 0.75) {
        score += PENALTY_TINYFACE;
        gameState = "PENALTY";
        currentMessage = tinyFaceMessages[t.name].caught;
        stateTimer = 180;
        tinyFaceEnemies.splice(i, 1);
        return;
      }
    }
  }
}

function mousePressed() {
  if (gameState === "SPLASH") {
    gameState = "COUNTDOWN";
    return;
  }

  if (gameState === "GAME_OVER") {
    transitionToNextLevel();
  }
}

function keyPressed() {
  if (key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown") {
    return;
  }
}
