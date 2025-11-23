/**
 * Close Quarter Combat - Team Arena
 * A multiplayer team-based melee combat game with AI teammates
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  // Canvas settings
  CANVAS_WIDTH: 900,
  CANVAS_HEIGHT: 650,

  // Player settings
  PLAYER_SPEED: 4,
  PLAYER_RADIUS: 18,
  PLAYER_MAX_HP: 100,
  PLAYER_ATTACK_RANGE: 60,
  PLAYER_ATTACK_ARC: Math.PI / 2,
  PLAYER_ATTACK_DAMAGE: 25,
  PLAYER_ATTACK_COOLDOWN: 20,
  PLAYER_DASH_SPEED: 15,
  PLAYER_DASH_DURATION: 8,
  PLAYER_DASH_COOLDOWN: 45,
  PLAYER_INVINCIBILITY_FRAMES: 30,

  // Team colors
  TEAM_COLORS: {
    blue: { primary: '#4fc3f7', secondary: '#29b6f6', dark: '#0288d1' },
    red: { primary: '#ff6b6b', secondary: '#ff5252', dark: '#d32f2f' }
  },

  // AI Teammate settings
  AI_REACTION_TIME: 15,
  AI_ATTACK_RANGE: 55,
  AI_PREFERRED_DISTANCE: 40,

  // Enemy settings
  ENEMY_BASE_SPEED: 1.5,
  ENEMY_SPEED_PER_WAVE: 0.1,
  ENEMY_BASE_HP: 30,
  ENEMY_HP_PER_WAVE: 8,
  ENEMY_RADIUS: 14,
  ENEMY_DAMAGE: 15,
  ENEMY_ATTACK_COOLDOWN: 60,
  ENEMY_COLORS: ['#ff6b6b', '#ffa502', '#ff4757', '#ff6348'],

  // Special enemies
  FAST_ENEMY_SPEED_MULT: 1.8,
  FAST_ENEMY_HP_MULT: 0.5,
  FAST_ENEMY_RADIUS: 10,
  FAST_ENEMY_COLOR: '#fffa65',

  TANK_ENEMY_SPEED_MULT: 0.5,
  TANK_ENEMY_HP_MULT: 2.5,
  TANK_ENEMY_RADIUS: 22,
  TANK_ENEMY_COLOR: '#a55eea',
  TANK_ENEMY_DAMAGE_MULT: 1.5,

  // Wave settings
  BASE_ENEMIES_PER_WAVE: 6,
  ENEMIES_PER_WAVE_INCREASE: 4,
  ENEMIES_PER_PLAYER_MULT: 0.5,
  SPAWN_DELAY: 50,
  WAVE_BREAK_TIME: 240,

  // Effects
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
  COMBO_TIMEOUT: 90,

  // Room settings
  MAX_PLAYERS_PER_ROOM: 4,
  MIN_AI_TEAMMATES: 1,
  MAX_AI_TEAMMATES: 3,
};

// =============================================================================
// SOUND SYSTEM
// =============================================================================

class SoundSystem {
  constructor() {
    this.enabled = true;
    this.volume = 0.3;
    this.audioContext = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  playTone(frequency, duration, type = 'square', volumeMult = 1) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(this.volume * volumeMult, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  playNoise(duration, volumeMult = 1) {
    if (!this.enabled || !this.audioContext) return;

    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    noise.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(this.volume * volumeMult * 0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.start(now);
    noise.stop(now + duration);
  }

  // Sound effects
  playAttack() {
    this.playTone(200, 0.1, 'sawtooth', 0.6);
    this.playNoise(0.05, 0.4);
  }

  playHit() {
    this.playTone(300, 0.08, 'square', 0.5);
    this.playTone(150, 0.1, 'triangle', 0.3);
  }

  playEnemyHit() {
    this.playTone(400, 0.06, 'square', 0.4);
  }

  playEnemyDeath() {
    this.playTone(200, 0.15, 'sawtooth', 0.5);
    this.playTone(100, 0.2, 'triangle', 0.4);
    this.playNoise(0.1, 0.3);
  }

  playDash() {
    this.playTone(600, 0.1, 'sine', 0.3);
    this.playTone(800, 0.08, 'sine', 0.2);
  }

  playWaveStart() {
    setTimeout(() => this.playTone(440, 0.15, 'sine', 0.4), 0);
    setTimeout(() => this.playTone(550, 0.15, 'sine', 0.4), 150);
    setTimeout(() => this.playTone(660, 0.2, 'sine', 0.5), 300);
  }

  playWaveComplete() {
    setTimeout(() => this.playTone(523, 0.15, 'sine', 0.4), 0);
    setTimeout(() => this.playTone(659, 0.15, 'sine', 0.4), 150);
    setTimeout(() => this.playTone(784, 0.25, 'sine', 0.5), 300);
  }

  playGameOver() {
    setTimeout(() => this.playTone(400, 0.3, 'sawtooth', 0.5), 0);
    setTimeout(() => this.playTone(300, 0.3, 'sawtooth', 0.5), 300);
    setTimeout(() => this.playTone(200, 0.5, 'sawtooth', 0.6), 600);
  }

  playJoin() {
    this.playTone(500, 0.1, 'sine', 0.3);
    this.playTone(700, 0.15, 'sine', 0.4);
  }

  playLeave() {
    this.playTone(500, 0.1, 'sine', 0.3);
    this.playTone(350, 0.15, 'sine', 0.3);
  }

  playCombo() {
    this.playTone(800, 0.05, 'sine', 0.3);
    this.playTone(1000, 0.08, 'sine', 0.4);
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

const sound = new SoundSystem();

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

function generateId() {
  return Math.random().toString(36).substr(2, 9);
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
// FIGHTER BASE CLASS (shared by Player and AI)
// =============================================================================

class Fighter {
  constructor(x, y, team, name) {
    this.id = generateId();
    this.x = x;
    this.y = y;
    this.team = team;
    this.name = name;
    this.radius = CONFIG.PLAYER_RADIUS;
    this.speed = CONFIG.PLAYER_SPEED;
    this.hp = CONFIG.PLAYER_MAX_HP;
    this.maxHp = CONFIG.PLAYER_MAX_HP;

    this.vx = 0;
    this.vy = 0;

    this.attackCooldown = 0;
    this.isAttacking = false;
    this.attackAngle = 0;
    this.attackTimer = 0;

    this.isDashing = false;
    this.dashTimer = 0;
    this.dashCooldown = 0;
    this.dashAngle = 0;

    this.invincibilityTimer = 0;
    this.facingAngle = 0;
    this.hitFlash = 0;
    this.isDead = false;
    this.kills = 0;
  }

  getTeamColors() {
    return CONFIG.TEAM_COLORS[this.team] || CONFIG.TEAM_COLORS.blue;
  }

  takeDamage(amount) {
    if (this.invincibilityTimer > 0 || this.isDead) return false;

    this.hp -= amount;
    this.hitFlash = CONFIG.HIT_FLASH_DURATION;
    this.invincibilityTimer = CONFIG.PLAYER_INVINCIBILITY_FRAMES;

    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
    }
    return true;
  }

  respawn(x, y) {
    this.x = x;
    this.y = y;
    this.hp = this.maxHp;
    this.isDead = false;
    this.invincibilityTimer = 60;
  }

  canHitEnemy(enemy) {
    if (!this.isAttacking || this.attackTimer !== 11) return false;

    const dist = distance(this.x, this.y, enemy.x, enemy.y);
    if (dist > CONFIG.PLAYER_ATTACK_RANGE + enemy.radius) return false;

    const angleToEnemy = angleBetween(this.x, this.y, enemy.x, enemy.y);
    return isAngleInArc(angleToEnemy, this.attackAngle, CONFIG.PLAYER_ATTACK_ARC);
  }

  draw(ctx, isLocalPlayer = false) {
    if (this.isDead) return;

    const colors = this.getTeamColors();

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
      ctx.fillStyle = `rgba(255, 255, 255, 0.3)`;
      ctx.fill();

      const slashProgress = 1 - (this.attackTimer / 12);
      const slashAngle = -CONFIG.PLAYER_ATTACK_ARC / 2 + CONFIG.PLAYER_ATTACK_ARC * slashProgress;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(slashAngle) * CONFIG.PLAYER_ATTACK_RANGE, Math.sin(slashAngle) * CONFIG.PLAYER_ATTACK_RANGE);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }

    // Draw dash trail
    if (this.isDashing) {
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = `${colors.primary}88`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Draw body
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);

    if (this.hitFlash > 0) {
      ctx.fillStyle = '#ffffff';
    } else if (this.invincibilityTimer > 0 && Math.floor(this.invincibilityTimer / 4) % 2 === 0) {
      ctx.fillStyle = `${colors.primary}88`;
    } else {
      ctx.fillStyle = colors.primary;
    }
    ctx.fill();

    // Draw outline
    ctx.strokeStyle = isLocalPlayer ? '#ffffff' : colors.dark;
    ctx.lineWidth = isLocalPlayer ? 4 : 3;
    ctx.stroke();

    // Draw facing direction
    ctx.rotate(this.facingAngle);
    ctx.beginPath();
    ctx.moveTo(this.radius - 5, 0);
    ctx.lineTo(this.radius + 8, 0);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.restore();

    // Draw HP bar
    this.drawHPBar(ctx);

    // Draw name
    this.drawName(ctx, isLocalPlayer);

    // Draw local player indicator
    if (isLocalPlayer && this.dashCooldown > 0) {
      const dashProgress = 1 - (this.dashCooldown / CONFIG.PLAYER_DASH_COOLDOWN);
      ctx.beginPath();
      ctx.arc(this.x, this.y + this.radius + 20, 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * dashProgress);
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  drawHPBar(ctx) {
    const barWidth = 50;
    const barHeight = 6;
    const barY = this.y - this.radius - 18;
    const colors = this.getTeamColors();

    ctx.fillStyle = '#333333';
    ctx.fillRect(this.x - barWidth / 2, barY, barWidth, barHeight);

    const hpPercent = Math.max(0, this.hp / this.maxHp);
    let hpColor = colors.primary;
    if (hpPercent <= 0.3) hpColor = '#f44336';
    else if (hpPercent <= 0.6) hpColor = '#ffeb3b';

    ctx.fillStyle = hpColor;
    ctx.fillRect(this.x - barWidth / 2, barY, barWidth * hpPercent, barHeight);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x - barWidth / 2, barY, barWidth, barHeight);
  }

  drawName(ctx, isLocalPlayer) {
    ctx.save();
    ctx.font = isLocalPlayer ? 'bold 12px Arial' : '11px Arial';
    ctx.fillStyle = isLocalPlayer ? '#ffffff' : '#cccccc';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, this.x, this.y - this.radius - 24);
    ctx.restore();
  }
}

// =============================================================================
// PLAYER CLASS (Human controlled)
// =============================================================================

class Player extends Fighter {
  constructor(x, y, team, name) {
    super(x, y, team, name);
    this.isAI = false;

    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;
  }

  update(mouseX, mouseY) {
    if (this.isDead) return;

    this.facingAngle = angleBetween(this.x, this.y, mouseX, mouseY);

    if (this.isDashing) {
      this.dashTimer--;
      this.x += Math.cos(this.dashAngle) * CONFIG.PLAYER_DASH_SPEED;
      this.y += Math.sin(this.dashAngle) * CONFIG.PLAYER_DASH_SPEED;
      if (this.dashTimer <= 0) {
        this.isDashing = false;
      }
    } else {
      this.vx = 0;
      this.vy = 0;

      if (this.moveUp) this.vy -= 1;
      if (this.moveDown) this.vy += 1;
      if (this.moveLeft) this.vx -= 1;
      if (this.moveRight) this.vx += 1;

      if (this.vx !== 0 || this.vy !== 0) {
        const norm = normalize(this.vx, this.vy);
        this.vx = norm.x * this.speed;
        this.vy = norm.y * this.speed;
      }

      this.x += this.vx;
      this.y += this.vy;
    }

    this.x = clamp(this.x, CONFIG.ARENA_PADDING + this.radius, CONFIG.CANVAS_WIDTH - CONFIG.ARENA_PADDING - this.radius);
    this.y = clamp(this.y, CONFIG.ARENA_PADDING + this.radius, CONFIG.CANVAS_HEIGHT - CONFIG.ARENA_PADDING - this.radius);

    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.dashCooldown > 0) this.dashCooldown--;
    if (this.invincibilityTimer > 0) this.invincibilityTimer--;
    if (this.hitFlash > 0) this.hitFlash--;

    if (this.isAttacking) {
      this.attackTimer--;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
      }
    }
  }

  attack(mouseX, mouseY) {
    if (this.attackCooldown > 0 || this.isDashing || this.isDead) return false;

    this.isAttacking = true;
    this.attackAngle = angleBetween(this.x, this.y, mouseX, mouseY);
    this.attackTimer = 12;
    this.attackCooldown = CONFIG.PLAYER_ATTACK_COOLDOWN;
    sound.playAttack();
    return true;
  }

  dash() {
    if (this.dashCooldown > 0 || this.isDashing || this.isDead) return false;

    if (this.vx !== 0 || this.vy !== 0) {
      this.dashAngle = Math.atan2(this.vy, this.vx);
    } else {
      this.dashAngle = this.facingAngle;
    }

    this.isDashing = true;
    this.dashTimer = CONFIG.PLAYER_DASH_DURATION;
    this.dashCooldown = CONFIG.PLAYER_DASH_COOLDOWN;
    this.invincibilityTimer = CONFIG.PLAYER_DASH_DURATION;
    sound.playDash();
    return true;
  }
}

// =============================================================================
// AI TEAMMATE CLASS
// =============================================================================

class AITeammate extends Fighter {
  constructor(x, y, team, name) {
    super(x, y, team, name);
    this.isAI = true;
    this.targetEnemy = null;
    this.reactionTimer = 0;
    this.wanderAngle = Math.random() * Math.PI * 2;
    this.stuckTimer = 0;
    this.lastX = x;
    this.lastY = y;
  }

  update(enemies, teammates) {
    if (this.isDead) return;

    // Update cooldowns
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.dashCooldown > 0) this.dashCooldown--;
    if (this.invincibilityTimer > 0) this.invincibilityTimer--;
    if (this.hitFlash > 0) this.hitFlash--;
    if (this.reactionTimer > 0) this.reactionTimer--;

    // Update attack animation
    if (this.isAttacking) {
      this.attackTimer--;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
      }
    }

    // Check if stuck
    if (distance(this.x, this.y, this.lastX, this.lastY) < 0.5) {
      this.stuckTimer++;
      if (this.stuckTimer > 30) {
        this.wanderAngle = Math.random() * Math.PI * 2;
        this.stuckTimer = 0;
      }
    } else {
      this.stuckTimer = 0;
    }
    this.lastX = this.x;
    this.lastY = this.y;

    // Find target
    if (this.reactionTimer <= 0) {
      this.targetEnemy = this.findBestTarget(enemies);
      this.reactionTimer = CONFIG.AI_REACTION_TIME;
    }

    // Handle dash
    if (this.isDashing) {
      this.dashTimer--;
      this.x += Math.cos(this.dashAngle) * CONFIG.PLAYER_DASH_SPEED;
      this.y += Math.sin(this.dashAngle) * CONFIG.PLAYER_DASH_SPEED;
      if (this.dashTimer <= 0) {
        this.isDashing = false;
      }
    } else {
      this.decideMovement(enemies, teammates);
    }

    // Clamp position
    this.x = clamp(this.x, CONFIG.ARENA_PADDING + this.radius, CONFIG.CANVAS_WIDTH - CONFIG.ARENA_PADDING - this.radius);
    this.y = clamp(this.y, CONFIG.ARENA_PADDING + this.radius, CONFIG.CANVAS_HEIGHT - CONFIG.ARENA_PADDING - this.radius);
  }

  findBestTarget(enemies) {
    let bestTarget = null;
    let bestScore = -Infinity;

    for (const enemy of enemies) {
      if (enemy.isDead) continue;

      const dist = distance(this.x, this.y, enemy.x, enemy.y);
      const hpPercent = enemy.hp / enemy.maxHp;

      // Score based on distance and HP (prefer closer, lower HP enemies)
      let score = 1000 - dist - hpPercent * 100;

      // Bonus for enemies already damaged
      if (hpPercent < 0.5) score += 200;

      if (score > bestScore) {
        bestScore = score;
        bestTarget = enemy;
      }
    }

    return bestTarget;
  }

  decideMovement(enemies, teammates) {
    this.vx = 0;
    this.vy = 0;

    // Check for dangerous nearby enemies
    let nearbyDanger = false;
    let dangerCount = 0;
    for (const enemy of enemies) {
      if (!enemy.isDead && distance(this.x, this.y, enemy.x, enemy.y) < 50) {
        dangerCount++;
        if (dangerCount >= 3) {
          nearbyDanger = true;
          break;
        }
      }
    }

    // Dash away if surrounded and can dash
    if (nearbyDanger && this.dashCooldown <= 0 && !this.isDashing) {
      // Dash away from center of enemies
      let avgX = 0, avgY = 0, count = 0;
      for (const enemy of enemies) {
        if (!enemy.isDead && distance(this.x, this.y, enemy.x, enemy.y) < 80) {
          avgX += enemy.x;
          avgY += enemy.y;
          count++;
        }
      }
      if (count > 0) {
        avgX /= count;
        avgY /= count;
        this.dashAngle = angleBetween(avgX, avgY, this.x, this.y);
        this.isDashing = true;
        this.dashTimer = CONFIG.PLAYER_DASH_DURATION;
        this.dashCooldown = CONFIG.PLAYER_DASH_COOLDOWN;
        this.invincibilityTimer = CONFIG.PLAYER_DASH_DURATION;
        return;
      }
    }

    if (this.targetEnemy && !this.targetEnemy.isDead) {
      const dist = distance(this.x, this.y, this.targetEnemy.x, this.targetEnemy.y);
      const angleToTarget = angleBetween(this.x, this.y, this.targetEnemy.x, this.targetEnemy.y);

      this.facingAngle = angleToTarget;

      // Attack if in range
      if (dist <= CONFIG.AI_ATTACK_RANGE && this.attackCooldown <= 0 && !this.isAttacking) {
        this.isAttacking = true;
        this.attackAngle = angleToTarget;
        this.attackTimer = 12;
        this.attackCooldown = CONFIG.PLAYER_ATTACK_COOLDOWN;
      }

      // Move towards or maintain distance
      if (dist > CONFIG.AI_PREFERRED_DISTANCE + 10) {
        // Move closer
        const norm = normalize(this.targetEnemy.x - this.x, this.targetEnemy.y - this.y);
        this.vx = norm.x * this.speed;
        this.vy = norm.y * this.speed;
      } else if (dist < CONFIG.AI_PREFERRED_DISTANCE - 10) {
        // Back away slightly
        const norm = normalize(this.x - this.targetEnemy.x, this.y - this.targetEnemy.y);
        this.vx = norm.x * this.speed * 0.5;
        this.vy = norm.y * this.speed * 0.5;
      } else {
        // Circle strafe
        const perpAngle = angleToTarget + Math.PI / 2;
        this.vx = Math.cos(perpAngle) * this.speed * 0.6;
        this.vy = Math.sin(perpAngle) * this.speed * 0.6;
      }
    } else {
      // Wander when no target
      this.wanderAngle += (Math.random() - 0.5) * 0.2;
      this.vx = Math.cos(this.wanderAngle) * this.speed * 0.5;
      this.vy = Math.sin(this.wanderAngle) * this.speed * 0.5;
      this.facingAngle = this.wanderAngle;
    }

    // Avoid teammates
    for (const teammate of teammates) {
      if (teammate.id === this.id || teammate.isDead) continue;
      const dist = distance(this.x, this.y, teammate.x, teammate.y);
      if (dist < 40) {
        const pushAngle = angleBetween(teammate.x, teammate.y, this.x, this.y);
        this.vx += Math.cos(pushAngle) * 1.5;
        this.vy += Math.sin(pushAngle) * 1.5;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
  }
}

// =============================================================================
// ENEMY CLASS
// =============================================================================

class Enemy {
  constructor(x, y, wave, type = 'normal') {
    this.id = generateId();
    this.x = x;
    this.y = y;
    this.type = type;
    this.wave = wave;

    this.setupStats();

    this.vx = 0;
    this.vy = 0;
    this.attackCooldown = 0;
    this.isDead = false;
    this.hitFlash = 0;
    this.knockbackX = 0;
    this.knockbackY = 0;
    this.targetFighter = null;
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

  findTarget(fighters) {
    let closest = null;
    let closestDist = Infinity;

    for (const fighter of fighters) {
      if (fighter.isDead) continue;
      const dist = distance(this.x, this.y, fighter.x, fighter.y);
      if (dist < closestDist) {
        closestDist = dist;
        closest = fighter;
      }
    }

    return closest;
  }

  update(fighters) {
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

    // Find target
    this.targetFighter = this.findTarget(fighters);

    if (this.targetFighter) {
      const dx = this.targetFighter.x - this.x;
      const dy = this.targetFighter.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > this.radius + this.targetFighter.radius) {
        const norm = normalize(dx, dy);
        this.vx = norm.x * this.speed;
        this.vy = norm.y * this.speed;
        this.x += this.vx;
        this.y += this.vy;
      }
    }

    this.x = clamp(this.x, CONFIG.ARENA_PADDING + this.radius, CONFIG.CANVAS_WIDTH - CONFIG.ARENA_PADDING - this.radius);
    this.y = clamp(this.y, CONFIG.ARENA_PADDING + this.radius, CONFIG.CANVAS_HEIGHT - CONFIG.ARENA_PADDING - this.radius);

    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.hitFlash > 0) this.hitFlash--;
  }

  canAttack(fighter) {
    if (this.attackCooldown > 0) return false;
    const dist = distance(this.x, this.y, fighter.x, fighter.y);
    return dist <= this.radius + fighter.radius + 5;
  }

  attack() {
    this.attackCooldown = CONFIG.ENEMY_ATTACK_COOLDOWN;
    return this.damage;
  }

  takeDamage(amount, fromX, fromY) {
    this.hp -= amount;
    this.hitFlash = CONFIG.HIT_FLASH_DURATION;

    const angle = angleBetween(fromX, fromY, this.x, this.y);
    const knockbackForce = 8;
    this.knockbackX = Math.cos(angle) * knockbackForce;
    this.knockbackY = Math.sin(angle) * knockbackForce;

    if (this.hp <= 0) {
      this.isDead = true;
      sound.playEnemyDeath();
    } else {
      sound.playEnemyHit();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);

    if (this.hitFlash > 0) {
      ctx.fillStyle = '#ffffff';
    } else {
      ctx.fillStyle = this.color;
    }
    ctx.fill();

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (this.type === 'fast') {
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
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.restore();

    this.drawHPBar(ctx);
  }

  drawHPBar(ctx) {
    const barWidth = this.radius * 2;
    const barHeight = 4;
    const barY = this.y - this.radius - 10;

    ctx.fillStyle = '#333333';
    ctx.fillRect(this.x - barWidth / 2, barY, barWidth, barHeight);

    const hpPercent = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = hpPercent > 0.3 ? '#ff6b6b' : '#ff0000';
    ctx.fillRect(this.x - barWidth / 2, barY, barWidth * hpPercent, barHeight);
  }
}

// =============================================================================
// ROOM MANAGER
// =============================================================================

class RoomManager {
  constructor(game) {
    this.game = game;
    this.ws = null;
    this.connected = false;
    this.playerId = null;
    this.roomId = null;
    this.roomCode = null;
    this.players = new Map();
    this.isHost = false;

    this.setupUI();
  }

  setupUI() {
    this.lobbyScreen = document.getElementById('lobby-screen');
    this.gameScreen = document.getElementById('game-screen');
    this.roomCodeInput = document.getElementById('room-code-input');
    this.playerNameInput = document.getElementById('player-name');
    this.createRoomBtn = document.getElementById('create-room-btn');
    this.joinRoomBtn = document.getElementById('join-room-btn');
    this.playOfflineBtn = document.getElementById('play-offline-btn');
    this.leaveRoomBtn = document.getElementById('leave-room-btn');
    this.currentRoomCode = document.getElementById('current-room-code');
    this.playersList = document.getElementById('players-list');
    this.aiCountSelect = document.getElementById('ai-count');
    this.connectionStatus = document.getElementById('connection-status');

    this.createRoomBtn.addEventListener('click', () => this.createRoom());
    this.joinRoomBtn.addEventListener('click', () => this.joinRoom());
    this.playOfflineBtn.addEventListener('click', () => this.playOffline());
    this.leaveRoomBtn.addEventListener('click', () => this.leaveRoom());

    // Load saved name
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      this.playerNameInput.value = savedName;
    }
  }

  connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.connected = true;
        this.updateConnectionStatus(true);
        console.log('Connected to server');
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };

      this.ws.onclose = () => {
        this.connected = false;
        this.updateConnectionStatus(false);
        console.log('Disconnected from server');
        // Try to reconnect
        setTimeout(() => this.connect(), 3000);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.updateConnectionStatus(false);
      };
    } catch (e) {
      console.error('Failed to connect:', e);
      this.updateConnectionStatus(false);
    }
  }

  updateConnectionStatus(connected) {
    if (this.connectionStatus) {
      this.connectionStatus.textContent = connected ? 'Online' : 'Offline';
      this.connectionStatus.className = connected ? 'status-online' : 'status-offline';
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  handleMessage(data) {
    switch (data.type) {
      case 'connected':
        this.playerId = data.playerId;
        break;

      case 'room_created':
      case 'room_joined':
        this.roomId = data.roomId;
        this.roomCode = data.roomCode;
        this.isHost = data.isHost;
        this.currentRoomCode.textContent = this.roomCode;
        this.updatePlayersList(data.players);
        sound.playJoin();
        break;

      case 'player_joined':
        this.updatePlayersList(data.players);
        sound.playJoin();
        break;

      case 'player_left':
        this.updatePlayersList(data.players);
        this.isHost = data.newHostId === this.playerId;
        sound.playLeave();
        break;

      case 'game_start':
        this.startMultiplayerGame(data);
        break;

      case 'game_update':
        this.game.handleNetworkUpdate(data);
        break;

      case 'room_left':
        this.roomId = null;
        this.roomCode = null;
        this.showLobby();
        break;

      case 'error':
        alert(data.message);
        break;
    }
  }

  getPlayerName() {
    const name = this.playerNameInput.value.trim() || `Player${Math.floor(Math.random() * 1000)}`;
    localStorage.setItem('playerName', name);
    return name;
  }

  createRoom() {
    const name = this.getPlayerName();
    if (this.connected) {
      this.send({ type: 'create_room', playerName: name });
    } else {
      this.playOffline();
    }
  }

  joinRoom() {
    const code = this.roomCodeInput.value.trim().toUpperCase();
    if (!code) {
      alert('Please enter a room code');
      return;
    }
    const name = this.getPlayerName();
    if (this.connected) {
      this.send({ type: 'join_room', roomCode: code, playerName: name });
    } else {
      alert('Not connected to server. Play offline instead.');
    }
  }

  playOffline() {
    const name = this.getPlayerName();
    const aiCount = parseInt(this.aiCountSelect.value) || 2;
    this.game.startOfflineGame(name, aiCount);
    this.showGame();
  }

  leaveRoom() {
    if (this.roomId) {
      this.send({ type: 'leave_room' });
    }
    this.game.stopGame();
    this.showLobby();
  }

  updatePlayersList(players) {
    this.players.clear();
    this.playersList.innerHTML = '';

    players.forEach(player => {
      this.players.set(player.id, player);
      const li = document.createElement('li');
      li.textContent = player.name + (player.isHost ? ' (Host)' : '');
      li.className = player.id === this.playerId ? 'local-player' : '';
      this.playersList.appendChild(li);
    });
  }

  startGame() {
    if (!this.isHost) return;
    const aiCount = parseInt(this.aiCountSelect.value) || 2;
    this.send({ type: 'start_game', aiCount });
  }

  startMultiplayerGame(data) {
    this.game.startMultiplayerGame(data);
    this.showGame();
  }

  showLobby() {
    this.lobbyScreen.style.display = 'block';
    this.gameScreen.style.display = 'none';
  }

  showGame() {
    this.lobbyScreen.style.display = 'none';
    this.gameScreen.style.display = 'block';
  }
}

// =============================================================================
// GAME CLASS
// =============================================================================

class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = CONFIG.CANVAS_WIDTH;
    this.canvas.height = CONFIG.CANVAS_HEIGHT;

    // UI elements
    this.scoreElement = document.getElementById('score');
    this.waveElement = document.getElementById('wave');
    this.comboElement = document.getElementById('combo');
    this.teamScoreElement = document.getElementById('team-score');
    this.startWaveBtn = document.getElementById('start-wave-btn');
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');

    // Game state
    this.isRunning = false;
    this.isMultiplayer = false;
    this.localPlayer = null;
    this.teammates = [];
    this.enemies = [];
    this.particles = [];

    this.score = 0;
    this.teamScore = 0;
    this.wave = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.highestCombo = 0;

    this.isGameOver = false;
    this.enemiesToSpawn = 0;
    this.spawnTimer = 0;
    this.waveBreakTimer = 0;
    this.enemiesSpawnedThisWave = 0;
    this.waveInProgress = false;

    this.mouseX = CONFIG.CANVAS_WIDTH / 2;
    this.mouseY = CONFIG.CANVAS_HEIGHT / 2;

    this.animationId = null;

    // Bind methods
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.gameLoop = this.gameLoop.bind(this);

    // Setup event listeners
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    if (this.startWaveBtn) {
      this.startWaveBtn.addEventListener('click', () => this.startNextWave());
    }

    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => {
        const enabled = sound.toggle();
        this.soundToggleBtn.textContent = enabled ? 'Sound: ON' : 'Sound: OFF';
      });
    }

    // Room manager
    this.roomManager = new RoomManager(this);
    this.roomManager.connect();

    // Draw initial state
    this.drawArena();
  }

  startOfflineGame(playerName, aiCount) {
    sound.init();
    sound.resume();

    this.isMultiplayer = false;
    this.isRunning = true;
    this.isGameOver = false;

    // Reset state
    this.enemies = [];
    this.particles = [];
    this.score = 0;
    this.teamScore = 0;
    this.wave = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.highestCombo = 0;
    this.enemiesToSpawn = 0;
    this.spawnTimer = 0;
    this.waveBreakTimer = 0;
    this.enemiesSpawnedThisWave = 0;
    this.waveInProgress = false;

    // Create local player
    this.localPlayer = new Player(
      CONFIG.CANVAS_WIDTH / 2,
      CONFIG.CANVAS_HEIGHT / 2,
      'blue',
      playerName
    );

    // Create AI teammates
    this.teammates = [this.localPlayer];
    const aiNames = ['Alpha', 'Bravo', 'Charlie', 'Delta'];
    for (let i = 0; i < aiCount; i++) {
      const angle = (Math.PI * 2 / (aiCount + 1)) * (i + 1);
      const dist = 80;
      const x = CONFIG.CANVAS_WIDTH / 2 + Math.cos(angle) * dist;
      const y = CONFIG.CANVAS_HEIGHT / 2 + Math.sin(angle) * dist;
      const ai = new AITeammate(x, y, 'blue', aiNames[i % aiNames.length]);
      this.teammates.push(ai);
    }

    this.updateUI();

    // Show start wave button
    if (this.startWaveBtn) {
      this.startWaveBtn.style.display = 'inline-block';
      this.startWaveBtn.disabled = false;
    }

    // Start game loop
    this.startGameLoop();
  }

  startMultiplayerGame(data) {
    sound.init();
    sound.resume();

    this.isMultiplayer = true;
    this.isRunning = true;
    // ... multiplayer implementation would go here
  }

  handleNetworkUpdate(data) {
    // Handle network updates for multiplayer
  }

  stopGame() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  startGameLoop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.gameLoop();
  }

  startNextWave() {
    if (this.waveInProgress || this.isGameOver) return;

    this.wave++;
    this.waveInProgress = true;

    // Calculate enemies based on wave and team size
    const teamSize = this.teammates.filter(t => !t.isDead).length;
    this.enemiesToSpawn = Math.floor(
      CONFIG.BASE_ENEMIES_PER_WAVE +
      (this.wave - 1) * CONFIG.ENEMIES_PER_WAVE_INCREASE +
      teamSize * CONFIG.ENEMIES_PER_PLAYER_MULT * this.wave
    );
    this.enemiesSpawnedThisWave = 0;
    this.spawnTimer = 30;

    if (this.startWaveBtn) {
      this.startWaveBtn.disabled = true;
    }

    sound.playWaveStart();
    this.updateUI();
  }

  spawnEnemy() {
    const edge = Math.floor(Math.random() * 4);
    let x, y;

    switch (edge) {
      case 0:
        x = randomInRange(CONFIG.ARENA_PADDING, CONFIG.CANVAS_WIDTH - CONFIG.ARENA_PADDING);
        y = CONFIG.ARENA_PADDING;
        break;
      case 1:
        x = CONFIG.CANVAS_WIDTH - CONFIG.ARENA_PADDING;
        y = randomInRange(CONFIG.ARENA_PADDING, CONFIG.CANVAS_HEIGHT - CONFIG.ARENA_PADDING);
        break;
      case 2:
        x = randomInRange(CONFIG.ARENA_PADDING, CONFIG.CANVAS_WIDTH - CONFIG.ARENA_PADDING);
        y = CONFIG.CANVAS_HEIGHT - CONFIG.ARENA_PADDING;
        break;
      case 3:
        x = CONFIG.ARENA_PADDING;
        y = randomInRange(CONFIG.ARENA_PADDING, CONFIG.CANVAS_HEIGHT - CONFIG.ARENA_PADDING);
        break;
    }

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
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawArena();

    if (!this.isGameOver) {
      // Update local player
      if (this.localPlayer && !this.localPlayer.isDead) {
        this.localPlayer.update(this.mouseX, this.mouseY);
      }

      // Update AI teammates
      for (const teammate of this.teammates) {
        if (teammate.isAI && !teammate.isDead) {
          teammate.update(this.enemies, this.teammates);
        }
      }

      // Spawn enemies
      if (this.waveInProgress && this.enemiesSpawnedThisWave < this.enemiesToSpawn) {
        this.spawnTimer--;
        if (this.spawnTimer <= 0) {
          this.spawnEnemy();
          this.spawnTimer = CONFIG.SPAWN_DELAY;
        }
      }

      // Update enemies
      const aliveFighters = this.teammates.filter(t => !t.isDead);
      for (const enemy of this.enemies) {
        enemy.update(aliveFighters);

        // Check enemy attacks on all fighters
        for (const fighter of aliveFighters) {
          if (enemy.canAttack(fighter)) {
            const damage = enemy.attack();
            if (fighter.takeDamage(damage)) {
              this.spawnParticles(fighter.x, fighter.y, '#ff0000');
              sound.playHit();
              if (fighter === this.localPlayer) {
                this.combo = 0;
                this.updateUI();
              }
            }
          }
        }
      }

      // Check fighter attacks on enemies
      for (const fighter of this.teammates) {
        if (fighter.isDead) continue;

        for (const enemy of this.enemies) {
          if (!enemy.isDead && fighter.canHitEnemy(enemy)) {
            enemy.takeDamage(CONFIG.PLAYER_ATTACK_DAMAGE, fighter.x, fighter.y);
            this.spawnParticles(enemy.x, enemy.y, enemy.color);

            if (enemy.isDead) {
              fighter.kills++;
              this.teamScore += enemy.scoreValue;

              if (fighter === this.localPlayer) {
                this.addScore(enemy.scoreValue);
              }
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
      if (this.waveInProgress && this.enemies.length === 0 && this.enemiesSpawnedThisWave >= this.enemiesToSpawn) {
        this.waveInProgress = false;
        sound.playWaveComplete();

        // Respawn dead teammates
        for (const teammate of this.teammates) {
          if (teammate.isDead) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 50;
            teammate.respawn(
              CONFIG.CANVAS_WIDTH / 2 + Math.cos(angle) * dist,
              CONFIG.CANVAS_HEIGHT / 2 + Math.sin(angle) * dist
            );
          }
        }

        if (this.startWaveBtn) {
          this.startWaveBtn.disabled = false;
        }

        this.updateUI();
      }

      // Check game over (all teammates dead)
      const allDead = this.teammates.every(t => t.isDead);
      if (allDead && this.waveInProgress) {
        this.gameOver();
      }
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

    for (const teammate of this.teammates) {
      teammate.draw(this.ctx, teammate === this.localPlayer);
    }

    for (const particle of this.particles) {
      particle.draw(this.ctx);
    }

    // Draw wave info
    this.drawWaveInfo();

    if (this.isGameOver) {
      this.drawGameOver();
    }

    this.animationId = requestAnimationFrame(this.gameLoop);
  }

  addScore(baseScore) {
    this.combo++;
    this.comboTimer = CONFIG.COMBO_TIMEOUT;
    if (this.combo > this.highestCombo) {
      this.highestCombo = this.combo;
    }

    if (this.combo > 1) {
      sound.playCombo();
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
    this.ctx.fillStyle = CONFIG.ARENA_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.strokeStyle = CONFIG.ARENA_BORDER_COLOR;
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(
      CONFIG.ARENA_PADDING,
      CONFIG.ARENA_PADDING,
      CONFIG.CANVAS_WIDTH - CONFIG.ARENA_PADDING * 2,
      CONFIG.CANVAS_HEIGHT - CONFIG.ARENA_PADDING * 2
    );

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
    if (!this.waveInProgress && this.wave > 0 && this.enemies.length === 0) {
      this.ctx.save();
      this.ctx.font = 'bold 28px Arial';
      this.ctx.fillStyle = '#4fc3f7';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`Wave ${this.wave} Complete!`, CONFIG.CANVAS_WIDTH / 2, 80);
      this.ctx.font = '18px Arial';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText('Click "Next Wave" to continue', CONFIG.CANVAS_WIDTH / 2, 110);
      this.ctx.restore();
    }

    // Draw team stats
    this.ctx.save();
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#888888';
    this.ctx.textAlign = 'left';

    let y = CONFIG.ARENA_PADDING + 20;
    for (const teammate of this.teammates) {
      const status = teammate.isDead ? '(Dead)' : `HP: ${Math.ceil(teammate.hp)}`;
      const killsText = `Kills: ${teammate.kills}`;
      this.ctx.fillStyle = teammate.isDead ? '#ff4444' : '#aaaaaa';
      this.ctx.fillText(`${teammate.name}: ${status} | ${killsText}`, CONFIG.ARENA_PADDING + 10, y);
      y += 18;
    }
    this.ctx.restore();
  }

  drawGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = 'bold 56px Arial';
    this.ctx.fillStyle = '#ff4444';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 - 80);

    this.ctx.font = '24px Arial';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(`Your Score: ${this.score}`, CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 - 20);
    this.ctx.fillText(`Team Score: ${this.teamScore}`, CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 15);
    this.ctx.fillText(`Waves Survived: ${this.wave}`, CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 50);
    this.ctx.fillText(`Highest Combo: x${this.highestCombo}`, CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 85);

    this.ctx.font = '18px Arial';
    this.ctx.fillStyle = '#4fc3f7';
    this.ctx.fillText('Press R to restart or leave room', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 130);
  }

  gameOver() {
    this.isGameOver = true;
    this.waveInProgress = false;
    sound.playGameOver();

    if (this.startWaveBtn) {
      this.startWaveBtn.style.display = 'none';
    }
  }

  restart() {
    if (this.isMultiplayer) {
      this.roomManager.leaveRoom();
    } else {
      const name = this.localPlayer ? this.localPlayer.name : 'Player';
      const aiCount = this.teammates.length - 1;
      this.startOfflineGame(name, aiCount);
    }
  }

  updateUI() {
    if (this.scoreElement) this.scoreElement.textContent = `Score: ${this.score}`;
    if (this.waveElement) this.waveElement.textContent = `Wave: ${this.wave}`;
    if (this.teamScoreElement) this.teamScoreElement.textContent = `Team: ${this.teamScore}`;

    if (this.comboElement) {
      if (this.combo > 1) {
        this.comboElement.textContent = `Combo: x${this.combo}`;
        this.comboElement.style.display = 'inline';
      } else {
        this.comboElement.style.display = 'none';
      }
    }
  }

  handleKeyDown(e) {
    if (!this.localPlayer || this.localPlayer.isDead) {
      if (e.key.toLowerCase() === 'r' && this.isGameOver) {
        this.restart();
      }
      return;
    }

    switch (e.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        this.localPlayer.moveUp = true;
        break;
      case 's':
      case 'arrowdown':
        this.localPlayer.moveDown = true;
        break;
      case 'a':
      case 'arrowleft':
        this.localPlayer.moveLeft = true;
        break;
      case 'd':
      case 'arrowright':
        this.localPlayer.moveRight = true;
        break;
      case ' ':
        e.preventDefault();
        this.localPlayer.dash();
        break;
      case 'r':
        if (this.isGameOver) {
          this.restart();
        }
        break;
    }
  }

  handleKeyUp(e) {
    if (!this.localPlayer) return;

    switch (e.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        this.localPlayer.moveUp = false;
        break;
      case 's':
      case 'arrowdown':
        this.localPlayer.moveDown = false;
        break;
      case 'a':
      case 'arrowleft':
        this.localPlayer.moveLeft = false;
        break;
      case 'd':
      case 'arrowright':
        this.localPlayer.moveRight = false;
        break;
    }
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
  }

  handleMouseDown(e) {
    sound.init();
    sound.resume();

    if (!this.localPlayer || this.localPlayer.isDead) return;

    if (e.button === 0) {
      this.localPlayer.attack(this.mouseX, this.mouseY);
    } else if (e.button === 2) {
      this.localPlayer.dash();
    }
  }
}

// =============================================================================
// INITIALIZE
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  window.game = new Game('game-canvas');
});
