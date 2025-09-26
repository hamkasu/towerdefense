// Tower Defense Game
class TowerDefenseGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'menu'; // menu, playing, paused, gameOver, levelComplete
        
        // Game properties
        this.health = 100;
        this.money = 500;
        this.score = 0;
        this.wave = 1;
        this.level = 1;
        this.maxWaves = 5;
        
        // Game objects
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        
        // Game mechanics
        this.selectedTowerType = null;
        this.enemiesSpawned = 0;
        this.enemiesPerWave = 10;
        this.waveInProgress = false;
        this.waveTimer = 0;
        this.spawnTimer = 0;
        this.lastTime = 0;
        
        // Audio
        this.sounds = {
            shoot: null,
            explosion: null,
            enemyHit: null,
            towerPlace: null,
            waveStart: null,
            gameOver: null,
            levelComplete: null
        };
        
        // Path for enemies
        this.path = [
            {x: -30, y: 300},
            {x: 100, y: 300},
            {x: 100, y: 200},
            {x: 300, y: 200},
            {x: 300, y: 400},
            {x: 500, y: 400},
            {x: 500, y: 100},
            {x: 700, y: 100},
            {x: 700, y: 300},
            {x: 830, y: 300}
        ];
        
        // Tower types
        this.towerTypes = {
            basic: {
                cost: 50,
                damage: 20,
                range: 80,
                fireRate: 1000,
                color: '#ff6b6b',
                projectileSpeed: 5,
                projectileColor: '#ff4444'
            },
            fast: {
                cost: 75,
                damage: 15,
                range: 70,
                fireRate: 500,
                color: '#4ecdc4',
                projectileSpeed: 7,
                projectileColor: '#44ddcc'
            },
            heavy: {
                cost: 100,
                damage: 40,
                range: 90,
                fireRate: 1500,
                color: '#a8e6cf',
                projectileSpeed: 4,
                projectileColor: '#88dd88'
            }
        };
        
        // Enemy types based on level
        this.enemyTypes = {
            1: {health: 50, speed: 1, reward: 10, color: '#ff9999'},
            2: {health: 75, speed: 1.2, reward: 15, color: '#99ff99'},
            3: {health: 100, speed: 1.5, reward: 20, color: '#9999ff'},
            4: {health: 150, speed: 1.8, reward: 25, color: '#ffff99'},
            5: {health: 200, speed: 2, reward: 30, color: '#ff99ff'}
        };
        
        this.init();
    }
    
    init() {
        this.initAudio();
        this.bindEvents();
        this.showMenu();
        this.gameLoop();
    }
    
    initAudio() {
        // Create audio context for Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
            return;
        }
        
        // Generate sound effects programmatically
        this.generateSounds();
    }
    
    generateSounds() {
        // Shoot sound
        this.sounds.shoot = this.createSound(0.1, 400, 0.1, 'sine');
        this.sounds.explosion = this.createSound(0.2, 150, 0.3, 'sawtooth');
        this.sounds.enemyHit = this.createSound(0.1, 300, 0.1, 'square');
        this.sounds.towerPlace = this.createSound(0.15, 500, 0.2, 'triangle');
        this.sounds.waveStart = this.createSound(0.3, 600, 0.5, 'sine');
        this.sounds.gameOver = this.createSound(0.5, 200, 1, 'sawtooth');
        this.sounds.levelComplete = this.createSound(0.4, 800, 0.8, 'sine');
    }
    
    createSound(volume, frequency, duration, type) {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }
    
    bindEvents() {
        // Tower selection
        document.querySelectorAll('.tower-button').forEach(button => {
            button.addEventListener('click', (e) => {
                if (this.gameState !== 'playing') return;
                
                const type = button.dataset.type;
                const cost = parseInt(button.dataset.cost);
                
                if (this.money >= cost) {
                    this.selectTower(type);
                    document.querySelectorAll('.tower-button').forEach(b => b.classList.remove('selected'));
                    button.classList.add('selected');
                }
            });
        });
        
        // Canvas click for tower placement
        this.canvas.addEventListener('click', (e) => {
            if (this.gameState !== 'playing' || !this.selectedTowerType) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.placeTower(x, y);
        });
        
        // Game controls
        document.getElementById('startWave').addEventListener('click', () => this.startWave());
        document.getElementById('pauseGame').addEventListener('click', () => this.togglePause());
        document.getElementById('nextLevel').addEventListener('click', () => this.nextLevel());
        
        // Menu controls
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('howToPlay').addEventListener('click', () => this.showInstructions());
        document.getElementById('restartGame').addEventListener('click', () => this.restartGame());
        document.getElementById('backToMenu').addEventListener('click', () => this.showMenu());
        document.getElementById('continueToNext').addEventListener('click', () => this.nextLevel());
        document.getElementById('closeInstructions').addEventListener('click', () => this.hideInstructions());
    }
    
    selectTower(type) {
        this.selectedTowerType = type;
    }
    
    placeTower(x, y) {
        const towerType = this.towerTypes[this.selectedTowerType];
        
        if (this.money >= towerType.cost && this.canPlaceTower(x, y)) {
            this.towers.push(new Tower(x, y, this.selectedTowerType, towerType));
            this.money -= towerType.cost;
            this.playSound('towerPlace');
            this.selectedTowerType = null;
            document.querySelectorAll('.tower-button').forEach(b => b.classList.remove('selected'));
            this.updateUI();
        }
    }
    
    canPlaceTower(x, y) {
        // Check if position is on the path
        for (let i = 0; i < this.path.length - 1; i++) {
            const p1 = this.path[i];
            const p2 = this.path[i + 1];
            
            const dist = this.distanceToLineSegment(x, y, p1.x, p1.y, p2.x, p2.y);
            if (dist < 40) return false;
        }
        
        // Check if position is too close to other towers
        for (const tower of this.towers) {
            const dist = Math.sqrt((x - tower.x) ** 2 + (y - tower.y) ** 2);
            if (dist < 50) return false;
        }
        
        // Check bounds
        return x > 25 && x < this.canvas.width - 25 && y > 25 && y < this.canvas.height - 25;
    }
    
    distanceToLineSegment(px, py, x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
        
        const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (length * length)));
        const projX = x1 + t * dx;
        const projY = y1 + t * dy;
        
        return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
    }
    
    startWave() {
        if (this.waveInProgress) return;
        
        this.waveInProgress = true;
        this.enemiesSpawned = 0;
        this.spawnTimer = 0;
        this.playSound('waveStart');
        
        // Increase difficulty with each wave
        this.enemiesPerWave = 10 + this.wave * 2;
    }
    
    spawnEnemy() {
        if (this.enemiesSpawned >= this.enemiesPerWave) return;
        
        const enemyType = this.enemyTypes[Math.min(this.level, 5)];
        const enemy = new Enemy(this.path[0].x, this.path[0].y, enemyType, this.path);
        
        // Make enemies stronger in later waves
        enemy.health += (this.wave - 1) * 10;
        enemy.maxHealth = enemy.health;
        enemy.speed += (this.wave - 1) * 0.1;
        
        this.enemies.push(enemy);
        this.enemiesSpawned++;
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        // Spawn enemies
        if (this.waveInProgress && this.enemiesSpawned < this.enemiesPerWave) {
            this.spawnTimer += deltaTime;
            if (this.spawnTimer >= 1000) {
                this.spawnEnemy();
                this.spawnTimer = 0;
            }
        }
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(deltaTime);
            
            if (enemy.reachedEnd) {
                this.enemies.splice(i, 1);
                this.health -= 10;
                this.updateUI();
                
                if (this.health <= 0) {
                    this.gameOver();
                    return;
                }
            } else if (enemy.health <= 0) {
                this.enemies.splice(i, 1);
                this.money += enemy.reward;
                this.score += enemy.reward * 10;
                this.createExplosion(enemy.x, enemy.y);
                this.playSound('explosion');
                this.updateUI();
            }
        }
        
        // Update towers
        this.towers.forEach(tower => tower.update(deltaTime, this.enemies, this.projectiles));
        
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(deltaTime);
            
            if (projectile.hasHit || projectile.isOutOfBounds(this.canvas.width, this.canvas.height)) {
                this.projectiles.splice(i, 1);
            }
        }
        
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(deltaTime);
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Check wave completion
        if (this.waveInProgress && this.enemiesSpawned >= this.enemiesPerWave && this.enemies.length === 0) {
            this.waveInProgress = false;
            this.wave++;
            
            if (this.wave > this.maxWaves) {
                this.levelComplete();
            } else {
                this.money += 50; // Bonus for completing wave
                this.updateUI();
            }
        }
        
        this.updateUI();
    }
    
    createExplosion(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push(new Particle(x, y, {
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 500,
                color: '#ff6b6b',
                size: Math.random() * 4 + 2
            }));
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#2d5a27';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw path
        this.drawPath();
        
        // Draw towers
        this.towers.forEach(tower => tower.render(this.ctx));
        
        // Draw enemies
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        
        // Draw projectiles
        this.projectiles.forEach(projectile => projectile.render(this.ctx));
        
        // Draw particles
        this.particles.forEach(particle => particle.render(this.ctx));
        
        // Draw tower placement preview
        if (this.selectedTowerType) {
            this.drawTowerPreview();
        }
    }
    
    drawPath() {
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 30;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        
        this.ctx.stroke();
        
        // Draw path border
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 34;
        this.ctx.globalCompositeOperation = 'destination-over';
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        
        this.ctx.stroke();
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    drawTowerPreview() {
        // This would be implemented with mouse tracking
        // For now, just show selected tower type in UI
    }
    
    updateUI() {
        document.getElementById('health').textContent = this.health;
        document.getElementById('money').textContent = this.money;
        document.getElementById('wave').textContent = this.wave;
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        
        // Update tower button states
        document.querySelectorAll('.tower-button').forEach(button => {
            const cost = parseInt(button.dataset.cost);
            if (this.money < cost) {
                button.classList.add('disabled');
            } else {
                button.classList.remove('disabled');
            }
        });
        
        // Update control buttons
        document.getElementById('startWave').disabled = this.waveInProgress;
        document.getElementById('nextLevel').style.display = (this.wave > this.maxWaves) ? 'block' : 'none';
    }
    
    gameLoop() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    startGame() {
        this.gameState = 'playing';
        this.resetGame();
        this.hideAllScreens();
        this.updateUI();
    }
    
    resetGame() {
        this.health = 100;
        this.money = 500;
        this.score = 0;
        this.wave = 1;
        this.level = 1;
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.selectedTowerType = null;
        this.waveInProgress = false;
        this.enemiesSpawned = 0;
    }
    
    nextLevel() {
        this.level++;
        this.wave = 1;
        this.money += 200; // Level bonus
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.selectedTowerType = null;
        this.waveInProgress = false;
        this.enemiesSpawned = 0;
        this.gameState = 'playing';
        this.hideAllScreens();
        this.updateUI();
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        this.playSound('gameOver');
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').classList.remove('hidden');
    }
    
    levelComplete() {
        this.gameState = 'levelComplete';
        this.playSound('levelComplete');
        document.getElementById('levelScore').textContent = this.score;
        document.getElementById('levelComplete').classList.remove('hidden');
    }
    
    restartGame() {
        this.startGame();
    }
    
    showMenu() {
        this.gameState = 'menu';
        this.hideAllScreens();
        document.getElementById('gameMenu').classList.remove('hidden');
    }
    
    showInstructions() {
        document.getElementById('instructions').classList.remove('hidden');
    }
    
    hideInstructions() {
        document.getElementById('instructions').classList.add('hidden');
    }
    
    hideAllScreens() {
        document.getElementById('gameMenu').classList.add('hidden');
        document.getElementById('gameOver').classList.add('hidden');
        document.getElementById('levelComplete').classList.add('hidden');
        document.getElementById('instructions').classList.add('hidden');
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseGame').textContent = 'Resume';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseGame').textContent = 'Pause';
        }
    }
}

// Tower class
class Tower {
    constructor(x, y, type, config) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.damage = config.damage;
        this.range = config.range;
        this.fireRate = config.fireRate;
        this.color = config.color;
        this.projectileSpeed = config.projectileSpeed;
        this.projectileColor = config.projectileColor;
        this.lastFired = 0;
        this.target = null;
        this.angle = 0;
    }
    
    update(deltaTime, enemies, projectiles) {
        // Find target
        this.target = this.findTarget(enemies);
        
        // Fire at target
        if (this.target && Date.now() - this.lastFired >= this.fireRate) {
            this.fire(projectiles);
            this.lastFired = Date.now();
        }
        
        // Update angle to target
        if (this.target) {
            this.angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        }
    }
    
    findTarget(enemies) {
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        for (const enemy of enemies) {
            const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
            if (distance <= this.range && distance < closestDistance) {
                closestEnemy = enemy;
                closestDistance = distance;
            }
        }
        
        return closestEnemy;
    }
    
    fire(projectiles) {
        if (!this.target) return;
        
        const projectile = new Projectile(
            this.x,
            this.y,
            this.target,
            this.damage,
            this.projectileSpeed,
            this.projectileColor
        );
        
        projectiles.push(projectile);
        
        // Play shoot sound
        if (window.game) {
            window.game.playSound('shoot');
        }
    }
    
    render(ctx) {
        // Draw range circle when selected (simplified)
        // Draw tower body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw tower barrel
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x + Math.cos(this.angle) * 20,
            this.y + Math.sin(this.angle) * 20
        );
        ctx.stroke();
        
        // Draw tower border
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// Enemy class
class Enemy {
    constructor(x, y, config, path) {
        this.x = x;
        this.y = y;
        this.health = config.health;
        this.maxHealth = config.health;
        this.speed = config.speed;
        this.reward = config.reward;
        this.color = config.color;
        this.path = path;
        this.pathIndex = 0;
        this.reachedEnd = false;
    }
    
    update(deltaTime) {
        if (this.reachedEnd || this.pathIndex >= this.path.length - 1) {
            this.reachedEnd = true;
            return;
        }
        
        const target = this.path[this.pathIndex + 1];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5) {
            this.pathIndex++;
            return;
        }
        
        const moveDistance = this.speed * (deltaTime / 16.67); // Normalize to 60fps
        this.x += (dx / distance) * moveDistance;
        this.y += (dy / distance) * moveDistance;
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (window.game) {
            window.game.playSound('enemyHit');
        }
    }
    
    render(ctx) {
        // Draw enemy body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw health bar
        const barWidth = 20;
        const barHeight = 4;
        const healthPercent = this.health / this.maxHealth;
        
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - barWidth / 2, this.y - 20, barWidth, barHeight);
        
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - barWidth / 2, this.y - 20, barWidth * healthPercent, barHeight);
        
        // Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x - barWidth / 2, this.y - 20, barWidth, barHeight);
    }
}

// Projectile class
class Projectile {
    constructor(x, y, target, damage, speed, color) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.speed = speed;
        this.color = color;
        this.hasHit = false;
        
        // Calculate direction
        const dx = target.x - x;
        const dy = target.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.vx = (dx / distance) * speed;
        this.vy = (dy / distance) * speed;
    }
    
    update(deltaTime) {
        if (this.hasHit) return;
        
        const moveDistance = deltaTime / 16.67; // Normalize to 60fps
        this.x += this.vx * moveDistance;
        this.y += this.vy * moveDistance;
        
        // Check collision with target
        if (this.target && !this.target.reachedEnd) {
            const distance = Math.sqrt((this.x - this.target.x) ** 2 + (this.y - this.target.y) ** 2);
            if (distance < 15) {
                this.target.takeDamage(this.damage);
                this.hasHit = true;
            }
        }
    }
    
    isOutOfBounds(canvasWidth, canvasHeight) {
        return this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight;
    }
    
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Particle class for effects
class Particle {
    constructor(x, y, config) {
        this.x = x;
        this.y = y;
        this.vx = config.vx || 0;
        this.vy = config.vy || 0;
        this.life = config.life || 1000;
        this.maxLife = this.life;
        this.color = config.color || '#ffffff';
        this.size = config.size || 2;
    }
    
    update(deltaTime) {
        this.x += this.vx * (deltaTime / 16.67);
        this.y += this.vy * (deltaTime / 16.67);
        this.life -= deltaTime;
        
        // Fade out
        this.alpha = this.life / this.maxLife;
    }
    
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.game = new TowerDefenseGame();
});