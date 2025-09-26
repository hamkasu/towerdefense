// --- Basic Tower Defense Prototype by Copilot ---

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Game settings
const TILE = 40;
const ROWS = 12;
const COLS = 16;
const PATH = [
  [0, 5],[1, 5],[2, 5],[3, 5],[4, 5],[5, 5],[5, 6],[5, 7],[6, 7],[7, 7],[8, 7],[9, 7],[10, 7],[11, 7],[12, 7],[13, 7],[14, 7],[15, 7]
];
const ENEMY_COLORS = ["#ff7070", "#ffb347", "#fff347", "#70ff70"];

// Game state
let towers = [];
let enemies = [];
let projectiles = [];
let money = 100;
let lives = 10;
let wave = 1;
let waveInProgress = false;
let spawnTimer = 0;
let enemiesToSpawn = 0;

function drawGrid() {
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      ctx.fillStyle = isPath(i, j) ? "#666" : "#224c22";
      ctx.fillRect(i * TILE, j * TILE, TILE, TILE);
      ctx.strokeStyle = "#333";
      ctx.strokeRect(i * TILE, j * TILE, TILE, TILE);
    }
  }
}

function isPath(x, y) {
  return PATH.some(([px, py]) => px === x && py === y);
}

function getPathPixel(idx) {
  if (idx < 0) idx = 0;
  if (idx >= PATH.length) idx = PATH.length - 1;
  return [PATH[idx][0] * TILE + TILE/2, PATH[idx][1] * TILE + TILE/2];
}

// Tower class
class Tower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.range = 90;
    this.fireRate = 45;
    this.cooldown = 0;
  }
  update() {
    if (this.cooldown > 0) this.cooldown--;
    else {
      // Find nearest enemy in range
      let nearest = null, nearestDist = this.range;
      for (let enemy of enemies) {
        let dx = enemy.x - this.x, dy = enemy.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = enemy;
        }
      }
      if (nearest) {
        projectiles.push(new Projectile(this.x, this.y, nearest));
        this.cooldown = this.fireRate;
      }
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, 2 * Math.PI);
    ctx.fillStyle = "#33f";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.restore();
  }
}

// Enemy class
class Enemy {
  constructor() {
    this.pathIdx = 0;
    [this.x, this.y] = getPathPixel(0);
    this.speed = 1.0 + wave * 0.1;
    this.hp = 10 + (wave - 1) * 4;
    this.maxHp = this.hp;
    this.reward = 10 + wave * 2;
    this.color = ENEMY_COLORS[(wave - 1) % ENEMY_COLORS.length];
  }
  update() {
    let [tx, ty] = getPathPixel(this.pathIdx + 1);
    let dx = tx - this.x, dy = ty - this.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < this.speed) {
      this.pathIdx++;
      if (this.pathIdx >= PATH.length - 1) {
        this.reachedEnd = true;
        return;
      }
    } else {
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    // HP bar
    ctx.fillStyle = "#222";
    ctx.fillRect(-13, -22, 26, 6);
    ctx.fillStyle = "#0f0";
    ctx.fillRect(-13, -22, 26 * (this.hp / this.maxHp), 6);
    ctx.restore();
  }
}

// Projectile class
class Projectile {
  constructor(x, y, target) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.speed = 5.5;
    this.radius = 4;
  }
  update() {
    if (!this.target) return;
    let dx = this.target.x - this.x, dy = this.target.y - this.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < this.speed || this.target.hp <= 0) {
      this.hit = true;
      if (this.target.hp > 0) this.target.hp -= 6;
    } else {
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
    }
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#ff0";
    ctx.fill();
    ctx.restore();
  }
}

// -- Main game loop --
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  // Draw towers
  for (let t of towers) t.draw();
  // Update and draw enemies
  for (let e of enemies) e.update();
  enemies = enemies.filter(e => {
    if (e.reachedEnd) {
      lives--;
      updateUI();
      return false;
    }
    if (e.hp <= 0) {
      money += e.reward;
      updateUI();
      return false;
    }
    return true;
  });
  for (let e of enemies) e.draw();
  // Update and draw towers (firing)
  for (let t of towers) t.update();
  // Update and draw projectiles
  for (let p of projectiles) p.update();
  projectiles = projectiles.filter(p => !p.hit);
  for (let p of projectiles) p.draw();

  // Enemy spawning
  if (waveInProgress && enemiesToSpawn > 0) {
    spawnTimer--;
    if (spawnTimer <= 0) {
      enemies.push(new Enemy());
      enemiesToSpawn--;
      spawnTimer = 38 - wave * 2;
      if (spawnTimer < 10) spawnTimer = 10;
    }
  }
  // End of wave
  if (waveInProgress && enemies.length === 0 && enemiesToSpawn === 0) {
    waveInProgress = false;
    document.getElementById('start-btn').disabled = false;
    wave++;
    updateUI();
  }
  // Game over
  if (lives <= 0) {
    ctx.fillStyle = "#000c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "48px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width/2, canvas.height/2);
    return;
  }

  requestAnimationFrame(gameLoop);
}

// -- UI and interactions --
canvas.addEventListener('click', e => {
  if (waveInProgress && money >= 50) {
    let rect = canvas.getBoundingClientRect();
    let mx = Math.floor((e.clientX - rect.left) / TILE);
    let my = Math.floor((e.clientY - rect.top) / TILE);
    // Only allow on grass, not on path or other towers
    if (!isPath(mx, my) && !towers.some(t => t.gridX === mx && t.gridY === my)) {
      let tx = mx * TILE + TILE / 2;
      let ty = my * TILE + TILE / 2;
      towers.push(Object.assign(new Tower(tx, ty), {gridX: mx, gridY: my}));
      money -= 50;
      updateUI();
    }
  }
});

document.getElementById('start-btn').onclick = () => {
  if (waveInProgress) return;
  waveInProgress = true;
  enemiesToSpawn = 8 + wave * 3;
  spawnTimer = 1;
  document.getElementById('start-btn').disabled = true;
};

function updateUI() {
  document.getElementById('money').textContent = `Money: $${money}`;
  document.getElementById('lives').textContent = `Lives: ${lives}`;
  document.getElementById('wave').textContent = `Wave: ${wave}`;
}

// -- Start game --
updateUI();
gameLoop();