/**
 * Close Quarter Combat Game
 * A fast-paced melee combat arena game
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  // Canvas settings
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,

  // Player settings
  PLAYER_SPEED: 4,
  PLAYER_RADIUS: 18,
  PLAYER_COLOR: '#4fc3f7',
  PLAYER_MAX_HP: 100,
  PLAYER_ATTACK_RANGE: 60,
  PLAYER_ATTACK_ARC: Math.PI / 2, // 90 degree arc
  PLAYER_ATTACK_DAMAGE: 25,
  PLAYER_ATTACK_COOLDOWN: 20, // frames
  PLAYER_DASH_SPEED: 15,
  PLAYER_DASH_DURATION: 8,
  PLAYER_DASH_COOLDOWN: 45,
  PLAYER_INVINCIBILITY_FRAMES: 30,

  // Enemy settings
  ENEMY_BASE_SPEED: 1.5,
  ENEMY_SPEED_PER_WAVE: 0.1,
  ENEMY_BASE_HP: 30,
  ENEMY_HP_PER_WAVE: 8,
  ENEMY_RADIUS: 14,
  ENEMY_DAMAGE: 15,
  ENEMY_ATTACK_COOLDOWN: 60,
  ENEMY_COLORS: ['#ff6b6b', '#ffa502', '#ff4757', '#ff6348'],

  // Fast enemy (appears in later waves)
  FAST_ENEMY_SPEED_MULT: 1.8,
  FAST_ENEMY_HP_MULT: 0.5,
  FAST_ENEMY_RADIUS: 10,
  FAST_ENEMY_COLOR: '#fffa65',

  // Tank enemy (appears in later waves)
  TANK_ENEMY_SPEED_MULT: 0.5,
  TANK_ENEMY_HP_MULT: 2.5,
  TANK_ENEMY_RADIUS: 22,
  TANK_ENEMY_COLOR: '#a55eea',
  TANK_ENEMY_DAMAGE_MULT: 1.5,

  // Wave settings
  BASE_ENEMIES_PER_WAVE: 5,
  ENEMIES_PER_WAVE_INCREASE: 3,
  SPAWN_DELAY: 60, // frames between spawns
  WAVE_BREAK_TIME: 180, // frames between waves

  // Combat effects
  HIT_FLASH_DURATION: 8,
  PARTICLE_COUNT: 8,
  PARTICLE_SPEED: 4,
  PARTICLE_LIFETIME: 20,

  // Arena
  ARENA_PADDING: 50,
  ARENA_COLOR: '#1a1a2e',
  ARENA_BORDER_COLOR: '#4fc3f7',

  // Scoring
  BASE_KILL_SCORE: 100,
  COMBO_MULTIPLIER: 0.5,
  COMBO_TIMEOUT: 90, // frames to maintain combo
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function normalize(x, y) {
  const len = Math.sqrt(x * x + y * y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: x / len, y: y / len };
}

function angleBetween(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

function isAngleInArc(angle, centerAngle, arcWidth) {
  let diff = angle - centerAngle;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return Math.abs(diff) <= arcWidth / 2;
}

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// =============================================================================
// PARTICLE CLASS
// =============================================================================

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = CONFIG.PARTICLE_SPEED * (0.5 + Math.random() * 0.5);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.lifetime = CONFIG.PARTICLE_LIFETIME;
    this.maxLifetime = CONFIG.PARTICLE_LIFETIME;
    this.radius = 3 + Math.random() * 3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.lifetime--;
  }

  draw(ctx) {
    const alpha = this.lifetime / this.maxLifetime;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * alpha, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  isDead() {
    return this.lifetime <= 0;
  }
}

// =============================================================================
// PLAYER CLASS
// =============================================================================

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = CONFIG.PLAYER_RADIUS;
    this.speed = CONFIG.PLAYER_SPEED;
    this.hp = CONFIG.PLAYER_MAX_HP;
    this.maxHp = CONFIG.PLAYER_MAX_HP;

    // Movement
    this.vx = 0;
    this.vy = 0;
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;

    // Combat
    this.attackCooldown = 0;
    this.isAttacking = false;
    this.attackAngle = 0;
    this.attackTimer = 0;

    // Dash
    this.isDashing = false;
    this.dashTimer = 0;
    this.dashCooldown = 0;
    this.dashAngle = 0;

    // Invincibility
    this.invincibilityTimer = 0;

    // Visual
    this.facingAngle = 0;
    this.hitFlash = 0;
  }

  update(mouseX, mouseY) {
    // Update facing angle towards mouse
    this.facingAngle = angleBetween(this.x, this.y, mouseX, mouseY);

    // Handle dash
    if (this.isDashing) {
      this.dashTimer--;
      this.x += Math.cos(this.dashAngle) * CONFIG.PLAYER_DASH_SPEED;
      this.y += Math.sin(this.dashAngle) * CONFIG.PLAYER_DASH_SPEED;
      if (this.dashTimer <= 0) {
        this.isDashing = false;
      }
    } else {
      // Normal movement
      this.vx = 0;
      this.vy = 0;

      if (this.moveUp) this.vy -= 1;
      if (this.moveDown) this.vy += 1;
      if (this.moveLeft) this.vx -= 1;
      if (this.moveRight) this.vx += 1;

      // Normalize diagonal movement
      if (this.vx !== 0 || this.vy !== 0) {
        const norm = normalize(this.vx, this.vy);
        this.vx = norm.x * this.speed;
        this.vy = norm.y * this.speed;
      }

      this.x += this.vx;
      this.y += this.vy;
    }

    // Keep player in arena bounds
    this.x = clamp(this.x, CONFIG.ARENA_PADDING + this.radius, CONFIG.CANVAS_WIDTH - CONFIG.ARENA_PADDING - this.radius);
    this.y = clamp(this.y, CONFIG.ARENA_PADDING + this.radius, CONFIG.CANVAS_HEIGHT - CONFIG.ARENA_PADDING - this.radius);

    // Update cooldowns
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.dashCooldown > 0) this.dashCooldown--;
    if (this.invincibilityTimer > 0) this.invincibilityTimer--;
    if (this.hitFlash > 0) this.hitFlash--;

    // Update attack animation
    if (this.isAttacking) {
      this.attackTimer--;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
      }
    }
  }

  attack(mouseX, mouseY) {
    if (this.attackCooldown > 0 || this.isDashing) return false;

    this.isAttacking = true;
    this.attackAngle = angleBetween(this.x, this.y, mouseX, mouseY);
    this.attackTimer = 12;
    this.attackCooldown = CONFIG.PLAYER_ATTACK_COOLDOWN;
    return true;
  }

  dash() {
    if (this.dashCooldown > 0 || this.isDashing) return false;

    // Dash in movement direction, or facing direction if not moving
    if (this.vx !== 0 || this.vy !== 0) {
      this.dashAngle = Math.atan2(this.vy, this.vx);
    } else {
      this.dashAngle = this.facingAngle;
    }

    this.isDashing = true;
    this.dashTimer = CONFIG.PLAYER_DASH_DURATION;
    this.dashCooldown = CONFIG.PLAYER_DASH_COOLDOWN;
    this.invincibilityTimer = CONFIG.PLAYER_DASH_DURATION;
    return true;
  }

  takeDamage(amount) {
    if (this.invincibilityTimer > 0) return false;

    this.hp -= amount;
    this.hitFlash = CONFIG.HIT_FLASH_DURATION;
    this.invincibilityTimer = CONFIG.PLAYER_INVINCIBILITY_FRAMES;
    return true;
  }

  canHitEnemy(enemy) {
    if (!this.isAttacking) return false;

    const dist = distance(this.x, this.y, enemy.x, enemy.y);
    if (dist > CONFIG.PLAYER_ATTACK_RANGE + enemy.radius) return false;

    const angleToEnemy = angleBetween(this.x, this.y, enemy.x, enemy.y);
    return isAngleInArc(angleToEnemy, this.attackAngle, CONFIG.PLAYER_ATTACK_ARC);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Draw attack arc
    if (this.isAttacking) {
      ctx.save();
      ctx.rotate(this.attackAngle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, CONFIG.PLAYER_ATTACK_RANGE, -CONFIG.PLAYER_ATTACK_ARC / 2, CONFIG.PLAYER_ATTACK_ARC / 2);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();

      // Draw weapon slash
      const slashProgress = 1 - (this.attackTimer / 12);
      const slashAngle = -CONFIG.PLAYER_ATTACK_ARC / 2 + CONFIG.PLAYER_ATTACK_ARC * slashProgress;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(
        Math.cos(slashAngle) * CONFIG.PLAYER_ATTACK_RANGE,
        Math.sin(slashAngle) * CONFIG.PLAYER_ATTACK_RANGE
      );
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }

    // Draw dash trail
    if (this.isDashing) {
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(79, 195, 247, 0.5)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Draw player body
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);

    // Flash when hit or during invincibility
    if (this.hitFlash > 0) {
      ctx.fillStyle = '#ffffff';
    } else if (this.invincibilityTimer > 0 && Math.floor(this.invincibilityTimer / 4) % 2 === 0) {
      ctx.fillStyle = 'rgba(79, 195, 247, 0.5)';
    } else {
      ctx.fillStyle = CONFIG.PLAYER_COLOR;
    }
    ctx.fill();

    // Draw outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw facing direction indicator
    ctx.rotate(this.facingAngle);
    ctx.beginPath();
    ctx.moveTo(this.radius - 5, 0);
    ctx.lineTo(this.radius + 8, 0);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.restore();

    // Draw HP bar above player
    this.drawHPBar(ctx);

    // Draw dash cooldown indicator
    if (this.dashCooldown > 0) {
      const dashProgress = 1 - (this.dashCooldown / CONFIG.PLAYER_DASH_COOLDOWN);
      ctx.beginPath();
      ctx.arc(this.x, this.y + this.radius + 15, 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * dashProgress);
      ctx.strokeStyle = '#4fc3f7';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  drawHPBar(ctx) {
    const barWidth = 50;
    const barHeight = 6;
    const barY = this.y - this.radius - 15;

    // Background
    ctx.fillStyle = '#333333';
    ctx.fillRect(this.x - barWidth / 2, barY, barWidth, barHeight);

    // HP fill
    const hpPercent = Math.max(0, this.hp / this.maxHp);
    let hpColor = '#4caf50';
    if (hpPercent <= 0.3) hpColor = '#f44336';
    else if (hpPercent <= 0.6) hpColor = '#ffeb3b';

    ctx.fillStyle = hpColor;
    ctx.fillRect(this.x - barWidth / 2, barY, barWidth * hpPercent, barHeight);

    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x - barWidth / 2, barY, barWidth, barHeight);
  }
}

// =============================================================================
// ENEMY CLASS
// =============================================================================

class Enemy {
  constructor(x, y, wave, type = 'normal') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.wave = wave;

    // Set stats based on type
    this.setupStats();

    this.vx = 0;
    this.vy = 0;
    this.attackCooldown = 0;
    this.isDead = false;
    this.hitFlash = 0;
    this.knockbackX = 0;
    this.knockbackY = 0;
  }

  setupStats() {
    const baseSpeed = CONFIG.ENEMY_BASE_SPEED + this.wave * CONFIG.ENEMY_SPEED_PER_WAVE;
    const baseHp = CONFIG.ENEMY_BASE_HP + (this.wave - 1) * CONFIG.ENEMY_HP_PER_WAVE;
    const baseDamage = CONFIG.ENEMY_DAMAGE;

    switch (this.type) {
      case 'fast':
        this.speed = baseSpeed * CONFIG.FAST_ENEMY_SPEED_MULT;
        this.maxHp = baseHp * CONFIG.FAST_ENEMY_HP_MULT;
        this.radius = CONFIG.FAST_ENEMY_RADIUS;
        this.color = CONFIG.FAST_ENEMY_COLOR;
        this.damage = baseDamage * 0.8;
        this.scoreValue = CONFIG.BASE_KILL_SCORE * 0.8;
        break;
      case 'tank':
        this.speed = baseSpeed * CONFIG.TANK_ENEMY_SPEED_MULT;
        this.maxHp = baseHp * CONFIG.TANK_ENEMY_HP_MULT;
        this.radius = CONFIG.TANK_ENEMY_RADIUS;
        this.color = CONFIG.TANK_ENEMY_COLOR;
        this.damage = baseDamage * CONFIG.TANK_ENEMY_DAMAGE_MULT;
        this.scoreValue = CONFIG.BASE_KILL_SCORE * 2;
        break;
      default:
        this.speed = baseSpeed;
        this.maxHp = baseHp;
        this.radius = CONFIG.ENEMY_RADIUS;
        this.color = CONFIG.ENEMY_COLORS[(this.wave - 1) % CONFIG.ENEMY_COLORS.length];
        this.damage = baseDamage;
        this.scoreValue = CONFIG.BASE_KILL_SCORE;
    }

    this.hp = this.maxHp;
  }

  update(player) {
    if (this.isDead) return;

    // Apply knockback
    if (this.knockbackX !== 0 || this.knockbackY !== 0) {
      this.x += this.knockbackX;
      this.y += this.knockbackY;
      this.knockbackX *= 0.8;
      this.knockbackY *= 0.8;
      if (Math.abs(this.knockbackX) < 0.1) this.knockbackX = 0;
      if (Math.abs(this.knockbackY) < 0.1) this.knockbackY = 0;
    }

    // Move towards player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > this.radius + player.radius) {
      const norm = normalize(dx, dy);
      this.vx = norm.x * this.speed;
      this.vy = norm.y * this.speed;
      this.x += this.vx;
      this.y += this.vy;
    }

    // Keep in bounds
    this.x = clamp(this.x, CONFIG.ARENA_PADDING + this.radius, CONFIG.CANVAS_WIDTH - CONFIG.ARENA_PADDING - this.radius);
    this.y = clamp(this.y, CONFIG.ARENA_PADDING + this.radius, CONFIG.CANVAS_HEIGHT - CONFIG.ARENA_PADDING - this.radius);

    // Update cooldowns
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.hitFlash > 0) this.hitFlash--;
  }

  canAttack(player) {
    if (this.attackCooldown > 0) return false;
    const dist = distance(this.x, this.y, player.x, player.y);
    return dist <= this.radius + player.radius + 5;
  }

  attack() {
    this.attackCooldown = CONFIG.ENEMY_ATTACK_COOLDOWN;
    return this.damage;
  }

  takeDamage(amount, fromX, fromY) {
    this.hp -= amount;
    this.hitFlash = CONFIG.HIT_FLASH_DURATION;

    // Apply knockback away from damage source
    const angle = angleBetween(fromX, fromY, this.x, this.y);
    const knockbackForce = 8;
    this.knockbackX = Math.cos(angle) * knockbackForce;
    this.knockbackY = Math.sin(angle) * knockbackForce;

    if (this.hp <= 0) {
      this.isDead = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Draw body
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);

    if (this.hitFlash > 0) {
      ctx.fillStyle = '#ffffff';
    } else {
      ctx.fillStyle = this.color;
    }
    ctx.fill();

    // Draw outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw type indicator for special enemies
    if (this.type === 'fast') {
      // Lightning bolt
      ctx.beginPath();
      ctx.moveTo(-3, -6);
      ctx.lineTo(2, -1);
      ctx.lineTo(-1, -1);
      ctx.lineTo(3, 6);
      ctx.lineTo(-2, 1);
      ctx.lineTo(1, 1);
      ctx.closePath();
      ctx.fillStyle = '#000000';
      ctx.fill();
    } else if (this.type === 'tank') {
      // Shield
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.restore();

    // Draw HP bar
    this.drawHPBar(ctx);
  }

  drawHPBar(ctx) {
    const barWidth = this.radius * 2;
    const barHeight = 4;
    const barY = this.y - this.radius - 10;

    // Background
    ctx.fillStyle = '#333333';
    ctx.fillRect(this.x - barWidth / 2, barY, barWidth, barHeight);

    // HP fill
    const hpPercent = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = hpPercent > 0.3 ? '#ff6b6b' : '#ff0000';
    ctx.fillRect(this.x - barWidth / 2, barY, barWidth * hpPercent, barHeight);
  }
}

// =============================================================================
// GAME CLASS
// =============================================================================

class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    // Set canvas size
    this.canvas.width = CONFIG.CANVAS_WIDTH;
    this.canvas.height = CONFIG.CANVAS_HEIGHT;

    // UI elements
    this.scoreElement = document.getElementById('score');
    this.waveElement = document.getElementById('wave');
    this.comboElement = document.getElementById('combo');
    this.startButton = document.getElementById('start-btn');
    this.restartButton = document.getElementById('restart-btn');

    // Mouse state
    this.mouseX = CONFIG.CANVAS_WIDTH / 2;
    this.mouseY = CONFIG.CANVAS_HEIGHT / 2;

    // Bind methods
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.gameLoop = this.gameLoop.bind(this);

    // Setup event listeners
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    this.startButton.addEventListener('click', this.handleStart);
    if (this.restartButton) {
      this.restartButton.addEventListener('click', this.handleRestart);
    }

    // Initialize
    this.init();
  }

  init() {
    this.player = new Player(CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2);
    this.enemies = [];
    this.particles = [];

    this.score = 0;
    this.wave = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.highestCombo = 0;

    this.isGameOver = false;
    this.isGameStarted = false;
    this.isPaused = false;

    this.enemiesToSpawn = 0;
    this.spawnTimer = 0;
    this.waveBreakTimer = 0;
    this.enemiesSpawnedThisWave = 0;

    this.animationId = null;

    // Reset UI
    this.updateUI();
    this.startButton.style.display = 'inline-block';
    this.startButton.textContent = 'Start Game';
    if (this.restartButton) {
      this.restartButton.style.display = 'none';
    }

    // Draw initial state
    this.drawArena();
    this.drawStartScreen();
  }

  start() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.gameLoop();
  }

  startWave() {
    this.wave++;
    this.enemiesToSpawn = CONFIG.BASE_ENEMIES_PER_WAVE + (this.wave - 1) * CONFIG.ENEMIES_PER_WAVE_INCREASE;
    this.enemiesSpawnedThisWave = 0;
    this.spawnTimer = 30;
    this.updateUI();
  }

  spawnEnemy() {
    // Spawn from random edge
    const edge = Math.floor(Math.random() * 4);
    let x, y;

    switch (edge) {
      case 0: // Top
        x = randomInRange(CONFIG.ARENA_PADDING, CONFIG.CANVAS_WIDTH - CONFIG.ARENA_PADDING);
        y = CONFIG.ARENA_PADDING;
        break;
      case 1: // Right
        x = CONFIG.CANVAS_WIDTH - CONFIG.ARENA_PADDING;
        y = randomInRange(CONFIG.ARENA_PADDING, CONFIG.CANVAS_HEIGHT - CONFIG.ARENA_PADDING);
        break;
      case 2: // Bottom
        x = randomInRange(CONFIG.ARENA_PADDING, CONFIG.CANVAS_WIDTH - CONFIG.ARENA_PADDING);
        y = CONFIG.CANVAS_HEIGHT - CONFIG.ARENA_PADDING;
        break;
      case 3: // Left
        x = CONFIG.ARENA_PADDING;
        y = randomInRange(CONFIG.ARENA_PADDING, CONFIG.CANVAS_HEIGHT - CONFIG.ARENA_PADDING);
        break;
    }

    // Determine enemy type based on wave
    let type = 'normal';
    if (this.wave >= 3) {
      const roll = Math.random();
      if (this.wave >= 5 && roll < 0.15) {
        type = 'tank';
      } else if (roll < 0.3) {
        type = 'fast';
      }
    }

    this.enemies.push(new Enemy(x, y, this.wave, type));
    this.enemiesSpawnedThisWave++;
  }

  gameLoop() {
    if (this.isGameOver || !this.isGameStarted) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw arena
    this.drawArena();

    // Update player
    this.player.update(this.mouseX, this.mouseY);

    // Handle enemy spawning
    if (this.waveBreakTimer > 0) {
      this.waveBreakTimer--;
      if (this.waveBreakTimer === 0) {
        this.startWave();
      }
    } else if (this.enemiesSpawnedThisWave < this.enemiesToSpawn) {
      this.spawnTimer--;
      if (this.spawnTimer <= 0) {
        this.spawnEnemy();
        this.spawnTimer = CONFIG.SPAWN_DELAY;
      }
    }

    // Update enemies
    for (const enemy of this.enemies) {
      enemy.update(this.player);

      // Check enemy attack
      if (enemy.canAttack(this.player)) {
        const damage = enemy.attack();
        if (this.player.takeDamage(damage)) {
          this.spawnParticles(this.player.x, this.player.y, '#ff0000');
          this.combo = 0;
          this.updateUI();
        }
      }
    }

    // Check player attacks
    if (this.player.isAttacking && this.player.attackTimer === 11) {
      for (const enemy of this.enemies) {
        if (!enemy.isDead && this.player.canHitEnemy(enemy)) {
          enemy.takeDamage(CONFIG.PLAYER_ATTACK_DAMAGE, this.player.x, this.player.y);
          this.spawnParticles(enemy.x, enemy.y, enemy.color);

          if (enemy.isDead) {
            this.addScore(enemy.scoreValue);
          }
        }
      }
    }

    // Remove dead enemies
    this.enemies = this.enemies.filter(e => !e.isDead);

    // Update combo timer
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer === 0 && this.combo > 0) {
        this.combo = 0;
        this.updateUI();
      }
    }

    // Check wave completion
    if (this.enemies.length === 0 && this.enemiesSpawnedThisWave >= this.enemiesToSpawn && this.waveBreakTimer === 0) {
      this.waveBreakTimer = CONFIG.WAVE_BREAK_TIME;
    }

    // Update particles
    for (const particle of this.particles) {
      particle.update();
    }
    this.particles = this.particles.filter(p => !p.isDead());

    // Draw everything
    for (const enemy of this.enemies) {
      enemy.draw(this.ctx);
    }

    this.player.draw(this.ctx);

    for (const particle of this.particles) {
      particle.draw(this.ctx);
    }

    // Draw wave info
    this.drawWaveInfo();

    // Check game over
    if (this.player.hp <= 0) {
      this.gameOver();
      return;
    }

    this.animationId = requestAnimationFrame(this.gameLoop);
  }

  addScore(baseScore) {
    this.combo++;
    this.comboTimer = CONFIG.COMBO_TIMEOUT;
    if (this.combo > this.highestCombo) {
      this.highestCombo = this.combo;
    }

    const multiplier = 1 + (this.combo - 1) * CONFIG.COMBO_MULTIPLIER;
    const points = Math.floor(baseScore * multiplier);
    this.score += points;
    this.updateUI();
  }

  spawnParticles(x, y, color) {
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  drawArena() {
    // Background
    this.ctx.fillStyle = CONFIG.ARENA_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Arena border
    this.ctx.strokeStyle = CONFIG.ARENA_BORDER_COLOR;
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(
      CONFIG.ARENA_PADDING,
      CONFIG.ARENA_PADDING,
      CONFIG.CANVAS_WIDTH - CONFIG.ARENA_PADDING * 2,
      CONFIG.CANVAS_HEIGHT - CONFIG.ARENA_PADDING * 2
    );

    // Corner decorations
    const cornerSize = 20;
    const corners = [
      [CONFIG.ARENA_PADDING, CONFIG.ARENA_PADDING],
      [CONFIG.CANVAS_WIDTH - CONFIG.ARENA_PADDING, CONFIG.ARENA_PADDING],
      [CONFIG.CANVAS_WIDTH - CONFIG.ARENA_PADDING, CONFIG.CANVAS_HEIGHT - CONFIG.ARENA_PADDING],
      [CONFIG.ARENA_PADDING, CONFIG.CANVAS_HEIGHT - CONFIG.ARENA_PADDING]
    ];

    this.ctx.fillStyle = CONFIG.ARENA_BORDER_COLOR;
    for (const [cx, cy] of corners) {
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawWaveInfo() {
    if (this.waveBreakTimer > 0) {
      this.ctx.save();
      this.ctx.font = 'bold 32px Arial';
      this.ctx.fillStyle = '#4fc3f7';
      this.ctx.textAlign = 'center';

      if (this.wave === 0) {
        this.ctx.fillText('Get Ready!', CONFIG.CANVAS_WIDTH / 2, 100);
      } else {
        this.ctx.fillText(`Wave ${this.wave} Complete!`, CONFIG.CANVAS_WIDTH / 2, 100);
        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`Next wave in ${Math.ceil(this.waveBreakTimer / 60)}...`, CONFIG.CANVAS_WIDTH / 2, 140);
      }
      this.ctx.restore();
    }
  }

  drawStartScreen() {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = 'bold 48px Arial';
    this.ctx.fillStyle = '#4fc3f7';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Close Quarter Combat', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 - 60);

    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText('WASD to move | Left Click to attack | Right Click or Space to dash', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2);
    this.ctx.fillText('Survive the waves and build combos for higher scores!', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 30);

    this.ctx.restore();
  }

  handleKeyDown(e) {
    if (!this.isGameStarted || this.isGameOver) return;

    switch (e.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        this.player.moveUp = true;
        break;
      case 's':
      case 'arrowdown':
        this.player.moveDown = true;
        break;
      case 'a':
      case 'arrowleft':
        this.player.moveLeft = true;
        break;
      case 'd':
      case 'arrowright':
        this.player.moveRight = true;
        break;
      case ' ':
        e.preventDefault();
        this.player.dash();
        break;
    }
  }

  handleKeyUp(e) {
    switch (e.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        this.player.moveUp = false;
        break;
      case 's':
      case 'arrowdown':
        this.player.moveDown = false;
        break;
      case 'a':
      case 'arrowleft':
        this.player.moveLeft = false;
        break;
      case 'd':
      case 'arrowright':
        this.player.moveRight = false;
        break;
    }
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
  }

  handleMouseDown(e) {
    if (!this.isGameStarted || this.isGameOver) return;

    if (e.button === 0) {
      // Left click - attack
      this.player.attack(this.mouseX, this.mouseY);
    } else if (e.button === 2) {
      // Right click - dash
      this.player.dash();
    }
  }

  handleStart() {
    this.isGameStarted = true;
    this.startButton.style.display = 'none';
    this.waveBreakTimer = 60; // Short delay before first wave
    this.start();
  }

  handleRestart() {
    this.init();
    this.isGameStarted = true;
    this.startButton.style.display = 'none';
    this.waveBreakTimer = 60;
    this.start();
  }

  updateUI() {
    if (this.scoreElement) this.scoreElement.textContent = `Score: ${this.score}`;
    if (this.waveElement) this.waveElement.textContent = `Wave: ${this.wave}`;
    if (this.comboElement) {
      if (this.combo > 1) {
        this.comboElement.textContent = `Combo: x${this.combo}`;
        this.comboElement.style.display = 'inline';
      } else {
        this.comboElement.style.display = 'none';
      }
    }
  }

  gameOver() {
    this.isGameOver = true;

    // Draw game over overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = 'bold 56px Arial';
    this.ctx.fillStyle = '#ff4444';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 - 60);

    this.ctx.font = '28px Arial';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(`Final Score: ${this.score}`, CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2);
    this.ctx.fillText(`Waves Survived: ${this.wave}`, CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 40);
    this.ctx.fillText(`Highest Combo: x${this.highestCombo}`, CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 80);

    // Show restart button
    if (this.restartButton) {
      this.restartButton.style.display = 'inline-block';
    }
  }
}

// =============================================================================
// INITIALIZE GAME
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  window.game = new Game('game-canvas');
});
