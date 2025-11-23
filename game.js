/**
 * Tower Defense Game
 * A complete rewrite with proper encapsulation and modern JavaScript patterns
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  // Grid settings
  TILE_SIZE: 40,
  GRID_ROWS: 12,
  GRID_COLS: 16,

  // Tower settings
  TOWER_COST: 50,
  TOWER_RANGE: 90,
  TOWER_FIRE_RATE: 45,
  TOWER_RADIUS: 18,
  TOWER_COLOR: '#3366ff',

  // Projectile settings
  PROJECTILE_SPEED: 5.5,
  PROJECTILE_DAMAGE: 6,
  PROJECTILE_RADIUS: 4,
  PROJECTILE_COLOR: '#ffff00',

  // Enemy settings
  ENEMY_BASE_SPEED: 1.0,
  ENEMY_SPEED_PER_WAVE: 0.1,
  ENEMY_BASE_HP: 10,
  ENEMY_HP_PER_WAVE: 4,
  ENEMY_BASE_REWARD: 10,
  ENEMY_REWARD_PER_WAVE: 2,
  ENEMY_RADIUS: 16,
  ENEMY_COLORS: ['#ff7070', '#ffb347', '#fff347', '#70ff70'],

  // Wave settings
  BASE_ENEMIES_PER_WAVE: 8,
  ENEMIES_PER_WAVE_INCREASE: 3,
  BASE_SPAWN_INTERVAL: 38,
  SPAWN_INTERVAL_DECREASE: 2,
  MIN_SPAWN_INTERVAL: 10,

  // Player settings
  STARTING_MONEY: 100,
  STARTING_LIVES: 10,

  // Colors
  PATH_COLOR: '#666666',
  GRASS_COLOR: '#224c22',
  GRID_LINE_COLOR: '#333333',

  // Predefined enemy path (grid coordinates)
  PATH: [
    [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5],
    [5, 6], [5, 7], [6, 7], [7, 7], [8, 7], [9, 7],
    [10, 7], [11, 7], [12, 7], [13, 7], [14, 7], [15, 7]
  ]
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Calculate distance between two points
 */
function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Convert grid coordinates to pixel coordinates (center of tile)
 */
function gridToPixel(gridX, gridY) {
  return {
    x: gridX * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
    y: gridY * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2
  };
}

/**
 * Convert pixel coordinates to grid coordinates
 */
function pixelToGrid(pixelX, pixelY) {
  return {
    x: Math.floor(pixelX / CONFIG.TILE_SIZE),
    y: Math.floor(pixelY / CONFIG.TILE_SIZE)
  };
}

// =============================================================================
// TOWER CLASS
// =============================================================================

class Tower {
  constructor(x, y, gridX, gridY) {
    this.x = x;
    this.y = y;
    this.gridX = gridX;
    this.gridY = gridY;
    this.range = CONFIG.TOWER_RANGE;
    this.fireRate = CONFIG.TOWER_FIRE_RATE;
    this.cooldown = 0;
  }

  /**
   * Find the nearest enemy within range
   */
  findTarget(enemies) {
    let nearestEnemy = null;
    let nearestDistance = this.range;

    for (const enemy of enemies) {
      const dist = distance(this.x, this.y, enemy.x, enemy.y);
      if (dist < nearestDistance) {
        nearestDistance = dist;
        nearestEnemy = enemy;
      }
    }

    return nearestEnemy;
  }

  /**
   * Update tower state and fire at enemies
   */
  update(enemies, createProjectile) {
    if (this.cooldown > 0) {
      this.cooldown--;
      return;
    }

    const target = this.findTarget(enemies);
    if (target) {
      createProjectile(this.x, this.y, target);
      this.cooldown = this.fireRate;
    }
  }

  /**
   * Draw the tower
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Tower body
    ctx.beginPath();
    ctx.arc(0, 0, CONFIG.TOWER_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = CONFIG.TOWER_COLOR;
    ctx.fill();

    // Tower outline
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.restore();
  }
}

// =============================================================================
// ENEMY CLASS
// =============================================================================

class Enemy {
  constructor(wave) {
    this.pathIndex = 0;
    const startPos = gridToPixel(CONFIG.PATH[0][0], CONFIG.PATH[0][1]);
    this.x = startPos.x;
    this.y = startPos.y;

    // Scale stats based on wave
    this.speed = CONFIG.ENEMY_BASE_SPEED + wave * CONFIG.ENEMY_SPEED_PER_WAVE;
    this.maxHp = CONFIG.ENEMY_BASE_HP + (wave - 1) * CONFIG.ENEMY_HP_PER_WAVE;
    this.hp = this.maxHp;
    this.reward = CONFIG.ENEMY_BASE_REWARD + wave * CONFIG.ENEMY_REWARD_PER_WAVE;
    this.color = CONFIG.ENEMY_COLORS[(wave - 1) % CONFIG.ENEMY_COLORS.length];

    this.reachedEnd = false;
    this.isDead = false;
  }

  /**
   * Move enemy along the path
   */
  update() {
    if (this.reachedEnd || this.isDead) return;

    // Get next waypoint
    const nextIndex = Math.min(this.pathIndex + 1, CONFIG.PATH.length - 1);
    const target = gridToPixel(CONFIG.PATH[nextIndex][0], CONFIG.PATH[nextIndex][1]);

    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.speed) {
      // Reached waypoint
      this.pathIndex++;
      if (this.pathIndex >= CONFIG.PATH.length - 1) {
        this.reachedEnd = true;
      }
    } else {
      // Move towards waypoint
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
    }
  }

  /**
   * Apply damage to enemy
   */
  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.isDead = true;
    }
  }

  /**
   * Draw the enemy
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Enemy body
    ctx.beginPath();
    ctx.arc(0, 0, CONFIG.ENEMY_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    // HP bar background
    const barWidth = 26;
    const barHeight = 6;
    ctx.fillStyle = '#222222';
    ctx.fillRect(-barWidth / 2, -22, barWidth, barHeight);

    // HP bar fill
    const hpPercent = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = this.getHpBarColor(hpPercent);
    ctx.fillRect(-barWidth / 2, -22, barWidth * hpPercent, barHeight);

    ctx.restore();
  }

  /**
   * Get HP bar color based on health percentage
   */
  getHpBarColor(percent) {
    if (percent > 0.6) return '#00ff00';
    if (percent > 0.3) return '#ffff00';
    return '#ff0000';
  }
}

// =============================================================================
// PROJECTILE CLASS
// =============================================================================

class Projectile {
  constructor(x, y, target) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.speed = CONFIG.PROJECTILE_SPEED;
    this.damage = CONFIG.PROJECTILE_DAMAGE;
    this.hasHit = false;
  }

  /**
   * Update projectile position and check for hit
   */
  update() {
    // If target is dead or missing, mark as hit to remove
    if (!this.target || this.target.isDead) {
      this.hasHit = true;
      return;
    }

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.speed) {
      // Hit the target
      this.target.takeDamage(this.damage);
      this.hasHit = true;
    } else {
      // Move towards target
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
    }
  }

  /**
   * Draw the projectile
   */
  draw(ctx) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(this.x, this.y, CONFIG.PROJECTILE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = CONFIG.PROJECTILE_COLOR;
    ctx.fill();

    ctx.restore();
  }
}

// =============================================================================
// GAME CLASS
// =============================================================================

class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    // UI elements
    this.moneyElement = document.getElementById('money');
    this.livesElement = document.getElementById('lives');
    this.waveElement = document.getElementById('wave');
    this.startButton = document.getElementById('start-btn');
    this.restartButton = document.getElementById('restart-btn');

    // Bind methods
    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.handleStartWave = this.handleStartWave.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.gameLoop = this.gameLoop.bind(this);

    // Setup event listeners
    this.canvas.addEventListener('click', this.handleCanvasClick);
    this.startButton.addEventListener('click', this.handleStartWave);
    if (this.restartButton) {
      this.restartButton.addEventListener('click', this.handleRestart);
    }

    // Initialize game
    this.init();
  }

  /**
   * Initialize/reset game state
   */
  init() {
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];

    this.money = CONFIG.STARTING_MONEY;
    this.lives = CONFIG.STARTING_LIVES;
    this.wave = 1;

    this.waveInProgress = false;
    this.enemiesToSpawn = 0;
    this.spawnTimer = 0;

    this.isGameOver = false;
    this.animationId = null;

    // Update UI
    this.updateUI();
    this.startButton.disabled = false;
    if (this.restartButton) {
      this.restartButton.style.display = 'none';
    }

    // Start game loop
    this.start();
  }

  /**
   * Start the game loop
   */
  start() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.gameLoop();
  }

  /**
   * Main game loop
   */
  gameLoop() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid
    this.drawGrid();

    // Draw towers
    for (const tower of this.towers) {
      tower.draw(this.ctx);
    }

    // Update and filter enemies
    this.updateEnemies();

    // Draw enemies
    for (const enemy of this.enemies) {
      enemy.draw(this.ctx);
    }

    // Update towers (firing)
    for (const tower of this.towers) {
      tower.update(this.enemies, (x, y, target) => {
        this.projectiles.push(new Projectile(x, y, target));
      });
    }

    // Update and filter projectiles
    for (const projectile of this.projectiles) {
      projectile.update();
    }
    this.projectiles = this.projectiles.filter(p => !p.hasHit);

    // Draw projectiles
    for (const projectile of this.projectiles) {
      projectile.draw(this.ctx);
    }

    // Spawn enemies
    this.spawnEnemies();

    // Check wave completion
    this.checkWaveComplete();

    // Check game over
    if (this.lives <= 0) {
      this.gameOver();
      return;
    }

    this.animationId = requestAnimationFrame(this.gameLoop);
  }

  /**
   * Draw the game grid
   */
  drawGrid() {
    for (let col = 0; col < CONFIG.GRID_COLS; col++) {
      for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
        const x = col * CONFIG.TILE_SIZE;
        const y = row * CONFIG.TILE_SIZE;

        // Fill tile
        this.ctx.fillStyle = this.isPathTile(col, row) ? CONFIG.PATH_COLOR : CONFIG.GRASS_COLOR;
        this.ctx.fillRect(x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);

        // Draw grid lines
        this.ctx.strokeStyle = CONFIG.GRID_LINE_COLOR;
        this.ctx.strokeRect(x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
      }
    }
  }

  /**
   * Check if a grid position is part of the path
   */
  isPathTile(gridX, gridY) {
    return CONFIG.PATH.some(([px, py]) => px === gridX && py === gridY);
  }

  /**
   * Check if a tower exists at a grid position
   */
  hasTowerAt(gridX, gridY) {
    return this.towers.some(t => t.gridX === gridX && t.gridY === gridY);
  }

  /**
   * Update all enemies and handle deaths/escapes
   */
  updateEnemies() {
    for (const enemy of this.enemies) {
      enemy.update();
    }

    // Filter out dead and escaped enemies
    this.enemies = this.enemies.filter(enemy => {
      if (enemy.reachedEnd) {
        this.lives--;
        this.updateUI();
        return false;
      }

      if (enemy.isDead) {
        this.money += enemy.reward;
        this.updateUI();
        return false;
      }

      return true;
    });
  }

  /**
   * Spawn enemies during wave
   */
  spawnEnemies() {
    if (!this.waveInProgress || this.enemiesToSpawn <= 0) return;

    this.spawnTimer--;
    if (this.spawnTimer <= 0) {
      this.enemies.push(new Enemy(this.wave));
      this.enemiesToSpawn--;

      // Calculate next spawn interval
      this.spawnTimer = Math.max(
        CONFIG.MIN_SPAWN_INTERVAL,
        CONFIG.BASE_SPAWN_INTERVAL - this.wave * CONFIG.SPAWN_INTERVAL_DECREASE
      );
    }
  }

  /**
   * Check if current wave is complete
   */
  checkWaveComplete() {
    if (this.waveInProgress && this.enemies.length === 0 && this.enemiesToSpawn === 0) {
      this.waveInProgress = false;
      this.wave++;
      this.startButton.disabled = false;
      this.updateUI();
    }
  }

  /**
   * Handle canvas click for tower placement
   */
  handleCanvasClick(event) {
    if (!this.waveInProgress || this.money < CONFIG.TOWER_COST || this.isGameOver) return;

    const rect = this.canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const grid = pixelToGrid(clickX, clickY);

    // Validate placement
    if (this.isPathTile(grid.x, grid.y) || this.hasTowerAt(grid.x, grid.y)) {
      return;
    }

    // Place tower
    const pixel = gridToPixel(grid.x, grid.y);
    this.towers.push(new Tower(pixel.x, pixel.y, grid.x, grid.y));
    this.money -= CONFIG.TOWER_COST;
    this.updateUI();
  }

  /**
   * Handle start wave button click
   */
  handleStartWave() {
    if (this.waveInProgress || this.isGameOver) return;

    this.waveInProgress = true;
    this.enemiesToSpawn = CONFIG.BASE_ENEMIES_PER_WAVE + this.wave * CONFIG.ENEMIES_PER_WAVE_INCREASE;
    this.spawnTimer = 1;
    this.startButton.disabled = true;
  }

  /**
   * Handle restart button click
   */
  handleRestart() {
    this.init();
  }

  /**
   * Update UI elements
   */
  updateUI() {
    this.moneyElement.textContent = `Money: $${this.money}`;
    this.livesElement.textContent = `Lives: ${this.lives}`;
    this.waveElement.textContent = `Wave: ${this.wave}`;
  }

  /**
   * Handle game over state
   */
  gameOver() {
    this.isGameOver = true;

    // Draw game over overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = 'bold 48px Arial';
    this.ctx.fillStyle = '#ff4444';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 30);

    this.ctx.font = '24px Arial';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(`You reached Wave ${this.wave}`, this.canvas.width / 2, this.canvas.height / 2 + 20);

    // Show restart button
    if (this.restartButton) {
      this.restartButton.style.display = 'inline-block';
    }

    this.startButton.disabled = true;
  }
}

// =============================================================================
// INITIALIZE GAME
// =============================================================================

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.game = new Game('game-canvas');
});
