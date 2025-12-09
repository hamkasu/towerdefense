/**
 * VISCERA: TACTICAL BREACH
 * A tactical top-down shooter with realistic ballistics and room-clearing
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  CANVAS_WIDTH: 1000,
  CANVAS_HEIGHT: 700,

  // Map size (separate from viewport)
  MAP_WIDTH: 3000,
  MAP_HEIGHT: 2100,

  // Player
  PLAYER_RADIUS: 12,
  PLAYER_SPEED_STAND: 2.5,
  PLAYER_SPEED_CROUCH: 1.5,
  PLAYER_SPEED_PRONE: 0.6,
  PLAYER_MAX_HP: 100,

  // Team Formations - positions relative to player (angle offset, distance)
  FORMATIONS: {
    follow: {
      name: 'Follow',
      description: 'Teammates follow behind the player',
      positions: [
        { angleOffset: Math.PI * 0.85, distance: 60 },   // Back-left
        { angleOffset: Math.PI * 1.15, distance: 60 },   // Back-right
        { angleOffset: Math.PI, distance: 90 }           // Directly behind
      ]
    },
    closeCombat: {
      name: 'Close Combat',
      description: 'Tight formation for room clearing and CQB',
      positions: [
        { angleOffset: Math.PI * 0.5, distance: 35 },    // Close left
        { angleOffset: Math.PI * -0.5, distance: 35 },   // Close right
        { angleOffset: Math.PI, distance: 45 }           // Close behind
      ]
    },
    wedge: {
      name: 'Wedge',
      description: 'V-formation for open areas',
      positions: [
        { angleOffset: Math.PI * 0.7, distance: 70 },    // Back-left
        { angleOffset: Math.PI * 1.3, distance: 70 },    // Back-right
        { angleOffset: Math.PI, distance: 100 }          // Far behind
      ]
    },
    line: {
      name: 'Line',
      description: 'Single file line for narrow corridors',
      positions: [
        { angleOffset: Math.PI, distance: 50 },          // Behind 1
        { angleOffset: Math.PI, distance: 100 },         // Behind 2
        { angleOffset: Math.PI, distance: 150 }          // Behind 3
      ]
    },
    diamond: {
      name: 'Diamond',
      description: 'All-around security formation',
      positions: [
        { angleOffset: Math.PI * 0.5, distance: 50 },    // Left
        { angleOffset: Math.PI * -0.5, distance: 50 },   // Right
        { angleOffset: Math.PI, distance: 70 }           // Back
      ]
    }
  },

  // Stance accuracy multipliers
  ACCURACY_STAND: 1.0,
  ACCURACY_CROUCH: 0.7,
  ACCURACY_PRONE: 0.4,
  ACCURACY_ADS: 0.3,
  ACCURACY_MOVING: 1.5,

  // Lean
  LEAN_DISTANCE: 15,
  LEAN_SPEED: 0.15,

  // Materials penetration values (0 = no pen, 1 = full pen)
  MATERIALS: {
    air: { pen: 1.0, ricochet: 0, color: '#1a1a2e', name: 'Air' },
    drywall: { pen: 0.8, ricochet: 0.1, color: '#8b7355', name: 'Drywall' },
    wood: { pen: 0.5, ricochet: 0.15, color: '#5c4033', name: 'Wood' },
    concrete: { pen: 0.1, ricochet: 0.6, color: '#4a4a4a', name: 'Concrete' },
    metal: { pen: 0.05, ricochet: 0.8, color: '#6a6a7a', name: 'Metal' },
    glass: { pen: 0.9, ricochet: 0.05, color: '#87ceeb55', name: 'Glass' },
    door: { pen: 0.4, ricochet: 0.2, color: '#654321', name: 'Door' },
  },

  // Weapons
  WEAPONS: {
    pistol: {
      name: 'M9 Pistol',
      damage: 35,
      fireRate: 12,
      magSize: 15,
      reloadTime: 90,
      spread: 0.08,
      penetration: 0.4,
      recoil: 0.15,
      range: 400,
      auto: false,
      sound: 'pistol'
    },
    smg: {
      name: 'MP5 SMG',
      damage: 25,
      fireRate: 5,
      magSize: 30,
      reloadTime: 120,
      spread: 0.12,
      penetration: 0.5,
      recoil: 0.1,
      range: 350,
      auto: true,
      sound: 'smg'
    },
    rifle: {
      name: 'M4 Rifle',
      damage: 45,
      fireRate: 7,
      magSize: 30,
      reloadTime: 150,
      spread: 0.05,
      penetration: 0.8,
      recoil: 0.2,
      range: 600,
      auto: true,
      sound: 'rifle'
    },
    shotgun: {
      name: 'M870 Shotgun',
      damage: 15,
      fireRate: 45,
      magSize: 6,
      reloadTime: 180,
      spread: 0.25,
      penetration: 0.3,
      recoil: 0.4,
      range: 200,
      pellets: 8,
      auto: false,
      sound: 'shotgun'
    }
  },

  // Grenades
  GRENADE_THROW_SPEED: 8,
  FRAG_RADIUS: 120,
  FRAG_DAMAGE: 150,
  FLASH_RADIUS: 150,
  FLASH_DURATION: 180,
  SMOKE_RADIUS: 100,
  SMOKE_DURATION: 600,

  // Breach
  BREACH_RADIUS: 60,
  BREACH_DAMAGE: 100,

  // Enemy
  ENEMY_RADIUS: 12,
  ENEMY_SPEED: 1.8,
  ENEMY_VIEW_RANGE: 300,
  ENEMY_VIEW_ANGLE: Math.PI * 0.7,
  ENEMY_HEARING_RANGE: 200,
  ENEMY_ALERT_RANGE: 250,
  ENEMY_COVER_SEARCH_RANGE: 150,
  ENEMY_FLANK_DISTANCE: 120,
  ENEMY_SUPPRESSION_THRESHOLD: 3,

  // Effects
  MUZZLE_FLASH_DURATION: 3,
  BLOOD_PARTICLES: 6,
  SHELL_CASING_LIFETIME: 120,

  // Dynamic Difficulty Director
  DIFFICULTY: {
    BASE_ENEMY_ACCURACY: 0.4,
    MIN_ACCURACY_MULT: 0.5,
    MAX_ACCURACY_MULT: 1.5,
    BASE_SPAWN_CHANCE_ELITE: 0.40,
    MIN_SPAWN_ELITE_MULT: 0.5,
    MAX_SPAWN_ELITE_MULT: 1.5,
    PERFORMANCE_WINDOW: 600,
    ADJUSTMENT_RATE: 0.02,
    TARGET_HP_PERCENT: 0.6,
    KILL_STREAK_THRESHOLD: 3,
    DAMAGE_STREAK_THRESHOLD: 30,
  },

  // Soldier Classes
  SOLDIER_CLASSES: {
    assault: {
      name: 'Assault',
      description: 'Frontline fighter with balanced combat abilities',
      icon: 'A',
      color: '#ff6b6b',
      stats: {
        health: 100,
        armor: 15,
        speed: 1.0,
        accuracy: 1.0,
        staminaRegen: 1.0
      },
      defaultWeapons: ['rifle', 'pistol'],
      defaultGear: ['plate_carrier', 'combat_helmet', 'frag_grenades']
    },
    breacher: {
      name: 'Breacher',
      description: 'Close quarters specialist with heavy armor',
      icon: 'B',
      color: '#ffa94d',
      stats: {
        health: 120,
        armor: 25,
        speed: 0.85,
        accuracy: 0.9,
        staminaRegen: 0.9
      },
      defaultWeapons: ['shotgun', 'smg'],
      defaultGear: ['heavy_armor', 'ballistic_helmet', 'breach_charges']
    },
    recon: {
      name: 'Recon',
      description: 'Fast scout with enhanced awareness',
      icon: 'R',
      color: '#69db7c',
      stats: {
        health: 80,
        armor: 5,
        speed: 1.25,
        accuracy: 1.15,
        staminaRegen: 1.3
      },
      defaultWeapons: ['smg', 'pistol'],
      defaultGear: ['light_vest', 'patrol_cap', 'smoke_grenades']
    },
    support: {
      name: 'Support',
      description: 'Team support with extra supplies',
      icon: 'S',
      color: '#74c0fc',
      stats: {
        health: 110,
        armor: 20,
        speed: 0.9,
        accuracy: 0.95,
        staminaRegen: 1.1
      },
      defaultWeapons: ['rifle', 'pistol'],
      defaultGear: ['plate_carrier', 'combat_helmet', 'medkit']
    }
  },

  // Gear Items
  GEAR: {
    // Body Armor
    light_vest: {
      name: 'Light Tactical Vest',
      type: 'armor',
      slot: 'body',
      armorBonus: 5,
      speedPenalty: 0,
      description: 'Minimal protection, maximum mobility'
    },
    plate_carrier: {
      name: 'Plate Carrier',
      type: 'armor',
      slot: 'body',
      armorBonus: 15,
      speedPenalty: 0.05,
      description: 'Standard issue ballistic protection'
    },
    heavy_armor: {
      name: 'Heavy Assault Armor',
      type: 'armor',
      slot: 'body',
      armorBonus: 30,
      speedPenalty: 0.15,
      description: 'Maximum protection for breaching operations'
    },

    // Helmets
    patrol_cap: {
      name: 'Patrol Cap',
      type: 'helmet',
      slot: 'head',
      armorBonus: 0,
      awarenessBonus: 0.1,
      description: 'No protection, better peripheral vision'
    },
    combat_helmet: {
      name: 'Combat Helmet',
      type: 'helmet',
      slot: 'head',
      armorBonus: 10,
      awarenessBonus: 0,
      description: 'Standard ballistic helmet with NVG mount'
    },
    ballistic_helmet: {
      name: 'Ballistic Face Shield',
      type: 'helmet',
      slot: 'head',
      armorBonus: 20,
      awarenessBonus: -0.1,
      description: 'Full face protection, reduced visibility'
    },

    // Tactical Equipment
    frag_grenades: {
      name: 'Frag Grenades x3',
      type: 'equipment',
      slot: 'tactical',
      grenades: { frag: 3 },
      description: 'Lethal fragmentation grenades'
    },
    smoke_grenades: {
      name: 'Smoke Grenades x4',
      type: 'equipment',
      slot: 'tactical',
      grenades: { smoke: 4 },
      description: 'Concealment smoke canisters'
    },
    breach_charges: {
      name: 'Breach Charges x2',
      type: 'equipment',
      slot: 'tactical',
      breachCharges: 2,
      description: 'Explosive door breaching charges'
    },
    medkit: {
      name: 'Medical Kit',
      type: 'equipment',
      slot: 'tactical',
      healAmount: 50,
      healCharges: 2,
      description: 'Field medical supplies for team healing'
    },

    // Attachments/Accessories
    nvg: {
      name: 'Night Vision Goggles',
      type: 'accessory',
      slot: 'accessory',
      nightVision: true,
      description: 'Enhanced low-light visibility'
    },
    suppressor: {
      name: 'Suppressor',
      type: 'accessory',
      slot: 'weapon_mod',
      noiseReduction: 0.7,
      damageReduction: 0.1,
      description: 'Reduces weapon noise and muzzle flash'
    },
    extended_mag: {
      name: 'Extended Magazine',
      type: 'accessory',
      slot: 'weapon_mod',
      magBonus: 10,
      reloadPenalty: 0.1,
      description: 'Increased ammo capacity'
    }
  },

  // Soldier Stats Display Labels
  STAT_LABELS: {
    health: 'Health',
    armor: 'Armor',
    speed: 'Speed',
    accuracy: 'Accuracy',
    staminaRegen: 'Stamina'
  }
};

// =============================================================================
// DYNAMIC DIFFICULTY DIRECTOR
// =============================================================================

class DifficultyDirector {
  constructor() {
    this.difficultyLevel = 1.0;
    this.performanceHistory = [];
    this.windowSize = CONFIG.DIFFICULTY.PERFORMANCE_WINDOW;
    
    this.playerKills = 0;
    this.playerDamageTaken = 0;
    this.playerHealthAtStart = 100;
    this.missionStartTime = 0;
    this.lastKillTime = 0;
    this.killStreak = 0;
    this.damageStreak = 0;
    
    this.accuracyMult = 1.0;
    this.eliteSpawnMult = 1.0;
    this.reactionTimeMult = 1.0;
  }

  reset() {
    this.difficultyLevel = 1.0;
    this.performanceHistory = [];
    this.playerKills = 0;
    this.playerDamageTaken = 0;
    this.playerHealthAtStart = 100;
    this.missionStartTime = Date.now();
    this.lastKillTime = 0;
    this.killStreak = 0;
    this.damageStreak = 0;
    this.accuracyMult = 1.0;
    this.eliteSpawnMult = 1.0;
    this.reactionTimeMult = 1.0;
  }

  recordKill() {
    this.playerKills++;
    const now = Date.now();
    
    if (now - this.lastKillTime < 3000) {
      this.killStreak++;
    } else {
      this.killStreak = 1;
    }
    this.lastKillTime = now;
    
    this.performanceHistory.push({ type: 'kill', time: now, streak: this.killStreak });
    this.trimHistory();
  }

  recordDamageTaken(amount) {
    this.playerDamageTaken += amount;
    this.damageStreak += amount;
    
    this.performanceHistory.push({ type: 'damage', time: Date.now(), amount: amount });
    this.trimHistory();
  }

  recordTeammateDeath() {
    this.performanceHistory.push({ type: 'teammateDeath', time: Date.now() });
    this.trimHistory();
  }

  trimHistory() {
    const cutoffTime = Date.now() - (this.windowSize * 16.67);
    this.performanceHistory = this.performanceHistory.filter(e => e.time > cutoffTime);
  }

  update(player, teammates) {
    if (!player) return;

    const cfg = CONFIG.DIFFICULTY;
    
    const recentKills = this.performanceHistory.filter(e => e.type === 'kill').length;
    const recentDamage = this.performanceHistory.filter(e => e.type === 'damage').reduce((sum, e) => sum + e.amount, 0);
    const recentDeaths = this.performanceHistory.filter(e => e.type === 'teammateDeath').length;
    
    const healthPercent = player.hp / player.maxHp;
    const aliveTeammates = teammates.filter(t => !t.isDead).length;
    const totalTeammates = Math.max(1, teammates.length);
    const teamHealthPercent = aliveTeammates / totalTeammates;

    let performanceScore = 0.5;
    
    if (recentKills > cfg.KILL_STREAK_THRESHOLD) {
      performanceScore += 0.1 * Math.min(recentKills - cfg.KILL_STREAK_THRESHOLD, 5);
    }
    
    if (healthPercent > cfg.TARGET_HP_PERCENT) {
      performanceScore += 0.1;
    } else if (healthPercent < 0.3) {
      performanceScore -= 0.2;
    }
    
    if (recentDamage > cfg.DAMAGE_STREAK_THRESHOLD) {
      performanceScore -= 0.1 * Math.min(Math.floor(recentDamage / cfg.DAMAGE_STREAK_THRESHOLD), 3);
    }
    
    if (recentDeaths > 0) {
      performanceScore -= 0.15 * recentDeaths;
    }
    
    if (teamHealthPercent < 0.5) {
      performanceScore -= 0.1;
    }

    performanceScore = Math.max(0, Math.min(1, performanceScore));

    const targetDifficulty = 0.6 + performanceScore * 0.8;
    this.difficultyLevel += (targetDifficulty - this.difficultyLevel) * cfg.ADJUSTMENT_RATE;
    this.difficultyLevel = Math.max(0.5, Math.min(1.5, this.difficultyLevel));

    this.accuracyMult = cfg.MIN_ACCURACY_MULT + 
      (cfg.MAX_ACCURACY_MULT - cfg.MIN_ACCURACY_MULT) * (this.difficultyLevel - 0.5);
    
    this.eliteSpawnMult = cfg.MIN_SPAWN_ELITE_MULT + 
      (cfg.MAX_SPAWN_ELITE_MULT - cfg.MIN_SPAWN_ELITE_MULT) * (this.difficultyLevel - 0.5);
    
    this.reactionTimeMult = 1.5 - (this.difficultyLevel - 0.5) * 0.5;
    this.reactionTimeMult = Math.max(0.8, Math.min(1.2, this.reactionTimeMult));

    if (this.damageStreak > 0) {
      this.damageStreak = Math.max(0, this.damageStreak - 0.5);
    }
  }

  getEnemyAccuracy(baseAccuracy) {
    return baseAccuracy * this.accuracyMult;
  }

  getEliteSpawnChance(baseChance) {
    return Math.min(0.8, baseChance * this.eliteSpawnMult);
  }

  getReactionDelay(baseDelay) {
    return baseDelay * this.reactionTimeMult;
  }

  shouldSpawnReinforcements() {
    return this.difficultyLevel > 1.2 && Math.random() < 0.02;
  }

  getDifficultyLabel() {
    if (this.difficultyLevel < 0.7) return 'Easy';
    if (this.difficultyLevel < 0.9) return 'Normal';
    if (this.difficultyLevel < 1.1) return 'Hard';
    if (this.difficultyLevel < 1.3) return 'Intense';
    return 'Nightmare';
  }
}

// =============================================================================
// MULTIPLAYER MANAGER
// =============================================================================

class MultiplayerManager {
  constructor() {
    this.ws = null;
    this.playerId = null;
    this.playerName = 'Player';
    this.roomCode = null;
    this.roomId = null;
    this.isHost = false;
    this.isConnected = false;
    this.isInRoom = false;
    this.players = [];
    this.selectedMap = 'compound';

    // Callbacks
    this.onConnected = null;
    this.onDisconnected = null;
    this.onRoomCreated = null;
    this.onRoomJoined = null;
    this.onRoomLeft = null;
    this.onPlayerJoined = null;
    this.onPlayerLeft = null;
    this.onGameStart = null;
    this.onGameUpdate = null;
    this.onError = null;

    // Game state sync
    this.lastSentState = null;
    this.remotePlayerStates = new Map();
    this.syncInterval = null;
    this.SYNC_RATE = 50; // ms between syncs (20 updates/sec)
  }

  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        if (this.onConnected) this.onConnected();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
          if (message.type === 'connected') {
            resolve();
          }
        } catch (e) {
          console.error('Failed to parse message:', e);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.isInRoom = false;
        this.stopSync();
        if (this.onDisconnected) this.onDisconnected();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      // Timeout for connection
      setTimeout(() => {
        if (!this.isConnected) {
          reject(new Error('Connection timeout'));
        }
      }, 5000);
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.isInRoom = false;
    this.stopSync();
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  handleMessage(message) {
    switch (message.type) {
      case 'connected':
        this.playerId = message.playerId;
        console.log('Assigned player ID:', this.playerId);
        break;

      case 'room_created':
        this.roomCode = message.roomCode;
        this.roomId = message.roomId;
        this.isHost = true;
        this.isInRoom = true;
        this.players = message.players;
        if (this.onRoomCreated) this.onRoomCreated(message);
        break;

      case 'room_joined':
        this.roomCode = message.roomCode;
        this.roomId = message.roomId;
        this.isHost = false;
        this.isInRoom = true;
        this.players = message.players;
        if (this.onRoomJoined) this.onRoomJoined(message);
        break;

      case 'player_joined':
        this.players = message.players;
        if (this.onPlayerJoined) this.onPlayerJoined(message);
        break;

      case 'player_left':
        this.players = message.players;
        if (message.newHostId === this.playerId) {
          this.isHost = true;
        }
        if (this.onPlayerLeft) this.onPlayerLeft(message);
        break;

      case 'room_left':
        this.roomCode = null;
        this.roomId = null;
        this.isHost = false;
        this.isInRoom = false;
        this.players = [];
        this.stopSync();
        if (this.onRoomLeft) this.onRoomLeft(message);
        break;

      case 'game_start':
        if (this.onGameStart) this.onGameStart(message);
        break;

      case 'game_update':
        this.remotePlayerStates.set(message.senderId, message.data);
        if (this.onGameUpdate) this.onGameUpdate(message);
        break;

      case 'error':
        console.error('Server error:', message.message);
        if (this.onError) this.onError(message);
        break;
    }
  }

  createRoom(playerName) {
    this.playerName = playerName;
    this.send({
      type: 'create_room',
      playerName: playerName
    });
  }

  joinRoom(roomCode, playerName) {
    this.playerName = playerName;
    this.send({
      type: 'join_room',
      roomCode: roomCode.toUpperCase(),
      playerName: playerName
    });
  }

  leaveRoom() {
    this.send({ type: 'leave_room' });
    this.stopSync();
  }

  startGame(mapType) {
    if (!this.isHost) return;
    this.send({
      type: 'start_game',
      mapType: mapType,
      aiCount: Math.max(0, 4 - this.players.length)
    });
  }

  // Start syncing player state
  startSync(game) {
    if (this.syncInterval) return;

    this.syncInterval = setInterval(() => {
      if (game.player && game.isRunning) {
        this.sendPlayerState(game);
      }
    }, this.SYNC_RATE);
  }

  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  sendPlayerState(game) {
    const player = game.player;
    if (!player) return;

    const state = {
      x: Math.round(player.x * 10) / 10,
      y: Math.round(player.y * 10) / 10,
      angle: Math.round(player.angle * 100) / 100,
      hp: Math.round(player.hp),
      isDead: player.isDead,
      stance: player.stance,
      lean: Math.round(player.lean * 10) / 10,
      isFiring: player.isFiring,
      isReloading: player.isReloading,
      currentWeapon: player.currentWeapon,
      muzzleFlash: player.muzzleFlash
    };

    // Only send if state has changed significantly
    if (this.hasStateChanged(state)) {
      this.send({
        type: 'game_update',
        data: state
      });
      this.lastSentState = state;
    }
  }

  hasStateChanged(newState) {
    if (!this.lastSentState) return true;

    const posThreshold = 1;
    const angleThreshold = 0.05;

    return Math.abs(newState.x - this.lastSentState.x) > posThreshold ||
           Math.abs(newState.y - this.lastSentState.y) > posThreshold ||
           Math.abs(newState.angle - this.lastSentState.angle) > angleThreshold ||
           newState.hp !== this.lastSentState.hp ||
           newState.isDead !== this.lastSentState.isDead ||
           newState.stance !== this.lastSentState.stance ||
           newState.isFiring !== this.lastSentState.isFiring ||
           newState.muzzleFlash !== this.lastSentState.muzzleFlash;
  }

  // Send bullet fired event
  sendBulletFired(bullet) {
    this.send({
      type: 'game_update',
      data: {
        event: 'bullet_fired',
        x: bullet.x,
        y: bullet.y,
        angle: bullet.angle,
        weaponType: bullet.weaponType,
        shooterId: this.playerId
      }
    });
  }

  // Send grenade thrown event
  sendGrenadeThrown(grenade) {
    this.send({
      type: 'game_update',
      data: {
        event: 'grenade_thrown',
        x: grenade.x,
        y: grenade.y,
        targetX: grenade.targetX,
        targetY: grenade.targetY,
        type: grenade.type,
        throwerId: this.playerId
      }
    });
  }

  // Get remote player state with interpolation
  getRemotePlayerState(playerId) {
    return this.remotePlayerStates.get(playerId);
  }
}

// Global multiplayer instance
const multiplayer = new MultiplayerManager();

// =============================================================================
// SOUND SYSTEM
// =============================================================================

class SoundSystem {
  constructor() {
    this.enabled = true;
    this.volume = 0.7;
    this.ctx = null;
    this.initialized = false;
    this.compressor = null;
    this.reverbBuffer = null;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      // Master compressor for punch and consistency
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -24;
      this.compressor.knee.value = 12;
      this.compressor.ratio.value = 8;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.15;
      this.compressor.connect(this.ctx.destination);
      this.createReverbBuffer();
      this.initialized = true;
    } catch (e) {
      this.enabled = false;
    }
  }

  resume() {
    if (this.ctx?.state === 'suspended') this.ctx.resume();
  }

  createReverbBuffer() {
    // Create impulse response for room reverb
    const length = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = buffer.getChannelData(c);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (length * 0.15));
      }
    }
    this.reverbBuffer = buffer;
  }

  createReverb(dryGain, wetAmount = 0.2) {
    const convolver = this.ctx.createConvolver();
    convolver.buffer = this.reverbBuffer;
    const wetGain = this.ctx.createGain();
    wetGain.gain.value = wetAmount;
    dryGain.connect(convolver);
    convolver.connect(wetGain);
    wetGain.connect(this.compressor);
    return convolver;
  }

  play(type, x = 0, y = 0, distance = 0) {
    if (!this.enabled || !this.ctx) return;
    const vol = Math.max(0.1, this.volume * (1 - distance / 800));

    switch(type) {
      case 'pistol': this.pistolShot(vol); break;
      case 'smg': this.smgShot(vol); break;
      case 'rifle': this.rifleShot(vol); break;
      case 'shotgun': this.shotgunBlast(vol); break;
      case 'silenced': this.silencedShot(vol); break;
      case 'explosion': this.explosion(vol); break;
      case 'flashbang': this.flashbang(vol); break;
      case 'breach': this.breach(vol); break;
      case 'reload': this.reload(vol); break;
      case 'empty': this.empty(vol); break;
      case 'footstep': this.footstep(vol * 0.3); break;
      case 'hit': this.hit(vol); break;
      case 'ricochet': this.ricochet(vol * 0.6); break;
      case 'glass': this.glass(vol); break;
    }
  }

  // Create colored noise with filtering
  createFilteredNoise(duration, lowFreq, highFreq, vol) {
    const bufferSize = Math.ceil(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = highFreq;
    lowpass.Q.value = 0.7;

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = lowFreq;
    highpass.Q.value = 0.7;

    const gain = this.ctx.createGain();
    gain.gain.value = vol;

    source.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(gain);

    return { source, gain, lowpass, highpass };
  }

  // Realistic pistol - sharp crack with mechanical action
  pistolShot(vol) {
    const t = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.value = vol * 1.2;
    master.connect(this.compressor);
    this.createReverb(master, 0.15);

    // Initial crack - very fast attack
    const crack = this.createFilteredNoise(0.06, 800, 6000, 0.9);
    crack.gain.gain.setValueAtTime(0.9, t);
    crack.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    crack.gain.connect(master);
    crack.source.start(t);
    crack.source.stop(t + 0.06);

    // Low thump - body of the shot
    const thump = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    const thumpFilter = this.ctx.createBiquadFilter();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(180, t);
    thump.frequency.exponentialRampToValueAtTime(60, t + 0.08);
    thumpFilter.type = 'lowpass';
    thumpFilter.frequency.value = 300;
    thumpGain.gain.setValueAtTime(0.8, t);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    thump.connect(thumpFilter);
    thumpFilter.connect(thumpGain);
    thumpGain.connect(master);
    thump.start(t);
    thump.stop(t + 0.12);

    // Mechanical click
    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = 'square';
    click.frequency.value = 2500;
    clickGain.gain.setValueAtTime(0.15, t + 0.002);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
    click.connect(clickGain);
    clickGain.connect(master);
    click.start(t);
    click.stop(t + 0.02);
  }

  // SMG - rapid, lighter sound
  smgShot(vol) {
    const t = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.value = vol * 0.9;
    master.connect(this.compressor);
    this.createReverb(master, 0.1);

    // Sharp crack - higher frequency
    const crack = this.createFilteredNoise(0.04, 1200, 8000, 0.8);
    crack.gain.gain.setValueAtTime(0.8, t);
    crack.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
    crack.gain.connect(master);
    crack.source.start(t);
    crack.source.stop(t + 0.04);

    // Quick thump
    const thump = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(250, t);
    thump.frequency.exponentialRampToValueAtTime(80, t + 0.04);
    thumpGain.gain.setValueAtTime(0.5, t);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    thump.connect(thumpGain);
    thumpGain.connect(master);
    thump.start(t);
    thump.stop(t + 0.06);

    // Bolt noise
    const bolt = this.createFilteredNoise(0.02, 2000, 6000, 0.3);
    bolt.gain.gain.setValueAtTime(0.2, t + 0.01);
    bolt.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    bolt.gain.connect(master);
    bolt.source.start(t + 0.01);
    bolt.source.stop(t + 0.04);
  }

  // Rifle - heavy, powerful crack with echo
  rifleShot(vol) {
    const t = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.value = vol * 1.5;
    master.connect(this.compressor);
    this.createReverb(master, 0.25);

    // Supersonic crack - very sharp
    const crack = this.createFilteredNoise(0.08, 600, 5000, 1.0);
    crack.gain.gain.setValueAtTime(1.0, t);
    crack.gain.gain.setValueAtTime(0.7, t + 0.005);
    crack.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    crack.gain.connect(master);
    crack.source.start(t);
    crack.source.stop(t + 0.08);

    // Heavy bass thump
    const thump = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    const thumpFilter = this.ctx.createBiquadFilter();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(120, t);
    thump.frequency.exponentialRampToValueAtTime(35, t + 0.15);
    thumpFilter.type = 'lowpass';
    thumpFilter.frequency.value = 200;
    thumpGain.gain.setValueAtTime(1.0, t);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    thump.connect(thumpFilter);
    thumpFilter.connect(thumpGain);
    thumpGain.connect(master);
    thump.start(t);
    thump.stop(t + 0.2);

    // Secondary crack reflection
    const echo = this.createFilteredNoise(0.05, 1000, 4000, 0.3);
    echo.gain.gain.setValueAtTime(0.25, t + 0.03);
    echo.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    echo.gain.connect(master);
    echo.source.start(t + 0.03);
    echo.source.stop(t + 0.08);

    // Mechanical action
    const action = this.createFilteredNoise(0.03, 3000, 8000, 0.2);
    action.gain.gain.setValueAtTime(0.15, t + 0.05);
    action.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    action.gain.connect(master);
    action.source.start(t + 0.05);
    action.source.stop(t + 0.09);
  }

  // Shotgun - massive blast with multiple pellet sounds
  shotgunBlast(vol) {
    const t = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.value = vol * 1.8;
    master.connect(this.compressor);
    this.createReverb(master, 0.3);

    // Massive initial blast - wide frequency
    const blast = this.createFilteredNoise(0.12, 200, 4000, 1.0);
    blast.gain.gain.setValueAtTime(1.0, t);
    blast.gain.gain.setValueAtTime(0.8, t + 0.01);
    blast.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    blast.lowpass.frequency.setValueAtTime(4000, t);
    blast.lowpass.frequency.exponentialRampToValueAtTime(800, t + 0.08);
    blast.gain.connect(master);
    blast.source.start(t);
    blast.source.stop(t + 0.12);

    // Deep bass boom
    const boom = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    const boomFilter = this.ctx.createBiquadFilter();
    boom.type = 'sine';
    boom.frequency.setValueAtTime(80, t);
    boom.frequency.exponentialRampToValueAtTime(25, t + 0.2);
    boomFilter.type = 'lowpass';
    boomFilter.frequency.value = 150;
    boomGain.gain.setValueAtTime(1.2, t);
    boomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    boom.connect(boomFilter);
    boomFilter.connect(boomGain);
    boomGain.connect(master);
    boom.start(t);
    boom.stop(t + 0.3);

    // Secondary thump
    const thump2 = this.ctx.createOscillator();
    const thump2Gain = this.ctx.createGain();
    thump2.type = 'triangle';
    thump2.frequency.setValueAtTime(150, t);
    thump2.frequency.exponentialRampToValueAtTime(40, t + 0.12);
    thump2Gain.gain.setValueAtTime(0.6, t + 0.005);
    thump2Gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    thump2.connect(thump2Gain);
    thump2Gain.connect(master);
    thump2.start(t);
    thump2.stop(t + 0.18);

    // Pump action sound (delayed)
    setTimeout(() => {
      if (!this.ctx) return;
      const pump = this.createFilteredNoise(0.08, 500, 3000, 0.4);
      const pt = this.ctx.currentTime;
      pump.gain.gain.setValueAtTime(0.3, pt);
      pump.gain.gain.exponentialRampToValueAtTime(0.001, pt + 0.06);
      pump.gain.connect(this.compressor);
      pump.source.start(pt);
      pump.source.stop(pt + 0.08);
    }, 150);
  }

  // Silenced - muffled thud
  silencedShot(vol) {
    const t = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.value = vol * 0.5;
    master.connect(this.compressor);

    // Muffled thud
    const thud = this.createFilteredNoise(0.08, 100, 800, 0.6);
    thud.gain.gain.setValueAtTime(0.5, t);
    thud.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    thud.gain.connect(master);
    thud.source.start(t);
    thud.source.stop(t + 0.08);

    // Subtle mechanical sound
    const mech = this.ctx.createOscillator();
    const mechGain = this.ctx.createGain();
    mech.type = 'sine';
    mech.frequency.value = 400;
    mechGain.gain.setValueAtTime(0.15, t);
    mechGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    mech.connect(mechGain);
    mechGain.connect(master);
    mech.start(t);
    mech.stop(t + 0.04);
  }

  // Realistic explosion - layered with debris
  explosion(vol) {
    const t = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.value = vol * 2.0;
    master.connect(this.compressor);
    this.createReverb(master, 0.4);

    // Initial shockwave - massive transient
    const shock = this.createFilteredNoise(0.15, 30, 2000, 1.2);
    shock.gain.gain.setValueAtTime(1.2, t);
    shock.gain.gain.setValueAtTime(0.8, t + 0.02);
    shock.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    shock.lowpass.frequency.setValueAtTime(2000, t);
    shock.lowpass.frequency.exponentialRampToValueAtTime(200, t + 0.1);
    shock.gain.connect(master);
    shock.source.start(t);
    shock.source.stop(t + 0.15);

    // Deep sub-bass rumble
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    const subFilter = this.ctx.createBiquadFilter();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(60, t);
    sub.frequency.exponentialRampToValueAtTime(15, t + 0.5);
    subFilter.type = 'lowpass';
    subFilter.frequency.value = 100;
    subGain.gain.setValueAtTime(1.5, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    sub.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(master);
    sub.start(t);
    sub.stop(t + 0.7);

    // Fire crackle - mid frequencies
    const crackle = this.createFilteredNoise(0.4, 800, 4000, 0.5);
    crackle.gain.gain.setValueAtTime(0.01, t);
    crackle.gain.gain.linearRampToValueAtTime(0.4, t + 0.05);
    crackle.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    crackle.gain.connect(master);
    crackle.source.start(t);
    crackle.source.stop(t + 0.4);

    // High frequency sizzle
    const sizzle = this.createFilteredNoise(0.3, 4000, 12000, 0.25);
    sizzle.gain.gain.setValueAtTime(0.2, t + 0.02);
    sizzle.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    sizzle.gain.connect(master);
    sizzle.source.start(t + 0.02);
    sizzle.source.stop(t + 0.3);

    // Debris falling
    for (let i = 0; i < 4; i++) {
      const delay = 0.1 + Math.random() * 0.2;
      const debris = this.createFilteredNoise(0.08, 200, 2000, 0.2);
      debris.gain.gain.setValueAtTime(0.15, t + delay);
      debris.gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.06);
      debris.gain.connect(master);
      debris.source.start(t + delay);
      debris.source.stop(t + delay + 0.08);
    }

    // Secondary rumble
    const rumble = this.ctx.createOscillator();
    const rumbleGain = this.ctx.createGain();
    rumble.type = 'triangle';
    rumble.frequency.setValueAtTime(40, t + 0.05);
    rumble.frequency.exponentialRampToValueAtTime(20, t + 0.4);
    rumbleGain.gain.setValueAtTime(0.6, t + 0.05);
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    rumble.connect(rumbleGain);
    rumbleGain.connect(master);
    rumble.start(t + 0.05);
    rumble.stop(t + 0.5);
  }

  // Flashbang - sharp bang with ear ring
  flashbang(vol) {
    const t = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.value = vol * 1.5;
    master.connect(this.compressor);
    this.createReverb(master, 0.5);

    // Sharp initial bang
    const bang = this.createFilteredNoise(0.1, 500, 8000, 1.0);
    bang.gain.gain.setValueAtTime(1.0, t);
    bang.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    bang.gain.connect(master);
    bang.source.start(t);
    bang.source.stop(t + 0.1);

    // Ear ringing - high pitched
    const ring = this.ctx.createOscillator();
    const ringGain = this.ctx.createGain();
    ring.type = 'sine';
    ring.frequency.value = 4000 + Math.random() * 1000;
    ringGain.gain.setValueAtTime(0.3, t + 0.02);
    ringGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    ring.connect(ringGain);
    ringGain.connect(this.compressor);
    ring.start(t + 0.02);
    ring.stop(t + 1.3);

    // Secondary ring
    const ring2 = this.ctx.createOscillator();
    const ring2Gain = this.ctx.createGain();
    ring2.type = 'sine';
    ring2.frequency.value = 3000 + Math.random() * 500;
    ring2Gain.gain.setValueAtTime(0.15, t + 0.03);
    ring2Gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    ring2.connect(ring2Gain);
    ring2Gain.connect(this.compressor);
    ring2.start(t + 0.03);
    ring2.stop(t + 0.9);
  }

  // Breach charge
  breach(vol) {
    const t = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.value = vol * 2.2;
    master.connect(this.compressor);
    this.createReverb(master, 0.35);

    // Focused explosive blast
    const blast = this.createFilteredNoise(0.12, 100, 3000, 1.2);
    blast.gain.gain.setValueAtTime(1.2, t);
    blast.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    blast.gain.connect(master);
    blast.source.start(t);
    blast.source.stop(t + 0.12);

    // Heavy thump
    const thump = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(80, t);
    thump.frequency.exponentialRampToValueAtTime(20, t + 0.3);
    thumpGain.gain.setValueAtTime(1.3, t);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    thump.connect(thumpGain);
    thumpGain.connect(master);
    thump.start(t);
    thump.stop(t + 0.4);

    // Door/wall debris
    const debris = this.createFilteredNoise(0.2, 300, 2500, 0.5);
    debris.gain.gain.setValueAtTime(0.4, t + 0.03);
    debris.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    debris.gain.connect(master);
    debris.source.start(t + 0.03);
    debris.source.stop(t + 0.2);
  }

  // Magazine reload
  reload(vol) {
    const t = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.value = vol * 0.5;
    master.connect(this.compressor);

    // Magazine release click
    const release = this.createFilteredNoise(0.03, 1500, 5000, 0.4);
    release.gain.gain.setValueAtTime(0.3, t);
    release.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
    release.gain.connect(master);
    release.source.start(t);
    release.source.stop(t + 0.03);

    // Magazine insertion
    setTimeout(() => {
      if (!this.ctx) return;
      const insert = this.createFilteredNoise(0.05, 800, 3000, 0.5);
      const it = this.ctx.currentTime;
      insert.gain.gain.setValueAtTime(0.35, it);
      insert.gain.gain.exponentialRampToValueAtTime(0.001, it + 0.04);
      insert.gain.connect(this.compressor);
      insert.source.start(it);
      insert.source.stop(it + 0.05);

      // Click into place
      const click = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      click.type = 'square';
      click.frequency.value = 1800;
      clickGain.gain.setValueAtTime(0.2, it + 0.02);
      clickGain.gain.exponentialRampToValueAtTime(0.001, it + 0.035);
      click.connect(clickGain);
      clickGain.connect(this.compressor);
      click.start(it + 0.02);
      click.stop(it + 0.04);
    }, 80);

    // Chamber a round
    setTimeout(() => {
      if (!this.ctx) return;
      const chamber = this.createFilteredNoise(0.06, 1000, 4000, 0.4);
      const ct = this.ctx.currentTime;
      chamber.gain.gain.setValueAtTime(0.3, ct);
      chamber.gain.gain.exponentialRampToValueAtTime(0.001, ct + 0.05);
      chamber.gain.connect(this.compressor);
      chamber.source.start(ct);
      chamber.source.stop(ct + 0.06);
    }, 180);
  }

  // Empty magazine click
  empty(vol) {
    const t = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.value = vol * 0.4;
    master.connect(this.compressor);

    // Dry click
    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    const clickFilter = this.ctx.createBiquadFilter();
    click.type = 'square';
    click.frequency.value = 2000;
    clickFilter.type = 'bandpass';
    clickFilter.frequency.value = 1500;
    clickFilter.Q.value = 2;
    clickGain.gain.setValueAtTime(0.35, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    click.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(master);
    click.start(t);
    click.stop(t + 0.025);

    // Metal resonance
    const metal = this.ctx.createOscillator();
    const metalGain = this.ctx.createGain();
    metal.type = 'sine';
    metal.frequency.value = 3500;
    metalGain.gain.setValueAtTime(0.1, t + 0.005);
    metalGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    metal.connect(metalGain);
    metalGain.connect(master);
    metal.start(t + 0.005);
    metal.stop(t + 0.05);
  }

  // Footstep
  footstep(vol) {
    const t = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.value = vol;
    master.connect(this.compressor);

    // Thud
    const thud = this.createFilteredNoise(0.08, 60, 400, 0.6);
    thud.gain.gain.setValueAtTime(0.5, t);
    thud.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    thud.gain.connect(master);
    thud.source.start(t);
    thud.source.stop(t + 0.08);

    // Surface scrape
    const scrape = this.createFilteredNoise(0.04, 800, 2500, 0.2);
    scrape.gain.gain.setValueAtTime(0.15 * Math.random(), t + 0.01);
    scrape.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    scrape.gain.connect(master);
    scrape.source.start(t + 0.01);
    scrape.source.stop(t + 0.05);
  }

  // Bullet hit/impact
  hit(vol) {
    const t = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.value = vol * 0.8;
    master.connect(this.compressor);

    // Impact thud
    const impact = this.createFilteredNoise(0.1, 100, 1500, 0.7);
    impact.gain.gain.setValueAtTime(0.6, t);
    impact.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    impact.gain.connect(master);
    impact.source.start(t);
    impact.source.stop(t + 0.1);

    // Flesh/material sound
    const flesh = this.ctx.createOscillator();
    const fleshGain = this.ctx.createGain();
    flesh.type = 'sine';
    flesh.frequency.setValueAtTime(200, t);
    flesh.frequency.exponentialRampToValueAtTime(80, t + 0.06);
    fleshGain.gain.setValueAtTime(0.4, t);
    fleshGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    flesh.connect(fleshGain);
    fleshGain.connect(master);
    flesh.start(t);
    flesh.stop(t + 0.1);
  }

  // Bullet ricochet
  ricochet(vol) {
    const t = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.value = vol;
    master.connect(this.compressor);
    this.createReverb(master, 0.25);

    // Initial ping
    const ping = this.ctx.createOscillator();
    const pingGain = this.ctx.createGain();
    ping.type = 'sine';
    ping.frequency.setValueAtTime(3500 + Math.random() * 1500, t);
    ping.frequency.exponentialRampToValueAtTime(800 + Math.random() * 400, t + 0.2);
    pingGain.gain.setValueAtTime(0.5, t);
    pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    ping.connect(pingGain);
    pingGain.connect(master);
    ping.start(t);
    ping.stop(t + 0.2);

    // Metal impact
    const metal = this.createFilteredNoise(0.04, 2000, 6000, 0.4);
    metal.gain.gain.setValueAtTime(0.35, t);
    metal.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    metal.gain.connect(master);
    metal.source.start(t);
    metal.source.stop(t + 0.04);

    // Whizz away
    const whizz = this.ctx.createOscillator();
    const whizzGain = this.ctx.createGain();
    whizz.type = 'sawtooth';
    whizz.frequency.setValueAtTime(2000, t + 0.02);
    whizz.frequency.exponentialRampToValueAtTime(400, t + 0.15);
    whizzGain.gain.setValueAtTime(0.15, t + 0.02);
    whizzGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    whizz.connect(whizzGain);
    whizzGain.connect(master);
    whizz.start(t + 0.02);
    whizz.stop(t + 0.15);
  }

  // Glass breaking
  glass(vol) {
    const t = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.value = vol * 0.7;
    master.connect(this.compressor);
    this.createReverb(master, 0.2);

    // Initial crack
    const crack = this.createFilteredNoise(0.08, 2000, 10000, 0.8);
    crack.gain.gain.setValueAtTime(0.7, t);
    crack.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    crack.gain.connect(master);
    crack.source.start(t);
    crack.source.stop(t + 0.08);

    // Multiple shards falling
    for (let i = 0; i < 6; i++) {
      const delay = Math.random() * 0.15;
      const freq = 3000 + Math.random() * 4000;

      const shard = this.ctx.createOscillator();
      const shardGain = this.ctx.createGain();
      shard.type = 'sine';
      shard.frequency.setValueAtTime(freq, t + delay);
      shard.frequency.exponentialRampToValueAtTime(freq * 0.7, t + delay + 0.05);
      shardGain.gain.setValueAtTime(0.2, t + delay);
      shardGain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.04);
      shard.connect(shardGain);
      shardGain.connect(master);
      shard.start(t + delay);
      shard.stop(t + delay + 0.06);
    }

    // Tinkling aftermath
    for (let i = 0; i < 4; i++) {
      const delay = 0.1 + Math.random() * 0.2;
      const tinkle = this.createFilteredNoise(0.03, 4000, 12000, 0.15);
      tinkle.gain.gain.setValueAtTime(0.12, t + delay);
      tinkle.gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.025);
      tinkle.gain.connect(master);
      tinkle.source.start(t + delay);
      tinkle.source.stop(t + delay + 0.03);
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

const sound = new SoundSystem();

// =============================================================================
// UTILITIES
// =============================================================================

const utils = {
  distance: (x1, y1, x2, y2) => Math.sqrt((x2-x1)**2 + (y2-y1)**2),
  angle: (x1, y1, x2, y2) => Math.atan2(y2-y1, x2-x1),
  normalize: (x, y) => {
    const len = Math.sqrt(x*x + y*y);
    return len === 0 ? {x:0, y:0} : {x: x/len, y: y/len};
  },
  clamp: (v, min, max) => Math.max(min, Math.min(max, v)),
  lerp: (a, b, t) => a + (b - a) * t,
  randomRange: (min, max) => min + Math.random() * (max - min),
  pointInRect: (px, py, rx, ry, rw, rh) => px >= rx && px <= rx+rw && py >= ry && py <= ry+rh,
  lineIntersectsRect: (x1, y1, x2, y2, rx, ry, rw, rh) => {
    // Check if line segment intersects rectangle
    const left = utils.lineIntersectsLine(x1,y1,x2,y2, rx,ry, rx,ry+rh);
    const right = utils.lineIntersectsLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
    const top = utils.lineIntersectsLine(x1,y1,x2,y2, rx,ry, rx+rw,ry);
    const bottom = utils.lineIntersectsLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);
    return left || right || top || bottom;
  },
  lineIntersectsLine: (x1,y1,x2,y2,x3,y3,x4,y4) => {
    const denom = (y4-y3)*(x2-x1) - (x4-x3)*(y2-y1);
    if (denom === 0) return null;
    const ua = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / denom;
    const ub = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / denom;
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      return { x: x1 + ua*(x2-x1), y: y1 + ua*(y2-y1), t: ua };
    }
    return null;
  },
  generateId: () => Math.random().toString(36).substr(2, 9),
};

// =============================================================================
// PARTICLE SYSTEM
// =============================================================================

class Particle {
  constructor(x, y, vx, vy, color, life, size = 2, type = 'default') {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.color = color;
    this.life = life;
    this.maxLife = life;
    this.size = size;
    this.type = type;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.3;
    this.trail = [];
    this.maxTrailLength = type === 'spark' ? 5 : (type === 'blood' ? 3 : 0);
  }

  update() {
    if (this.maxTrailLength > 0 && this.life > this.maxLife * 0.3) {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }
    }
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.vy += this.type === 'blood' ? 0.15 : (this.type === 'spark' ? 0.08 : 0);
    this.rotation += this.rotSpeed;
    this.life--;
  }

  draw(ctx) {
    const alpha = this.life / this.maxLife;
    const currentSize = this.size * (0.5 + alpha * 0.5);
    
    ctx.save();
    
    if (this.type === 'blood') {
      for (let i = 0; i < this.trail.length; i++) {
        const t = this.trail[i];
        const trailAlpha = (i / this.trail.length) * alpha * 0.5;
        ctx.globalAlpha = trailAlpha;
        ctx.fillStyle = '#660000';
        ctx.beginPath();
        ctx.arc(t.x, t.y, currentSize * (i / this.trail.length) * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = alpha;
      ctx.shadowColor = 'rgba(100, 0, 0, 0.6)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      const bloodGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, currentSize);
      bloodGradient.addColorStop(0, '#cc0000');
      bloodGradient.addColorStop(0.5, this.color);
      bloodGradient.addColorStop(1, '#550000');
      ctx.fillStyle = bloodGradient;
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, currentSize, currentSize * 0.8, this.rotation, 0, Math.PI * 2);
      ctx.fill();
      
    } else if (this.type === 'spark') {
      for (let i = 0; i < this.trail.length; i++) {
        const t = this.trail[i];
        const trailAlpha = (i / this.trail.length) * alpha * 0.6;
        ctx.globalAlpha = trailAlpha;
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.arc(t.x, t.y, currentSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = alpha;
      ctx.shadowColor = '#ffaa00';
      ctx.shadowBlur = 8 * alpha;
      const sparkGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, currentSize);
      sparkGradient.addColorStop(0, '#ffffff');
      sparkGradient.addColorStop(0.3, '#ffff00');
      sparkGradient.addColorStop(0.6, this.color);
      sparkGradient.addColorStop(1, '#ff4400');
      ctx.fillStyle = sparkGradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = alpha * 0.8;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentSize * 0.6, 0, Math.PI * 2);
      ctx.stroke();
      
    } else if (this.type === 'explosion') {
      ctx.globalAlpha = alpha;
      ctx.shadowColor = '#ff6600';
      ctx.shadowBlur = 12 * alpha;
      const expGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, currentSize * 1.5);
      expGradient.addColorStop(0, '#ffffff');
      expGradient.addColorStop(0.2, '#ffff00');
      expGradient.addColorStop(0.5, '#ff6600');
      expGradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
      ctx.fillStyle = expGradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentSize * 1.5, 0, Math.PI * 2);
      ctx.fill();
      
    } else if (this.type === 'debris') {
      ctx.globalAlpha = alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      const debrisGradient = ctx.createLinearGradient(-currentSize, -currentSize, currentSize, currentSize);
      debrisGradient.addColorStop(0, '#888888');
      debrisGradient.addColorStop(0.5, this.color);
      debrisGradient.addColorStop(1, '#333333');
      ctx.fillStyle = debrisGradient;
      ctx.fillRect(-currentSize, -currentSize * 0.5, currentSize * 2, currentSize);
      
    } else {
      ctx.globalAlpha = alpha;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
}

class ShellCasing {
  constructor(x, y, angle) {
    this.x = x; this.y = y;
    this.vx = Math.cos(angle + Math.PI/2) * (2 + Math.random() * 2);
    this.vy = Math.sin(angle + Math.PI/2) * (2 + Math.random() * 2);
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.5;
    this.life = CONFIG.SHELL_CASING_LIFETIME;
    this.bounceCount = 0;
    this.height = 1 + Math.random() * 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.92;
    this.vy *= 0.92;
    this.height *= 0.95;
    this.rotation += this.rotSpeed;
    this.rotSpeed *= 0.96;
    this.life--;
  }

  draw(ctx) {
    const alpha = Math.min(1, this.life / 30);
    const heightOffset = this.height * 3;
    
    ctx.save();
    
    ctx.globalAlpha = alpha * 0.4;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(this.x + 2, this.y + 2, 3, 1.5, this.rotation, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.translate(this.x, this.y - heightOffset);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = alpha;
    
    const casingGradient = ctx.createLinearGradient(-3, -1.5, 3, 1.5);
    casingGradient.addColorStop(0, '#e8c84a');
    casingGradient.addColorStop(0.3, '#ffd700');
    casingGradient.addColorStop(0.5, '#c9a227');
    casingGradient.addColorStop(0.7, '#b8960f');
    casingGradient.addColorStop(1, '#8b7500');
    
    ctx.fillStyle = casingGradient;
    ctx.beginPath();
    ctx.roundRect(-3, -1.5, 6, 3, 0.5);
    ctx.fill();
    
    ctx.strokeStyle = '#6b5500';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.roundRect(-3, -1.5, 6, 3, 0.5);
    ctx.stroke();
    
    ctx.globalAlpha = alpha * 0.6;
    ctx.fillStyle = 'rgba(255, 255, 200, 0.5)';
    ctx.beginPath();
    ctx.ellipse(0, -0.5, 2, 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.globalAlpha = alpha * 0.8;
    ctx.fillStyle = '#8b4513';
    ctx.beginPath();
    ctx.arc(2.5, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

// =============================================================================
// ITEM DROP CLASS
// =============================================================================

class ItemDrop {
  constructor(x, y, type, subtype = null, amount = 1) {
    this.x = x;
    this.y = y;
    this.type = type; // 'weapon', 'ammo', 'grenade', 'health'
    this.subtype = subtype; // weapon type, grenade type, etc.
    this.amount = amount;
    this.radius = 15;
    this.bobOffset = Math.random() * Math.PI * 2;
    this.lifetime = 0;
    this.collected = false;
  }

  update() {
    this.lifetime++;
  }

  draw(ctx) {
    if (this.collected) return;

    // Bob up and down
    const bob = Math.sin(this.lifetime * 0.05 + this.bobOffset) * 3;
    const y = this.y + bob;

    // Background circle
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(this.x, y + 2, this.radius + 2, 0, Math.PI * 2);
    ctx.fill();

    // Main circle with type color
    let color;
    switch (this.type) {
      case 'weapon': color = '#4a90e2'; break;
      case 'ammo': color = '#f5a623'; break;
      case 'grenade': color = '#d0021b'; break;
      case 'health': color = '#7ed321'; break;
      case 'medkit': color = '#2ecc71'; break;
      case 'adrenaline': color = '#e74c3c'; break;
      case 'charm': color = '#9b59b6'; break;
      default: color = '#ffffff';
    }

    ctx.fillStyle = color;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Icon/text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let text = '';
    switch (this.type) {
      case 'weapon':
        text = this.subtype === 'rifle' ? 'M4' :
               this.subtype === 'smg' ? 'MP5' :
               this.subtype === 'shotgun' ? 'M870' :
               this.subtype === 'pistol' ? 'M9' : 'W';
        break;
      case 'ammo': text = `${this.amount}`; break;
      case 'grenade': text = this.subtype === 'frag' ? 'G' : 'S'; break;
      case 'health': text = '+'; break;
      case 'medkit': text = '❤'; break;
      case 'adrenaline': text = '⚡'; break;
      case 'charm': text = '✨'; break;
    }
    ctx.fillText(text, this.x, y);

    // Pulse effect
    if (this.lifetime < 60) {
      const alpha = (1 - this.lifetime / 60) * 0.3;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, y, this.radius + this.lifetime / 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  isNear(x, y, distance = 30) {
    return utils.distance(this.x, this.y, x, y) < distance;
  }
}

// =============================================================================
// BULLET CLASS
// =============================================================================

class Bullet {
  constructor(x, y, angle, weapon, shooter) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.angle = angle;
    this.speed = 25;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;
    this.damage = weapon.damage;
    this.penetration = weapon.penetration;
    this.range = weapon.range;
    this.shooter = shooter;
    this.dead = false;
    this.trail = [];
    this.penetrationsLeft = 2;
  }

  update(level, entities) {
    // Store trail
    this.trail.push({x: this.x, y: this.y});
    if (this.trail.length > 5) this.trail.shift();

    const nextX = this.x + this.vx;
    const nextY = this.y + this.vy;

    // Check range
    const dist = utils.distance(this.startX, this.startY, nextX, nextY);
    if (dist > this.range) {
      this.dead = true;
      return null;
    }

    // Check wall collisions
    const wallHit = level.checkBulletCollision(this.x, this.y, nextX, nextY, this);
    if (wallHit) {
      return wallHit;
    }

    // Check entity hits
    for (const entity of entities) {
      if (entity === this.shooter || entity.isDead) continue;
      const hitDist = utils.distance(nextX, nextY, entity.x, entity.y);
      if (hitDist < entity.radius) {
        this.dead = true;
        return { type: 'entity', entity, x: nextX, y: nextY };
      }
    }

    this.x = nextX;
    this.y = nextY;
    return null;
  }

  draw(ctx) {
    // Draw trail
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < this.trail.length; i++) {
      const p = this.trail[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.lineTo(this.x, this.y);
    ctx.stroke();

    // Bullet head
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

// =============================================================================
// GRENADE CLASS
// =============================================================================

class Grenade {
  constructor(x, y, targetX, targetY, type, thrower) {
    this.x = x;
    this.y = y;
    this.type = type; // 'frag', 'flash', 'smoke'
    this.thrower = thrower;

    const angle = utils.angle(x, y, targetX, targetY);
    const dist = Math.min(utils.distance(x, y, targetX, targetY), 300);
    this.vx = Math.cos(angle) * CONFIG.GRENADE_THROW_SPEED;
    this.vy = Math.sin(angle) * CONFIG.GRENADE_THROW_SPEED;
    this.targetDist = dist;
    this.traveled = 0;

    this.fuseTime = type === 'flash' ? 60 : 90;
    this.exploded = false;
    this.dead = false;
  }

  update(level) {
    if (this.exploded) {
      this.dead = true;
      return this.type;
    }

    const speed = Math.sqrt(this.vx**2 + this.vy**2);
    this.traveled += speed;

    // Slow down as it approaches target
    const slowdown = Math.max(0.9, 1 - this.traveled / this.targetDist * 0.3);
    this.vx *= slowdown;
    this.vy *= slowdown;

    const nextX = this.x + this.vx;
    const nextY = this.y + this.vy;

    // Wall collision - bounce
    if (level.isSolid(nextX, this.y)) {
      this.vx *= -0.5;
    } else {
      this.x = nextX;
    }

    if (level.isSolid(this.x, nextY)) {
      this.vy *= -0.5;
    } else {
      this.y = nextY;
    }

    this.fuseTime--;
    if (this.fuseTime <= 0) {
      this.exploded = true;
    }

    return null;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Grenade body
    ctx.fillStyle = this.type === 'frag' ? '#2d4a2d' :
                    this.type === 'flash' ? '#4a4a4a' : '#3d5c3d';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    // Fuse indicator
    if (this.fuseTime < 30) {
      ctx.fillStyle = this.fuseTime % 6 < 3 ? '#ff0000' : '#ffff00';
      ctx.beginPath();
      ctx.arc(0, -3, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// =============================================================================
// EXPLOSION EFFECT CLASS
// =============================================================================

class ExplosionEffect {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.maxRadius = radius;
    this.currentRadius = 0;
    this.life = 60;
    this.maxLife = 60;
    this.dead = false;
    this.debrisParticles = [];
    this.smokeParticles = [];
    this.sparkParticles = [];
    
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      this.debrisParticles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.4,
        size: 2 + Math.random() * 4,
        life: 40 + Math.random() * 20
      });
    }
    
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * radius * 0.5;
      this.smokeParticles.push({
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.5 - Math.random() * 0.5,
        size: 15 + Math.random() * 20,
        life: 50 + Math.random() * 30,
        maxLife: 80
      });
    }
    
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 5 + Math.random() * 8;
      this.sparkParticles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 1 + Math.random() * 2,
        life: 20 + Math.random() * 20,
        trail: []
      });
    }
  }

  update() {
    this.life--;
    if (this.life <= 0) {
      this.dead = true;
      return;
    }

    const progress = 1 - this.life / this.maxLife;
    if (progress < 0.2) {
      this.currentRadius = this.maxRadius * (progress / 0.2);
    } else {
      this.currentRadius = this.maxRadius;
    }
    
    for (const d of this.debrisParticles) {
      d.x += d.vx;
      d.y += d.vy;
      d.vy += 0.2;
      d.vx *= 0.98;
      d.rotation += d.rotSpeed;
      d.life--;
    }
    this.debrisParticles = this.debrisParticles.filter(d => d.life > 0);
    
    for (const s of this.smokeParticles) {
      s.x += s.vx;
      s.y += s.vy;
      s.size += 0.3;
      s.life--;
    }
    this.smokeParticles = this.smokeParticles.filter(s => s.life > 0);
    
    for (const sp of this.sparkParticles) {
      if (sp.life > 5) {
        sp.trail.push({ x: sp.x, y: sp.y });
        if (sp.trail.length > 5) sp.trail.shift();
      }
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vy += 0.15;
      sp.vx *= 0.97;
      sp.life--;
    }
    this.sparkParticles = this.sparkParticles.filter(sp => sp.life > 0);
  }

  draw(ctx) {
    if (this.dead) return;

    const progress = 1 - this.life / this.maxLife;
    const alpha = progress < 0.2 ? 0.8 : 0.8 * (1 - (progress - 0.2) / 0.8);

    ctx.save();
    
    for (const s of this.smokeParticles) {
      const smokeAlpha = (s.life / s.maxLife) * 0.4;
      const smokeGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size);
      smokeGrad.addColorStop(0, `rgba(60, 60, 60, ${smokeAlpha})`);
      smokeGrad.addColorStop(0.5, `rgba(40, 40, 40, ${smokeAlpha * 0.5})`);
      smokeGrad.addColorStop(1, `rgba(30, 30, 30, 0)`);
      ctx.fillStyle = smokeGrad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur = 30 * alpha;
    
    const coreGradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.currentRadius
    );
    coreGradient.addColorStop(0, `rgba(255, 255, 200, ${alpha})`);
    coreGradient.addColorStop(0.15, `rgba(255, 200, 50, ${alpha * 0.9})`);
    coreGradient.addColorStop(0.4, `rgba(255, 100, 0, ${alpha * 0.6})`);
    coreGradient.addColorStop(0.7, `rgba(200, 50, 0, ${alpha * 0.3})`);
    coreGradient.addColorStop(1, `rgba(100, 20, 0, 0)`);
    
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    ctx.strokeStyle = `rgba(255, 150, 50, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
    ctx.stroke();

    if (progress < 0.4) {
      const shockwaveRadius = this.maxRadius * 1.5 * (progress / 0.4);
      const shockAlpha = 0.6 * (1 - progress / 0.4);
      ctx.strokeStyle = `rgba(255, 255, 255, ${shockAlpha})`;
      ctx.lineWidth = 3 * (1 - progress / 0.4);
      ctx.beginPath();
      ctx.arc(this.x, this.y, shockwaveRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    for (const sp of this.sparkParticles) {
      const sparkAlpha = sp.life / 40;
      for (let i = 0; i < sp.trail.length; i++) {
        const t = sp.trail[i];
        const trailAlpha = (i / sp.trail.length) * sparkAlpha * 0.6;
        ctx.globalAlpha = trailAlpha;
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.arc(t.x, t.y, sp.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = sparkAlpha;
      ctx.shadowColor = '#ffaa00';
      ctx.shadowBlur = 6;
      const sparkGrad = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sp.size * 2);
      sparkGrad.addColorStop(0, '#ffffff');
      sparkGrad.addColorStop(0.3, '#ffff00');
      sparkGrad.addColorStop(1, '#ff4400');
      ctx.fillStyle = sparkGrad;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    
    for (const d of this.debrisParticles) {
      const debrisAlpha = d.life / 60;
      ctx.save();
      ctx.globalAlpha = debrisAlpha;
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rotation);
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      const debrisGrad = ctx.createLinearGradient(-d.size, -d.size, d.size, d.size);
      debrisGrad.addColorStop(0, '#666666');
      debrisGrad.addColorStop(0.5, '#444444');
      debrisGrad.addColorStop(1, '#222222');
      ctx.fillStyle = debrisGrad;
      ctx.fillRect(-d.size, -d.size * 0.5, d.size * 2, d.size);
      ctx.restore();
    }

    ctx.restore();
  }
}

// =============================================================================
// SMOKE CLOUD CLASS
// =============================================================================

class SmokeCloud {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = CONFIG.SMOKE_RADIUS;
    this.life = CONFIG.SMOKE_DURATION;
    this.maxLife = CONFIG.SMOKE_DURATION;
    this.particles = [];

    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * this.radius,
        y: y + (Math.random() - 0.5) * this.radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 20 + Math.random() * 30
      });
    }
  }

  update() {
    this.life--;
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx += (Math.random() - 0.5) * 0.1;
      p.vy += (Math.random() - 0.5) * 0.1;
    }
  }

  draw(ctx) {
    const alpha = Math.min(0.7, this.life / this.maxLife);
    ctx.fillStyle = `rgba(180, 180, 180, ${alpha * 0.3})`;

    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  blocksVision(x1, y1, x2, y2) {
    // Check if line passes through smoke
    const dist = utils.distance(this.x, this.y, (x1+x2)/2, (y1+y2)/2);
    return dist < this.radius && this.life > this.maxLife * 0.2;
  }
}

// =============================================================================
// BREACH CHARGE CLASS
// =============================================================================

class BreachCharge {
  constructor(x, y, wall, placer) {
    this.x = x;
    this.y = y;
    this.wall = wall;
    this.placer = placer;
    this.armed = false;
    this.detonated = false;
    this.mode = 'breach'; // 'breach' or 'flash'
  }

  arm() {
    this.armed = true;
  }

  detonate() {
    if (!this.armed) return false;
    this.detonated = true;
    return true;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Charge body
    ctx.fillStyle = '#333';
    ctx.fillRect(-8, -4, 16, 8);

    // LED
    ctx.fillStyle = this.armed ? '#00ff00' : '#ff0000';
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// =============================================================================
// MAP DEFINITIONS
// =============================================================================

const MAP_TYPES = {
  compound: { name: 'Military Compound', description: 'Large outdoor facility with multiple buildings' },
  warehouse: { name: 'Abandoned Warehouse', description: 'Industrial complex with open spaces' },
  office: { name: 'Office Complex', description: 'Multi-floor office building layout' },
  embassy: { name: 'Embassy', description: 'High-security diplomatic building' },
  jungle: { name: 'Jungle Outpost', description: 'Dense jungle with supply crates and barriers' },
  random: { name: 'Random Generated', description: 'Procedurally generated layout' }
};

// =============================================================================
// LEVEL CLASS
// =============================================================================

class Level {
  constructor(mapType = 'compound') {
    this.walls = [];
    this.doors = [];
    this.decorations = []; // Trees, bushes, crates, barriers, etc.
    this.spawnPoints = { team: [], enemy: [], boss: null };
    this.objectives = [];
    this.mapType = mapType;
    this.mapName = MAP_TYPES[mapType]?.name || 'Unknown';

    // Fog of war system - track discovered areas using a grid
    this.fogGridSize = 50; // Size of each fog cell
    this.fogGridWidth = Math.ceil(CONFIG.MAP_WIDTH / this.fogGridSize);
    this.fogGridHeight = Math.ceil(CONFIG.MAP_HEIGHT / this.fogGridSize);
    this.discoveredGrid = new Array(this.fogGridWidth * this.fogGridHeight).fill(false);
    this.visibilityRange = 350; // How far player can see

    this.generate(mapType);
  }

  // Update discovered areas based on player and team positions
  updateFogOfWar(playerX, playerY, teammates = []) {
    const range = this.visibilityRange;
    const gridSize = this.fogGridSize;

    // Helper to reveal around a position
    const revealAround = (x, y) => {
      const cellsToReveal = Math.ceil(range / gridSize) + 1;
      const centerCellX = Math.floor(x / gridSize);
      const centerCellY = Math.floor(y / gridSize);

      for (let dx = -cellsToReveal; dx <= cellsToReveal; dx++) {
        for (let dy = -cellsToReveal; dy <= cellsToReveal; dy++) {
          const cellX = centerCellX + dx;
          const cellY = centerCellY + dy;

          if (cellX >= 0 && cellX < this.fogGridWidth && cellY >= 0 && cellY < this.fogGridHeight) {
            const cellCenterX = (cellX + 0.5) * gridSize;
            const cellCenterY = (cellY + 0.5) * gridSize;
            const dist = utils.distance(x, y, cellCenterX, cellCenterY);

            if (dist <= range) {
              this.discoveredGrid[cellY * this.fogGridWidth + cellX] = true;
            }
          }
        }
      }
    };

    // Reveal around player
    revealAround(playerX, playerY);

    // Reveal around living teammates
    for (const tm of teammates) {
      if (!tm.isDead) {
        revealAround(tm.x, tm.y);
      }
    }
  }

  // Check if a position is currently visible (in range of player/team)
  isCurrentlyVisible(x, y, playerX, playerY, teammates = []) {
    if (utils.distance(x, y, playerX, playerY) <= this.visibilityRange) {
      return true;
    }
    for (const tm of teammates) {
      if (!tm.isDead && utils.distance(x, y, tm.x, tm.y) <= this.visibilityRange) {
        return true;
      }
    }
    return false;
  }

  // Check if a position has been discovered
  isDiscovered(x, y) {
    const cellX = Math.floor(x / this.fogGridSize);
    const cellY = Math.floor(y / this.fogGridSize);
    if (cellX >= 0 && cellX < this.fogGridWidth && cellY >= 0 && cellY < this.fogGridHeight) {
      return this.discoveredGrid[cellY * this.fogGridWidth + cellX];
    }
    return false;
  }

  // Standardized office layout helper - generates consistent office design
  generateStandardOfficeLayout(themeName = 'Office') {
    const W = CONFIG.MAP_WIDTH;
    const H = CONFIG.MAP_HEIGHT;

    // Outer walls
    this.addWall(0, 0, W, 20, 'concrete');
    this.addWall(0, H-20, W, 20, 'concrete');
    this.addWall(0, 0, 20, H, 'concrete');
    this.addWall(W-20, 0, 20, H, 'concrete');

    // === GRID OF OFFICES ===
    const roomWidth = 250;
    const roomHeight = 200;
    const corridorWidth = 100;

    // Main horizontal corridors with guaranteed doors
    for (let y = 0; y < 4; y++) {
      const corridorY = 300 + y * (roomHeight + corridorWidth);
      this.addWall(20, corridorY, W - 40, 12, 'drywall');
      // Add doors along corridor at fixed positions
      for (let x = 0; x < 8; x++) {
        this.addDoor(150 + x * 350, corridorY, 60, 12, 'horizontal');
      }
    }

    // Main vertical corridors with guaranteed doors
    for (let x = 0; x < 5; x++) {
      const corridorX = 400 + x * (roomWidth + corridorWidth + 150);
      if (corridorX < W - 100) {
        this.addWall(corridorX, 20, 12, H - 40, 'drywall');
        // Add doors at fixed positions
        for (let y = 0; y < 5; y++) {
          this.addDoor(corridorX, 150 + y * 400, 12, 60, 'vertical');
        }
      }
    }

    // === CONFERENCE ROOMS (glass walls) ===
    // Conference 1 (top left)
    this.addWall(100, 100, 250, 12, 'glass');
    this.addWall(100, 100, 12, 150, 'drywall');
    this.addWall(350, 100, 12, 150, 'drywall');
    this.addDoor(350, 150, 12, 50, 'vertical');

    // Conference 2 (top center-left)
    this.addWall(600, 100, 300, 12, 'glass');
    this.addWall(600, 100, 12, 150, 'drywall');
    this.addWall(900, 100, 12, 150, 'drywall');
    this.addDoor(600, 150, 12, 50, 'vertical');

    // === EXECUTIVE SUITE (top right) ===
    this.addWall(2200, 100, 12, 400, 'drywall');
    this.addDoor(2200, 250, 12, 80, 'vertical');
    this.addWall(2200, 100, 600, 12, 'drywall');
    this.addWall(2200, 500, 600, 12, 'drywall');
    this.addWall(2500, 100, 12, 400, 'drywall');
    this.addDoor(2500, 280, 12, 60, 'vertical');
    // Glass windows in executive suite
    this.addWall(2300, 112, 8, 150, 'glass');
    this.addWall(2600, 112, 8, 150, 'glass');

    // === SERVER ROOM (metal walls, center-right) ===
    this.addWall(1500, 800, 300, 15, 'metal');
    this.addWall(1500, 800, 15, 250, 'metal');
    this.addWall(1500, 1050, 300, 15, 'metal');
    this.addWall(1800, 800, 15, 250, 'metal');
    this.addDoor(1500, 900, 15, 60, 'vertical');

    // === CUBICLE AREAS (wood partitions) ===
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 6; col++) {
        const x = 100 + col * 180;
        const y = 600 + row * 150;
        if (y < 1100) {
          this.addWall(x, y, 120, 8, 'wood');
          this.addWall(x, y, 8, 80, 'wood');
        }
      }
    }

    // === BREAK ROOM (right side) ===
    this.addWall(2400, 700, 12, 300, 'drywall');
    this.addDoor(2400, 800, 12, 60, 'vertical');
    this.addWall(2400, 700, 400, 12, 'drywall');
    this.addWall(2400, 1000, 400, 12, 'drywall');

    // === RECEPTION AREA (bottom center) ===
    this.addWall(20, 1500, 800, 15, 'glass');
    this.addWall(900, 1500, 800, 15, 'glass');
    this.addDoor(800, 1500, 100, 15, 'horizontal');
    this.addWall(400, 1515, 12, 300, 'drywall');
    this.addWall(800, 1515, 12, 300, 'drywall');
    this.addWall(1200, 1515, 12, 300, 'drywall');

    // === BATHROOMS (bottom right) ===
    this.addWall(1800, 1500, 15, 400, 'concrete');
    this.addWall(1815, 1500, 200, 12, 'concrete');
    this.addWall(2015, 1500, 15, 400, 'concrete');
    this.addDoor(1800, 1650, 15, 50, 'vertical');
    this.addWall(1815, 1700, 200, 12, 'drywall');
    this.addDoor(1900, 1700, 50, 12, 'horizontal');

    // === STAIRWELLS (far bottom right) ===
    this.addWall(2600, 1400, 200, 15, 'concrete');
    this.addWall(2600, 1400, 15, 400, 'concrete');
    this.addWall(2600, 1800, 200, 15, 'concrete');
    this.addWall(2800, 1400, 15, 400, 'concrete');
    this.addDoor(2600, 1550, 15, 80, 'vertical');

    // === SCATTERED DESKS/FURNITURE ===
    this.addWall(1200, 400, 60, 30, 'wood');
    this.addWall(1600, 350, 40, 40, 'wood');
    this.addWall(2000, 600, 50, 30, 'wood');

    // Default spawn points (can be overridden by specific maps)
    this.spawnPoints.team = [
      {x: 850, y: 1700}, {x: 900, y: 1750}, {x: 800, y: 1750}, {x: 850, y: 1800}
    ];

    this.spawnPoints.enemy = [
      {x: 2700, y: 300}, {x: 2400, y: 200},
      {x: 1650, y: 900}, {x: 200, y: 200},
      {x: 750, y: 400}, {x: 1300, y: 700},
      {x: 2600, y: 900}, {x: 500, y: 800},
      {x: 1900, y: 1600}, {x: 2700, y: 1600}
    ];

    // Default objectives (can be overridden)
    this.objectives.push({x: 2600, y: 300, type: 'hostage', secured: false});
    this.objectives.push({x: 1650, y: 920, type: 'intel', secured: false});
    this.objectives.push({x: 200, y: 150, type: 'bomb', secured: false});
  }

  generate(mapType) {
    // Clear existing
    this.walls = [];
    this.doors = [];
    this.decorations = [];
    this.spawnPoints = { team: [], enemy: [], boss: null };
    this.objectives = [];

    switch(mapType) {
      case 'warehouse':
        this.generateWarehouse();
        break;
      case 'office':
        this.generateOffice();
        break;
      case 'embassy':
        this.generateEmbassy();
        break;
      case 'jungle':
        this.generateJungle();
        break;
      case 'random':
        this.generateRandom();
        break;
      case 'compound':
      default:
        this.generateCompound();
        break;
    }
  }

  generateCompound() {
    // Use standardized office layout
    this.generateStandardOfficeLayout('Military Compound');

    // Override spawn points for compound theme
    this.spawnPoints.team = [
      {x: 60, y: 60}, {x: 100, y: 60}, {x: 60, y: 100}, {x: 100, y: 100}
    ];

    this.spawnPoints.enemy = [
      {x: 2700, y: 300}, {x: 2400, y: 200},
      {x: 1650, y: 900}, {x: 200, y: 200},
      {x: 750, y: 400}, {x: 1300, y: 700},
      {x: 2600, y: 900}, {x: 500, y: 800},
      {x: 1900, y: 1600}, {x: 2700, y: 1600},
      {x: 1000, y: 600}, {x: 600, y: 1300}
    ];

    // Boss spawn point - far corner of the map
    this.spawnPoints.boss = {x: 2700, y: 1600};

    // Override objectives for compound theme
    this.objectives = [];
    this.objectives.push({x: 2600, y: 300, type: 'hostage', secured: false});
    this.objectives.push({x: 1650, y: 920, type: 'intel', secured: false});
    this.objectives.push({x: 200, y: 150, type: 'bomb', secured: false});
  }

  generateWarehouse() {
    // Use standardized office layout
    this.generateStandardOfficeLayout('Abandoned Warehouse');

    // Override spawn points for warehouse theme
    this.spawnPoints.team = [
      {x: 60, y: 60}, {x: 120, y: 60}, {x: 60, y: 120}, {x: 120, y: 120}
    ];

    this.spawnPoints.enemy = [
      {x: 2700, y: 1100}, {x: 2500, y: 1000},
      {x: 2300, y: 200}, {x: 1800, y: 300},
      {x: 1600, y: 700}, {x: 1100, y: 1400},
      {x: 700, y: 1300}, {x: 300, y: 1600},
      {x: 1400, y: 100}, {x: 900, y: 700}
    ];

    // Boss spawn point
    this.spawnPoints.boss = {x: 300, y: 1600};

    // Override objectives for warehouse theme
    this.objectives = [];
    this.objectives.push({x: 2700, y: 800, type: 'hostage', secured: false});
    this.objectives.push({x: 300, y: 1650, type: 'intel', secured: false});
    this.objectives.push({x: 1650, y: 920, type: 'bomb', secured: false});
  }

  generateOffice() {
    // Use standardized office layout (this is the base design)
    this.generateStandardOfficeLayout('Office Complex');
    // Default spawn points and objectives are already set by the helper

    // Boss spawn point
    this.spawnPoints.boss = {x: 2600, y: 1500};
  }

  generateEmbassy() {
    // Use standardized office layout
    this.generateStandardOfficeLayout('Embassy');

    // Override spawn points for embassy theme
    this.spawnPoints.team = [
      {x: 100, y: 1000}, {x: 100, y: 1050}, {x: 100, y: 1100}, {x: 150, y: 1050}
    ];

    this.spawnPoints.enemy = [
      {x: 2350, y: 750}, {x: 2400, y: 500}, {x: 2300, y: 1100},
      {x: 1500, y: 500}, {x: 650, y: 700}, {x: 650, y: 900},
      {x: 1500, y: 1400}, {x: 1200, y: 1000},
      {x: 350, y: 350}, {x: 2650, y: 350}, {x: 2700, y: 1800}
    ];

    // Boss spawn point
    this.spawnPoints.boss = {x: 2650, y: 1800};

    // Override objectives for embassy theme
    this.objectives = [];
    this.objectives.push({x: 2600, y: 300, type: 'hostage', secured: false});
    this.objectives.push({x: 1650, y: 920, type: 'intel', secured: false});
    this.objectives.push({x: 200, y: 150, type: 'bomb', secured: false});
  }

  generateJungle() {
    // Use standardized office layout
    this.generateStandardOfficeLayout('Jungle Outpost');

    // Override spawn points for jungle theme (spawn at bottom)
    this.spawnPoints.team = [
      {x: 150, y: 1950}, {x: 200, y: 1950}, {x: 150, y: 2000}, {x: 200, y: 2000}
    ];

    this.spawnPoints.enemy = [
      {x: 1300, y: 950}, {x: 1500, y: 950},
      {x: 420, y: 600}, {x: 2500, y: 300},
      {x: 950, y: 1600}, {x: 1800, y: 500},
      {x: 2200, y: 900}, {x: 800, y: 1200},
      {x: 2400, y: 1300}, {x: 1500, y: 1500},
      {x: 2700, y: 800}, {x: 600, y: 400}
    ];

    // Boss spawn point
    this.spawnPoints.boss = {x: 2700, y: 300};

    // Override objectives for jungle theme
    this.objectives = [];
    this.objectives.push({x: 2600, y: 300, type: 'hostage', secured: false});
    this.objectives.push({x: 1650, y: 920, type: 'intel', secured: false});
    this.objectives.push({x: 200, y: 150, type: 'bomb', secured: false});
  }

  generateRandom() {
    // Use standardized office layout (same as other maps)
    this.generateStandardOfficeLayout('Random Generated');

    // Override spawn points for random theme
    this.spawnPoints.team = [
      {x: 80, y: 80}, {x: 140, y: 80}, {x: 80, y: 140}, {x: 140, y: 140}
    ];

    this.spawnPoints.enemy = [
      {x: 2700, y: 300}, {x: 2400, y: 200},
      {x: 1650, y: 900}, {x: 200, y: 200},
      {x: 750, y: 400}, {x: 1300, y: 700},
      {x: 2600, y: 900}, {x: 500, y: 800},
      {x: 1900, y: 1600}, {x: 2700, y: 1600}
    ];

    // Boss spawn point
    this.spawnPoints.boss = {x: 2700, y: 1600};

    // Override objectives for random theme
    this.objectives = [];
    this.objectives.push({x: 2600, y: 300, type: 'hostage', secured: false});
    this.objectives.push({x: 1650, y: 920, type: 'intel', secured: false});
    this.objectives.push({x: 200, y: 150, type: 'bomb', secured: false});
  }

  // BSP helper for random generation
  splitSpace(x, y, w, h, partitions, minSize) {
    if (w < minSize * 2 && h < minSize * 2) {
      partitions.push({x, y, w, h});
      return;
    }

    // Decide split direction
    let splitH;
    if (w < minSize * 2) splitH = true;
    else if (h < minSize * 2) splitH = false;
    else splitH = Math.random() > 0.5;

    if (splitH && h >= minSize * 2) {
      const split = minSize + Math.random() * (h - minSize * 2);
      this.splitSpace(x, y, w, split, partitions, minSize);
      this.splitSpace(x, y + split, w, h - split, partitions, minSize);
    } else if (!splitH && w >= minSize * 2) {
      const split = minSize + Math.random() * (w - minSize * 2);
      this.splitSpace(x, y, split, h, partitions, minSize);
      this.splitSpace(x + split, y, w - split, h, partitions, minSize);
    } else {
      partitions.push({x, y, w, h});
    }
  }

  addWall(x, y, w, h, material) {
    this.walls.push({
      x, y, w, h,
      material: CONFIG.MATERIALS[material],
      materialName: material,
      destroyed: false,
      hp: material === 'glass' ? 20 : (material === 'drywall' ? 50 : 200)
    });
  }

  addDoor(x, y, w, h, orientation) {
    this.doors.push({
      x, y, w, h,
      orientation,
      open: false,
      destroyed: false,
      hp: 100,
      material: CONFIG.MATERIALS.door
    });
  }

  // Decoration types: tree, bush, fern, crate, crate_ammo, crate_health, barrier, barrel, sandbag, log
  addDecoration(x, y, type, options = {}) {
    this.decorations.push({
      x, y,
      type,
      rotation: options.rotation || 0,
      scale: options.scale || 1,
      variant: options.variant || 0
    });
  }

  isSolid(x, y, ignoreDestroyed = true) {
    // First check if point is inside an open/destroyed door - if so, it's passable
    for (const door of this.doors) {
      if (door.destroyed || door.open) {
        if (utils.pointInRect(x, y, door.x, door.y, door.w, door.h)) {
          return null; // Open/destroyed door = passable, even if wall overlaps
        }
      }
    }
    for (const wall of this.walls) {
      if (ignoreDestroyed && wall.destroyed) continue;
      if (utils.pointInRect(x, y, wall.x, wall.y, wall.w, wall.h)) {
        return wall;
      }
    }
    for (const door of this.doors) {
      if (door.destroyed || door.open) continue;
      if (utils.pointInRect(x, y, door.x, door.y, door.w, door.h)) {
        return door;
      }
    }
    return null;
  }

  checkBulletCollision(x1, y1, x2, y2, bullet) {
    let closest = null;
    let closestDist = Infinity;

    const checkWalls = [...this.walls, ...this.doors.filter(d => !d.open && !d.destroyed)];

    for (const wall of checkWalls) {
      if (wall.destroyed) continue;

      // Check all 4 sides of the rectangle
      const sides = [
        {x1: wall.x, y1: wall.y, x2: wall.x + wall.w, y2: wall.y},
        {x1: wall.x + wall.w, y1: wall.y, x2: wall.x + wall.w, y2: wall.y + wall.h},
        {x1: wall.x, y1: wall.y + wall.h, x2: wall.x + wall.w, y2: wall.y + wall.h},
        {x1: wall.x, y1: wall.y, x2: wall.x, y2: wall.y + wall.h}
      ];

      for (const side of sides) {
        const hit = utils.lineIntersectsLine(x1, y1, x2, y2, side.x1, side.y1, side.x2, side.y2);
        if (hit) {
          const dist = utils.distance(x1, y1, hit.x, hit.y);
          if (dist < closestDist) {
            closestDist = dist;
            closest = { ...hit, wall, side };
          }
        }
      }
    }

    if (closest) {
      const wall = closest.wall;
      const mat = wall.material || CONFIG.MATERIALS.concrete;

      // Check penetration
      if (Math.random() < bullet.penetration * mat.pen && bullet.penetrationsLeft > 0) {
        bullet.penetrationsLeft--;
        bullet.damage *= mat.pen;

        // Damage wall
        wall.hp -= bullet.damage;
        if (wall.hp <= 0) wall.destroyed = true;

        if (mat.name === 'Glass') sound.play('glass');

        return null; // Bullet continues
      }

      // Check ricochet
      if (Math.random() < mat.ricochet) {
        sound.play('ricochet');
        // Reflect bullet
        const side = closest.side;
        if (side.y1 === side.y2) { // Horizontal surface
          bullet.vy *= -1;
        } else { // Vertical surface
          bullet.vx *= -1;
        }
        bullet.angle = Math.atan2(bullet.vy, bullet.vx);
        bullet.damage *= 0.5;
        bullet.x = closest.x;
        bullet.y = closest.y;
        return null;
      }

      // Bullet stops
      bullet.dead = true;

      // Damage wall
      wall.hp -= bullet.damage * 0.5;
      if (wall.hp <= 0) wall.destroyed = true;

      return { type: 'wall', wall, x: closest.x, y: closest.y };
    }

    return null;
  }

  checkLineOfSight(x1, y1, x2, y2, smokeClouds = []) {
    // Check smoke
    for (const smoke of smokeClouds) {
      if (smoke.blocksVision(x1, y1, x2, y2)) return false;
    }

    // Check walls
    for (const wall of this.walls) {
      if (wall.destroyed) continue;
      if (wall.material.name === 'Glass') continue; // Can see through glass
      if (utils.lineIntersectsRect(x1, y1, x2, y2, wall.x, wall.y, wall.w, wall.h)) {
        return false;
      }
    }

    for (const door of this.doors) {
      if (door.destroyed || door.open) continue;
      if (utils.lineIntersectsRect(x1, y1, x2, y2, door.x, door.y, door.w, door.h)) {
        return false;
      }
    }

    return true;
  }

  openDoor(x, y, radius = 30) {
    for (const door of this.doors) {
      if (door.destroyed || door.open) continue;
      const cx = door.x + door.w/2;
      const cy = door.y + door.h/2;
      if (utils.distance(x, y, cx, cy) < radius) {
        door.open = true;
        return door;
      }
    }
    return null;
  }

  breachWall(x, y, radius) {
    for (const wall of this.walls) {
      const cx = wall.x + wall.w/2;
      const cy = wall.y + wall.h/2;
      if (utils.distance(x, y, cx, cy) < radius + Math.max(wall.w, wall.h)/2) {
        if (wall.materialName !== 'concrete' && wall.materialName !== 'metal') {
          wall.destroyed = true;
        }
      }
    }
    for (const door of this.doors) {
      const cx = door.x + door.w/2;
      const cy = door.y + door.h/2;
      if (utils.distance(x, y, cx, cy) < radius) {
        door.destroyed = true;
      }
    }
  }

  draw(ctx) {
    // Enhanced floor with procedural concrete texture
    this.drawEnhancedFloor(ctx);

    // Draw wall shadows first (behind walls)
    this.drawWallShadows(ctx);

    // Enhanced walls with texture and depth
    this.drawEnhancedWalls(ctx);

    // Enhanced doors
    this.drawEnhancedDoors(ctx);

    // Decorations (vegetation, crates, barrels, etc.)
    this.drawDecorations(ctx);

    // Objectives
    this.drawObjectives(ctx);
  }

  drawObjectives(ctx) {
    for (const obj of this.objectives) {
      if (obj.secured) continue;
      const colors = {
        hostage: { fill: '#ffff0044', stroke: '#ffff00', glow: '#ffff00' },
        intel: { fill: '#00ff0044', stroke: '#00ff00', glow: '#00ff00' },
        bomb: { fill: '#ff000044', stroke: '#ff0000', glow: '#ff0000' }
      };
      const color = colors[obj.type] || colors.hostage;

      // Pulsing glow effect
      const pulse = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;
      ctx.shadowColor = color.glow;
      ctx.shadowBlur = 15 * pulse;

      ctx.fillStyle = color.fill;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = color.stroke;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.shadowBlur = 0;
    }
  }

  drawEnhancedFloor(ctx) {
    // Base floor color - darker concrete
    ctx.fillStyle = '#1e2028';
    ctx.fillRect(0, 0, CONFIG.MAP_WIDTH, CONFIG.MAP_HEIGHT);

    // Procedural concrete/industrial floor tiles
    const tileSize = 100;
    for (let x = 0; x < CONFIG.MAP_WIDTH; x += tileSize) {
      for (let y = 0; y < CONFIG.MAP_HEIGHT; y += tileSize) {
        // Vary tile brightness slightly
        const seed = (x * 7 + y * 13) % 100;
        const brightness = 28 + (seed % 8);
        ctx.fillStyle = `rgb(${brightness}, ${brightness + 2}, ${brightness + 6})`;
        ctx.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2);

        // Tile grout/gap lines
        ctx.strokeStyle = '#0a0c10';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, tileSize, tileSize);

        // Add subtle concrete texture noise
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        for (let i = 0; i < 5; i++) {
          const nx = x + ((seed * (i + 1) * 17) % tileSize);
          const ny = y + ((seed * (i + 2) * 23) % tileSize);
          const size = 2 + (seed % 4);
          ctx.beginPath();
          ctx.arc(nx, ny, size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Dark stain spots for realism
        if (seed % 7 === 0) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
          const stainX = x + 20 + (seed % 60);
          const stainY = y + 20 + ((seed * 3) % 60);
          ctx.beginPath();
          ctx.ellipse(stainX, stainY, 15 + (seed % 20), 10 + (seed % 15), seed * 0.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Metal grating/drainage pattern in some areas
    for (let x = 200; x < CONFIG.MAP_WIDTH; x += 600) {
      for (let y = 200; y < CONFIG.MAP_HEIGHT; y += 600) {
        this.drawMetalGrating(ctx, x, y, 80, 80);
      }
    }
  }

  drawMetalGrating(ctx, x, y, w, h) {
    // Metal grate frame
    ctx.fillStyle = '#2a3040';
    ctx.fillRect(x, y, w, h);

    // Grate holes pattern
    ctx.fillStyle = '#0a0c10';
    const spacing = 10;
    for (let gx = x + 5; gx < x + w - 5; gx += spacing) {
      for (let gy = y + 5; gy < y + h - 5; gy += spacing) {
        ctx.fillRect(gx, gy, 6, 6);
      }
    }

    // Metal frame border
    ctx.strokeStyle = '#3a4555';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // Highlight edge
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.stroke();
  }

  drawWallShadows(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    const shadowOffset = 8;

    for (const wall of this.walls) {
      if (wall.destroyed) continue;
      // Draw shadow offset to bottom-right
      ctx.fillRect(wall.x + shadowOffset, wall.y + shadowOffset, wall.w, wall.h);
    }

    for (const door of this.doors) {
      if (door.destroyed || door.open) continue;
      ctx.fillRect(door.x + shadowOffset, door.y + shadowOffset, door.w, door.h);
    }
  }

  drawEnhancedWalls(ctx) {
    for (const wall of this.walls) {
      if (wall.destroyed) {
        // Rubble for destroyed walls
        this.drawRubble(ctx, wall.x, wall.y, wall.w, wall.h);
        continue;
      }

      // Base wall color with gradient effect
      const baseColor = wall.material.color;
      const gradient = ctx.createLinearGradient(wall.x, wall.y, wall.x + wall.w, wall.y + wall.h);
      gradient.addColorStop(0, this.lightenColor(baseColor, 15));
      gradient.addColorStop(0.5, baseColor);
      gradient.addColorStop(1, this.darkenColor(baseColor, 20));
      ctx.fillStyle = gradient;
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);

      // Wall texture pattern based on material
      if (wall.materialName === 'concrete') {
        this.drawConcreteTexture(ctx, wall.x, wall.y, wall.w, wall.h);
      } else if (wall.materialName === 'metal') {
        this.drawMetalTexture(ctx, wall.x, wall.y, wall.w, wall.h);
      } else if (wall.materialName === 'wood') {
        this.drawWoodTexture(ctx, wall.x, wall.y, wall.w, wall.h);
      } else if (wall.materialName === 'drywall') {
        this.drawDrywallTexture(ctx, wall.x, wall.y, wall.w, wall.h);
      }

      // Top edge highlight (3D effect)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(wall.x, wall.y);
      ctx.lineTo(wall.x + wall.w, wall.y);
      ctx.stroke();

      // Left edge highlight
      ctx.beginPath();
      ctx.moveTo(wall.x, wall.y);
      ctx.lineTo(wall.x, wall.y + wall.h);
      ctx.stroke();

      // Bottom/right edge shadow
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.moveTo(wall.x + wall.w, wall.y);
      ctx.lineTo(wall.x + wall.w, wall.y + wall.h);
      ctx.lineTo(wall.x, wall.y + wall.h);
      ctx.stroke();

      // Damage cracks
      if (wall.hp < 100) {
        this.drawDamageCracks(ctx, wall.x, wall.y, wall.w, wall.h, 1 - wall.hp / 100);
      }
    }
  }

  drawConcreteTexture(ctx, x, y, w, h) {
    // Subtle concrete speckles
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    const seed = x * 7 + y * 13;
    for (let i = 0; i < Math.min(w * h / 100, 20); i++) {
      const px = x + ((seed * (i + 1) * 17) % w);
      const py = y + ((seed * (i + 2) * 23) % h);
      ctx.beginPath();
      ctx.arc(px, py, 1 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawMetalTexture(ctx, x, y, w, h) {
    // Horizontal metal panel lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let ly = y + 15; ly < y + h; ly += 20) {
      ctx.beginPath();
      ctx.moveTo(x + 2, ly);
      ctx.lineTo(x + w - 2, ly);
      ctx.stroke();
    }

    // Rivet dots
    ctx.fillStyle = 'rgba(100, 100, 120, 0.5)';
    for (let rx = x + 8; rx < x + w; rx += 25) {
      ctx.beginPath();
      ctx.arc(rx, y + 5, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(rx, y + h - 5, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawWoodTexture(ctx, x, y, w, h) {
    // Wood grain lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    const grainSpacing = 8;
    for (let gy = y; gy < y + h; gy += grainSpacing) {
      const waveOffset = Math.sin(gy * 0.1) * 3;
      ctx.beginPath();
      ctx.moveTo(x, gy);
      ctx.quadraticCurveTo(x + w / 2, gy + waveOffset, x + w, gy);
      ctx.stroke();
    }
  }

  drawDrywallTexture(ctx, x, y, w, h) {
    // Subtle drywall bumps
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    const seed = x * 11 + y * 17;
    for (let i = 0; i < Math.min(w * h / 150, 15); i++) {
      const px = x + ((seed * (i + 1) * 13) % w);
      const py = y + ((seed * (i + 2) * 19) % h);
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawDamageCracks(ctx, x, y, w, h, damage) {
    ctx.strokeStyle = `rgba(20, 20, 20, ${0.3 + damage * 0.5})`;
    ctx.lineWidth = 1 + damage * 2;

    const numCracks = Math.floor(damage * 5) + 1;
    const seed = x * 7 + y * 11;

    for (let i = 0; i < numCracks; i++) {
      const startX = x + ((seed * (i + 1)) % w);
      const startY = y + ((seed * (i + 2)) % h);

      ctx.beginPath();
      ctx.moveTo(startX, startY);

      let cx = startX, cy = startY;
      for (let j = 0; j < 3; j++) {
        cx += ((seed * (j + 3)) % 20) - 10;
        cy += ((seed * (j + 4)) % 20) - 10;
        cx = Math.max(x, Math.min(x + w, cx));
        cy = Math.max(y, Math.min(y + h, cy));
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }

    // Bullet holes
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    for (let i = 0; i < Math.floor(damage * 3); i++) {
      const hx = x + ((seed * (i + 5)) % w);
      const hy = y + ((seed * (i + 6)) % h);
      ctx.beginPath();
      ctx.arc(hx, hy, 2 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawRubble(ctx, x, y, w, h) {
    // Dark rubble background
    ctx.fillStyle = '#0a0c10';
    ctx.fillRect(x, y, w, h);

    // Rubble pieces
    const seed = x * 13 + y * 17;
    const numPieces = Math.floor((w * h) / 80);

    for (let i = 0; i < numPieces; i++) {
      const px = x + ((seed * (i + 1) * 7) % w);
      const py = y + ((seed * (i + 2) * 11) % h);
      const size = 3 + (i % 8);
      const shade = 30 + ((seed * i) % 40);

      ctx.fillStyle = `rgb(${shade}, ${shade - 5}, ${shade - 10})`;
      ctx.beginPath();
      ctx.moveTo(px, py - size);
      ctx.lineTo(px + size, py);
      ctx.lineTo(px, py + size);
      ctx.lineTo(px - size, py);
      ctx.closePath();
      ctx.fill();
    }
  }

  drawEnhancedDoors(ctx) {
    for (const door of this.doors) {
      if (door.destroyed) {
        this.drawRubble(ctx, door.x, door.y, door.w, door.h);
        continue;
      }

      if (door.open) {
        // Open door - just frame visible
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(door.x, door.y, door.w, door.h);
        ctx.strokeStyle = '#3a3a3a';
        ctx.lineWidth = 2;
        ctx.strokeRect(door.x, door.y, door.w, door.h);
      } else {
        // Closed door with wood grain
        const gradient = ctx.createLinearGradient(door.x, door.y, door.x + door.w, door.y);
        gradient.addColorStop(0, '#7a5a3a');
        gradient.addColorStop(0.5, '#654321');
        gradient.addColorStop(1, '#5a4020');
        ctx.fillStyle = gradient;
        ctx.fillRect(door.x, door.y, door.w, door.h);

        // Door frame
        ctx.strokeStyle = '#4a3520';
        ctx.lineWidth = 3;
        ctx.strokeRect(door.x, door.y, door.w, door.h);

        // Door handle
        const handleX = door.w > door.h ? door.x + door.w - 10 : door.x + door.w / 2;
        const handleY = door.w > door.h ? door.y + door.h / 2 : door.y + door.h - 10;
        ctx.fillStyle = '#8a8a6a';
        ctx.beginPath();
        ctx.arc(handleX, handleY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(door.x + 1, door.y + 1);
        ctx.lineTo(door.x + door.w - 1, door.y + 1);
        ctx.stroke();
      }
    }
  }

  lightenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + percent);
    const g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
    const b = Math.min(255, (num & 0x0000FF) + percent);
    return `rgb(${r}, ${g}, ${b})`;
  }

  darkenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - percent);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - percent);
    const b = Math.max(0, (num & 0x0000FF) - percent);
    return `rgb(${r}, ${g}, ${b})`;
  }

  drawDecorations(ctx) {

    // Decorations (vegetation, crates, barrels, etc.)
    for (const dec of this.decorations) {
      ctx.save();
      ctx.translate(dec.x, dec.y);
      ctx.rotate(dec.rotation);
      ctx.scale(dec.scale, dec.scale);

      switch(dec.type) {
        case 'tree':
          // Tree trunk
          ctx.fillStyle = '#4a3520';
          ctx.fillRect(-8, -8, 16, 16);
          // Foliage (layered circles for depth)
          ctx.fillStyle = '#1a5c1a';
          ctx.beginPath();
          ctx.arc(0, -15, 35, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#228b22';
          ctx.beginPath();
          ctx.arc(-10, -20, 25, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(12, -18, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#2d8b2d';
          ctx.beginPath();
          ctx.arc(0, -25, 20, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'palm':
          // Palm trunk
          ctx.fillStyle = '#5c4033';
          ctx.fillRect(-6, -10, 12, 30);
          // Palm fronds
          ctx.fillStyle = '#228b22';
          for (let i = 0; i < 6; i++) {
            ctx.save();
            ctx.rotate(i * Math.PI / 3);
            ctx.beginPath();
            ctx.ellipse(0, -40, 8, 35, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          ctx.fillStyle = '#2d9b2d';
          for (let i = 0; i < 6; i++) {
            ctx.save();
            ctx.rotate(i * Math.PI / 3 + 0.3);
            ctx.beginPath();
            ctx.ellipse(0, -35, 6, 28, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          break;

        case 'bush':
          // Bush variants with different shapes
          const bushColors = ['#228b22', '#2d8b2d', '#1a6b1a'];
          ctx.fillStyle = bushColors[dec.variant % 3];
          if (dec.variant === 0) {
            // Round bush
            ctx.beginPath();
            ctx.arc(0, 0, 25, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#32ab32';
            ctx.beginPath();
            ctx.arc(-5, -5, 15, 0, Math.PI * 2);
            ctx.fill();
          } else if (dec.variant === 1) {
            // Cluster bush
            ctx.beginPath();
            ctx.arc(-10, 0, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(10, 5, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#32ab32';
            ctx.beginPath();
            ctx.arc(0, -5, 14, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Spiky bush
            ctx.beginPath();
            ctx.moveTo(0, -25);
            for (let i = 0; i < 8; i++) {
              const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
              const r = i % 2 === 0 ? 25 : 15;
              ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            }
            ctx.closePath();
            ctx.fill();
          }
          break;

        case 'fern':
          // Small fern plants
          ctx.fillStyle = dec.variant === 0 ? '#3a7a3a' : '#2a6a2a';
          for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.rotate(i * Math.PI / 2.5 - Math.PI / 2);
            ctx.beginPath();
            ctx.ellipse(0, -12, 3, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          break;

        case 'log':
          // Fallen tree log
          ctx.fillStyle = '#5c4033';
          ctx.fillRect(-50, -10, 100, 20);
          ctx.fillStyle = '#4a3520';
          ctx.beginPath();
          ctx.arc(-50, 0, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#6b5040';
          ctx.beginPath();
          ctx.arc(50, 0, 10, 0, Math.PI * 2);
          ctx.fill();
          // Wood rings
          ctx.strokeStyle = '#3a2510';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(-50, 0, 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(-50, 0, 7, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case 'barrel':
          // Metal/oil barrel
          ctx.fillStyle = dec.variant === 0 ? '#4a4a5a' : '#5a4a3a';
          ctx.beginPath();
          ctx.ellipse(0, 0, 15, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          // Barrel bands
          ctx.strokeStyle = '#2a2a2a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(0, -6, 14, 4, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(0, 6, 14, 4, 0, 0, Math.PI * 2);
          ctx.stroke();
          // Top highlight
          ctx.fillStyle = dec.variant === 0 ? '#5a5a6a' : '#6a5a4a';
          ctx.beginPath();
          ctx.ellipse(0, -2, 10, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'sandbag':
          // Sandbag barrier
          ctx.fillStyle = '#8b7355';
          // Bottom row
          ctx.beginPath();
          ctx.ellipse(-18, 5, 16, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(0, 5, 16, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(18, 5, 16, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          // Top row
          ctx.fillStyle = '#9b8365';
          ctx.beginPath();
          ctx.ellipse(-10, -5, 16, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(10, -5, 16, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'crate':
          // Wooden crate
          ctx.fillStyle = '#6b5030';
          ctx.fillRect(-20, -20, 40, 40);
          ctx.strokeStyle = '#4a3020';
          ctx.lineWidth = 2;
          ctx.strokeRect(-20, -20, 40, 40);
          // Cross pattern
          ctx.beginPath();
          ctx.moveTo(-20, 0);
          ctx.lineTo(20, 0);
          ctx.moveTo(0, -20);
          ctx.lineTo(0, 20);
          ctx.stroke();
          break;

        case 'crate_ammo':
          // Ammo crate (green markings)
          ctx.fillStyle = '#5a5030';
          ctx.fillRect(-22, -18, 44, 36);
          ctx.strokeStyle = '#3a3020';
          ctx.lineWidth = 2;
          ctx.strokeRect(-22, -18, 44, 36);
          // Ammo markings
          ctx.fillStyle = '#4a6a30';
          ctx.fillRect(-18, -14, 36, 8);
          ctx.fillRect(-18, 6, 36, 8);
          ctx.strokeStyle = '#2a4a20';
          ctx.lineWidth = 1;
          ctx.strokeRect(-18, -14, 36, 8);
          ctx.strokeRect(-18, 6, 36, 8);
          break;

        case 'crate_health':
          // Health/supply crate (red markings)
          ctx.fillStyle = '#5a4040';
          ctx.fillRect(-20, -20, 40, 40);
          ctx.strokeStyle = '#3a2020';
          ctx.lineWidth = 2;
          ctx.strokeRect(-20, -20, 40, 40);
          // Red cross
          ctx.fillStyle = '#8a3030';
          ctx.fillRect(-4, -14, 8, 28);
          ctx.fillRect(-14, -4, 28, 8);
          break;

        case 'barrier':
          // Construction barrier (yellow/black)
          ctx.fillStyle = '#d4a520';
          ctx.fillRect(-40, -8, 80, 16);
          // Black stripes
          ctx.fillStyle = '#1a1a1a';
          for (let i = -35; i < 35; i += 20) {
            ctx.save();
            ctx.translate(i, 0);
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(-4, -15, 8, 30);
            ctx.restore();
          }
          break;
      }

      ctx.restore();
    }
  }

  // Draw fog of war overlay - call this after drawing the level
  drawFogOfWar(ctx, playerX, playerY, teammates = []) {
    const gridSize = this.fogGridSize;

    // Draw fog overlay for undiscovered areas
    for (let cellY = 0; cellY < this.fogGridHeight; cellY++) {
      for (let cellX = 0; cellX < this.fogGridWidth; cellX++) {
        const x = cellX * gridSize;
        const y = cellY * gridSize;
        const discovered = this.discoveredGrid[cellY * this.fogGridWidth + cellX];
        const currentlyVisible = this.isCurrentlyVisible(
          x + gridSize / 2, y + gridSize / 2,
          playerX, playerY, teammates
        );

        if (!discovered) {
          // Completely dark (undiscovered) - reduced opacity for better visibility
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(x, y, gridSize, gridSize);
        } else if (!currentlyVisible) {
          // Discovered but not currently visible (fog) - lighter fog
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.fillRect(x, y, gridSize, gridSize);
        }
        // If currently visible, don't draw any overlay
      }
    }
  }
}

// =============================================================================
// PLAYER CLASS
// =============================================================================

class Player {
  constructor(x, y, isLocal = false, soldierClass = 'assault') {
    this.id = utils.generateId();
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.radius = CONFIG.PLAYER_RADIUS;

    this.isLocal = isLocal;
    this.isAI = false;
    this.isRemote = false; // For multiplayer remote players
    this.networkId = null; // Server-assigned player ID
    this.team = 'blue';
    this.name = isLocal ? 'You' : 'Teammate';

    // Soldier Class & Stats
    this.soldierClass = soldierClass;
    this.classData = CONFIG.SOLDIER_CLASSES[soldierClass] || CONFIG.SOLDIER_CLASSES.assault;
    this.baseStats = { ...this.classData.stats };
    
    // Gear Loadout
    this.gear = {
      body: null,
      head: null,
      tactical: null,
      accessory: null,
      weapon_mod: null
    };
    this.applyDefaultGear();

    // Interpolation targets (for remote players)
    this.targetX = undefined;
    this.targetY = undefined;
    this.targetAngle = undefined;

    // Health (based on class stats + gear bonuses)
    this.maxHp = this.calculateMaxHealth();
    this.hp = this.maxHp;
    this.armor = this.calculateArmor();
    this.isDead = false;
    this.bleeding = 0;

    // Stance
    this.stance = 'stand'; // 'stand', 'crouch', 'prone'
    this.lean = 0; // -1 left, 0 center, 1 right
    this.targetLean = 0;
    this.isADS = false;

    // Movement
    this.vx = 0;
    this.vy = 0;
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.isSprinting = false;
    this.stamina = 100;
    this.maxStamina = 100;
    // Click-to-move target
    this.moveTargetX = null;
    this.moveTargetY = null;

    // Weapons (based on class defaults)
    this.weapons = this.classData.defaultWeapons.map(w => this.createWeapon(w));
    this.currentWeapon = 0;
    this.fireTimer = 0;
    this.isReloading = false;
    this.reloadTimer = 0;
    this.isFiring = false;

    // Grenades (from gear)
    this.grenades = this.calculateGrenades();
    this.selectedGrenade = Object.keys(this.grenades)[0] || 'frag';

    // Special equipment from gear
    this.breachCharges = this.getGearValue('breachCharges') || 0;
    this.healCharges = this.getGearValue('healCharges') || 0;
    this.healAmount = this.getGearValue('healAmount') || 0;

    // Effects
    this.flashedTimer = 0;
    this.muzzleFlash = 0;
    this.recoilOffset = 0;

    // Audio
    this.footstepTimer = 0;

    // AI Orders (for AI teammates)
    this.currentOrder = 'follow'; // 'follow', 'stay', 'guard', 'cover'
    this.orderPosition = null; // Position for stay/guard orders
    this.guardRadius = 150; // Radius for guard order
    this.coverTarget = null; // Target position for cover order

    // Kill/Mission stats
    this.kills = 0;
    this.assists = 0;
    this.damageDealt = 0;
    this.shotsFired = 0;
    this.shotsHit = 0;
  }

  applyDefaultGear() {
    for (const gearId of this.classData.defaultGear) {
      const gearData = CONFIG.GEAR[gearId];
      if (gearData) {
        this.gear[gearData.slot] = gearId;
      }
    }
  }

  calculateMaxHealth() {
    return this.baseStats.health;
  }

  calculateArmor() {
    let armor = this.baseStats.armor || 0;
    for (const slot in this.gear) {
      const gearId = this.gear[slot];
      if (gearId) {
        const gearData = CONFIG.GEAR[gearId];
        if (gearData && gearData.armorBonus) {
          armor += gearData.armorBonus;
        }
      }
    }
    return armor;
  }

  calculateGrenades() {
    const grenades = { frag: 0, smoke: 0 };
    for (const slot in this.gear) {
      const gearId = this.gear[slot];
      if (gearId) {
        const gearData = CONFIG.GEAR[gearId];
        if (gearData && gearData.grenades) {
          for (const type in gearData.grenades) {
            grenades[type] = (grenades[type] || 0) + gearData.grenades[type];
          }
        }
      }
    }
    return grenades;
  }

  getGearValue(property) {
    for (const slot in this.gear) {
      const gearId = this.gear[slot];
      if (gearId) {
        const gearData = CONFIG.GEAR[gearId];
        if (gearData && gearData[property]) {
          return gearData[property];
        }
      }
    }
    return null;
  }

  getSpeedMultiplier() {
    let speedMult = this.baseStats.speed;
    for (const slot in this.gear) {
      const gearId = this.gear[slot];
      if (gearId) {
        const gearData = CONFIG.GEAR[gearId];
        if (gearData && gearData.speedPenalty) {
          speedMult -= gearData.speedPenalty;
        }
      }
    }
    return Math.max(0.5, speedMult);
  }

  getAccuracyMultiplier() {
    let accMult = this.baseStats.accuracy;
    for (const slot in this.gear) {
      const gearId = this.gear[slot];
      if (gearId) {
        const gearData = CONFIG.GEAR[gearId];
        if (gearData && gearData.awarenessBonus) {
          accMult += gearData.awarenessBonus * 0.5;
        }
      }
    }
    return accMult;
  }

  getStats() {
    return {
      health: this.maxHp,
      armor: this.armor,
      speed: Math.round(this.getSpeedMultiplier() * 100),
      accuracy: Math.round(this.getAccuracyMultiplier() * 100),
      staminaRegen: Math.round(this.baseStats.staminaRegen * 100)
    };
  }

  getGearList() {
    const list = [];
    for (const slot in this.gear) {
      const gearId = this.gear[slot];
      if (gearId) {
        const gearData = CONFIG.GEAR[gearId];
        if (gearData) {
          list.push({ slot, id: gearId, ...gearData });
        }
      }
    }
    return list;
  }

  takeDamage(amount) {
    // Armor reduces damage
    const armorReduction = Math.min(amount * 0.5, this.armor * 0.5);
    const actualDamage = Math.max(1, amount - armorReduction);
    this.hp -= actualDamage;
    
    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
    }
    return actualDamage;
  }

  useHeal(target) {
    if (this.healCharges > 0 && target && !target.isDead) {
      const healAmount = Math.min(this.healAmount, target.maxHp - target.hp);
      target.hp += healAmount;
      this.healCharges--;
      return healAmount;
    }
    return 0;
  }

  createWeapon(type) {
    const template = CONFIG.WEAPONS[type];
    return {
      ...template,
      type,
      ammo: template.magSize,
      reserveAmmo: template.magSize * 3
    };
  }

  get weapon() {
    return this.weapons[this.currentWeapon];
  }

  get speed() {
    let base = this.stance === 'stand' ? CONFIG.PLAYER_SPEED_STAND :
               this.stance === 'crouch' ? CONFIG.PLAYER_SPEED_CROUCH :
               CONFIG.PLAYER_SPEED_PRONE;
    // Apply class and gear speed multiplier
    base *= this.getSpeedMultiplier();
    if (this.isSprinting && this.stance === 'stand') base *= 1.5;
    if (this.isADS) base *= 0.5;
    // Apply adrenaline boost
    if (window.__game && window.__game.adrenalineActive) base *= 1.5;
    return base;
  }

  get accuracy() {
    let acc = this.stance === 'stand' ? CONFIG.ACCURACY_STAND :
              this.stance === 'crouch' ? CONFIG.ACCURACY_CROUCH :
              CONFIG.ACCURACY_PRONE;
    // Apply class and gear accuracy multiplier (lower is better)
    acc *= (2 - this.getAccuracyMultiplier());
    if (this.isADS) acc *= CONFIG.ACCURACY_ADS;
    if (Math.abs(this.vx) > 0.1 || Math.abs(this.vy) > 0.1) acc *= CONFIG.ACCURACY_MOVING;
    return acc;
  }

  update(mouseX, mouseY, level) {
    if (this.isDead) return;

    // Bleeding damage
    if (this.bleeding > 0) {
      this.hp -= this.bleeding * 0.02;
      this.bleeding *= 0.995;
      if (this.bleeding < 0.1) this.bleeding = 0;
    }

    if (this.hp <= 0) {
      this.isDead = true;
      return;
    }

    // Calculate aim position with lean offset
    const leanOffsetX = Math.cos(this.angle + Math.PI/2) * this.lean * CONFIG.LEAN_DISTANCE;
    const leanOffsetY = Math.sin(this.angle + Math.PI/2) * this.lean * CONFIG.LEAN_DISTANCE;

    this.angle = utils.angle(this.x + leanOffsetX, this.y + leanOffsetY, mouseX, mouseY);

    // Lean interpolation
    this.lean = utils.lerp(this.lean, this.targetLean, CONFIG.LEAN_SPEED);

    // Movement
    this.vx = 0;
    this.vy = 0;

    // WASD movement
    if (this.moveUp) this.vy -= 1;
    if (this.moveDown) this.vy += 1;
    if (this.moveLeft) this.vx -= 1;
    if (this.moveRight) this.vx += 1;

    // Click-to-move (if no WASD input and target exists)
    if (this.vx === 0 && this.vy === 0 && this.moveTargetX !== null && this.moveTargetY !== null) {
      const dx = this.moveTargetX - this.x;
      const dy = this.moveTargetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 5) {
        this.vx = dx / dist;
        this.vy = dy / dist;
      } else {
        // Reached target
        this.moveTargetX = null;
        this.moveTargetY = null;
      }
    }

    if (this.vx !== 0 || this.vy !== 0) {
      const norm = utils.normalize(this.vx, this.vy);
      this.vx = norm.x * this.speed;
      this.vy = norm.y * this.speed;

      // Footsteps
      this.footstepTimer--;
      if (this.footstepTimer <= 0 && !this.isSprinting) {
        sound.play('footstep');
        this.footstepTimer = this.stance === 'prone' ? 30 : 20;
      }
    }

    // Collision check
    const nextX = this.x + this.vx;
    const nextY = this.y + this.vy;

    if (!level.isSolid(nextX, this.y)) this.x = nextX;
    if (!level.isSolid(this.x, nextY)) this.y = nextY;

    // Clamp to bounds (use MAP dimensions)
    this.x = utils.clamp(this.x, 30, CONFIG.MAP_WIDTH - 30);
    this.y = utils.clamp(this.y, 30, CONFIG.MAP_HEIGHT - 30);

    // Timers
    if (this.fireTimer > 0) this.fireTimer--;
    if (this.flashedTimer > 0) this.flashedTimer--;
    if (this.muzzleFlash > 0) this.muzzleFlash--;
    if (this.recoilOffset > 0) this.recoilOffset *= 0.8;

    // Reload
    if (this.isReloading) {
      this.reloadTimer--;
      if (this.reloadTimer <= 0) {
        this.isReloading = false;
        const needed = this.weapon.magSize - this.weapon.ammo;
        const available = Math.min(needed, this.weapon.reserveAmmo);
        this.weapon.ammo += available;
        this.weapon.reserveAmmo -= available;
      }
    }
  }

  fire() {
    if (this.isDead || this.isReloading || this.fireTimer > 0) return null;
    if (this.weapon.ammo <= 0) {
      sound.play('empty');
      return null;
    }

    this.weapon.ammo--;
    this.fireTimer = this.weapon.fireRate;
    this.muzzleFlash = CONFIG.MUZZLE_FLASH_DURATION;
    this.recoilOffset = this.weapon.recoil * 20;

    // Calculate spread
    const spread = this.weapon.spread * this.accuracy;
    const bullets = [];

    const pellets = this.weapon.pellets || 1;
    for (let i = 0; i < pellets; i++) {
      const angleOffset = (Math.random() - 0.5) * spread;
      const bulletAngle = this.angle + angleOffset;

      // Spawn bullet from leaned position
      const leanOffsetX = Math.cos(this.angle + Math.PI/2) * this.lean * CONFIG.LEAN_DISTANCE;
      const leanOffsetY = Math.sin(this.angle + Math.PI/2) * this.lean * CONFIG.LEAN_DISTANCE;
      const spawnX = this.x + leanOffsetX + Math.cos(this.angle) * 20;
      const spawnY = this.y + leanOffsetY + Math.sin(this.angle) * 20;

      bullets.push(new Bullet(spawnX, spawnY, bulletAngle, this.weapon, this));
    }

    sound.play(this.weapon.sound);

    return { bullets, casing: new ShellCasing(this.x, this.y, this.angle) };
  }

  reload() {
    if (this.isReloading || this.weapon.ammo === this.weapon.magSize) return;
    if (this.weapon.reserveAmmo <= 0) return;

    this.isReloading = true;
    // Apply adrenaline boost to reload speed
    const reloadBoost = (window.__game && window.__game.adrenalineActive) ? 0.5 : 1.0;
    this.reloadTimer = Math.floor(this.weapon.reloadTime * reloadBoost);
    sound.play('reload');
  }

  switchWeapon() {
    if (this.isReloading) return;
    this.currentWeapon = (this.currentWeapon + 1) % this.weapons.length;
  }

  throwGrenade(targetX, targetY) {
    if (this.grenades[this.selectedGrenade] <= 0) return null;
    this.grenades[this.selectedGrenade]--;
    return new Grenade(this.x, this.y, targetX, targetY, this.selectedGrenade, this);
  }

  cycleGrenade() {
    const types = ['frag', 'smoke'];
    const idx = types.indexOf(this.selectedGrenade);
    this.selectedGrenade = types[(idx + 1) % types.length];
  }

  takeDamage(amount, fromX, fromY) {
    if (this.isDead) return false;

    // Armor reduction for torso (simplified)
    const reduction = this.stance === 'prone' ? 0.7 : 0.85;
    const actualDamage = amount * reduction;
    this.hp -= actualDamage;

    // Record damage to difficulty director
    if (window.__game && window.__game.difficultyDirector) {
      window.__game.difficultyDirector.recordDamageTaken(actualDamage);
    }

    // Track damage time for AI suppression system
    if (this.isAI && this.aiState) {
      this.aiState.lastDamageTime = Date.now();
      // Increase suppression based on damage amount
      this.aiState.suppressionLevel = Math.min(100, this.aiState.suppressionLevel + amount * 2);
    }

    // Start bleeding
    if (amount > 20) {
      this.bleeding = Math.min(this.bleeding + amount * 0.3, 10);
    }

    sound.play('hit');

    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
      
      // Record teammate death for difficulty adjustment
      if (this.isAI && window.__game && window.__game.difficultyDirector) {
        window.__game.difficultyDirector.recordTeammateDeath();
      }
    }

    return true;
  }

  flash(intensity) {
    this.flashedTimer = Math.min(this.flashedTimer + intensity, CONFIG.FLASH_DURATION);
  }

  draw(ctx) {
    if (this.isDead) {
      this.drawDead(ctx);
      return;
    }

    const leanOffsetX = Math.cos(this.angle + Math.PI/2) * this.lean * CONFIG.LEAN_DISTANCE;
    const leanOffsetY = Math.sin(this.angle + Math.PI/2) * this.lean * CONFIG.LEAN_DISTANCE;
    const bodySize = this.stance === 'prone' ? this.radius * 1.3 : this.radius;

    // Draw shadow first
    ctx.save();
    ctx.translate(this.x + leanOffsetX + 4, this.y + leanOffsetY + 4);
    ctx.rotate(this.angle);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 0, bodySize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(this.x + leanOffsetX, this.y + leanOffsetY);
    ctx.rotate(this.angle);

    // Outer glow for local player
    if (this.isLocal) {
      ctx.shadowColor = '#4a9fff';
      ctx.shadowBlur = 8;
    }

    // Body gradient
    const baseColor = this.team === 'blue' ? '#4a7cc9' : '#c94a4a';
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, bodySize);
    gradient.addColorStop(0, this.team === 'blue' ? '#6a9cff' : '#ff6a6a');
    gradient.addColorStop(0.6, baseColor);
    gradient.addColorStop(1, this.team === 'blue' ? '#3a5a8a' : '#8a3a3a');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, bodySize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Body outline
    ctx.strokeStyle = this.team === 'blue' ? '#2a4a7a' : '#7a2a2a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Stance indicator ring
    if (this.stance === 'crouch') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, bodySize + 2, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.stance === 'prone') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, bodySize + 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Tactical vest/gear detail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(0, -2, bodySize * 0.5, Math.PI, 0);
    ctx.fill();

    // Weapon with gradient
    const weaponLen = this.isADS ? 25 : 20;
    const weaponGrad = ctx.createLinearGradient(5, -3, 5 + weaponLen, 3);
    weaponGrad.addColorStop(0, '#2a2a2a');
    weaponGrad.addColorStop(0.5, '#4a4a4a');
    weaponGrad.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = weaponGrad;
    ctx.fillRect(5, -3, weaponLen - this.recoilOffset, 6);

    // Weapon outline
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    ctx.strokeRect(5, -3, weaponLen - this.recoilOffset, 6);

    // Muzzle flash with glow
    if (this.muzzleFlash > 0) {
      ctx.shadowColor = '#ffaa00';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#ffee00';
      ctx.beginPath();
      ctx.arc(weaponLen + 5, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(weaponLen + 5, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Direction indicator with glow
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(bodySize - 3, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();

    // Name with shadow
    if (!this.isLocal) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(this.name, this.x + 1, this.y - 24);
      ctx.fillStyle = '#ddd';
      ctx.fillText(this.name, this.x, this.y - 25);
    }

    // Health bar
    this.drawHealthBar(ctx);
  }

  drawDead(ctx) {
    // Dead body shadow
    ctx.save();
    ctx.translate(this.x + 3, this.y + 3);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(this.x, this.y);

    // Dead body
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    gradient.addColorStop(0, '#5a5a5a');
    gradient.addColorStop(1, '#3a3a3a');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Blood pool
    ctx.fillStyle = 'rgba(120, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.ellipse(3, 5, this.radius * 0.8, this.radius * 0.5, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // X mark
    ctx.strokeStyle = '#cc0000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-5, -5);
    ctx.lineTo(5, 5);
    ctx.moveTo(5, -5);
    ctx.lineTo(-5, 5);
    ctx.stroke();
    ctx.restore();
  }

  drawHealthBar(ctx) {
    const barWidth = 32;
    const barHeight = 5;
    const x = this.x - barWidth/2;
    const y = this.y - this.radius - 14;

    // Background with border
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x - 1, y - 1, barWidth + 2, barHeight + 2);

    // Dark inner
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Health fill with gradient
    const hpPct = this.hp / this.maxHp;
    const healthGrad = ctx.createLinearGradient(x, y, x, y + barHeight);
    if (hpPct > 0.6) {
      healthGrad.addColorStop(0, '#6cff6c');
      healthGrad.addColorStop(1, '#2ca02c');
    } else if (hpPct > 0.3) {
      healthGrad.addColorStop(0, '#ffff6c');
      healthGrad.addColorStop(1, '#c9a000');
    } else {
      healthGrad.addColorStop(0, '#ff6c6c');
      healthGrad.addColorStop(1, '#a02c2c');
    }
    ctx.fillStyle = healthGrad;
    ctx.fillRect(x, y, barWidth * hpPct, barHeight);

    // Health bar shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(x, y, barWidth * hpPct, barHeight / 2);
  }
}

// =============================================================================
// ENEMY CLASS - Enhanced AI with alert system, cover, and flanking
// =============================================================================

class Enemy {
  constructor(x, y, type = 'standard') {
    this.id = utils.generateId();
    this.x = x;
    this.y = y;
    this.angle = Math.random() * Math.PI * 2;
    this.radius = CONFIG.ENEMY_RADIUS;
    this.type = type;

    this.hp = 80;
    this.maxHp = 80;
    this.isDead = false;

    this.weapon = { ...CONFIG.WEAPONS.smg, ammo: 30, reserveAmmo: 60, type: 'smg' };
    this.fireTimer = 0;

    this.state = 'patrol'; // 'patrol', 'alert', 'combat', 'cover', 'flanking'
    this.target = null;
    this.lastKnownTargetPos = null;
    this.alertTimer = 0;
    this.coverPos = null;
    this.coverTimer = 0;
    this.flankTarget = null;
    this.flankTimer = 0;

    this.patrolPoints = [];
    this.patrolIndex = 0;
    this.waitTimer = 0;

    this.hearingEvents = [];
    
    this.suppression = 0;
    this.lastDamageTime = 0;
    this.aggression = 0.3 + Math.random() * 0.5;
    this.role = Math.random() < 0.3 ? 'flanker' : 'assault';
    this.hasAlerted = false;
    this.reloadTimer = 0;
    this.isReloading = false;
  }

  update(players, level, smokeClouds) {
    if (this.isDead) return null;

    if (this.fireTimer > 0) this.fireTimer--;
    if (this.reloadTimer > 0) {
      this.reloadTimer--;
      if (this.reloadTimer <= 0 && this.isReloading) {
        this.finishReload();
      }
    }
    if (this.suppression > 0) this.suppression -= 0.02;
    if (this.coverTimer > 0) this.coverTimer--;
    if (this.flankTimer > 0) this.flankTimer--;

    if (this.weapon.ammo <= 0 && !this.isReloading && this.weapon.reserveAmmo > 0) {
      this.reload();
    }

    switch (this.state) {
      case 'patrol':
        this.updatePatrol(players, level, smokeClouds);
        break;
      case 'alert':
        this.updateAlert(players, level, smokeClouds);
        break;
      case 'combat':
        return this.updateCombat(players, level, smokeClouds);
      case 'cover':
        return this.updateCover(players, level, smokeClouds);
      case 'flanking':
        return this.updateFlanking(players, level, smokeClouds);
    }

    return null;
  }

  reload() {
    if (this.reloadTimer > 0) return;
    this.reloadTimer = this.weapon.reloadTime;
    this.isReloading = true;
    sound.play('reload', this.x, this.y);
  }
  
  finishReload() {
    const needed = this.weapon.magSize - this.weapon.ammo;
    const available = Math.min(needed, this.weapon.reserveAmmo);
    this.weapon.ammo += available;
    this.weapon.reserveAmmo -= available;
    this.isReloading = false;
  }

  alertNearbyEnemies(targetPos) {
    if (this.hasAlerted || !window.__game) return;
    this.hasAlerted = true;
    
    const enemies = window.__game.enemies;
    for (const enemy of enemies) {
      if (enemy === this || enemy.isDead) continue;
      
      const dist = utils.distance(this.x, this.y, enemy.x, enemy.y);
      if (dist < CONFIG.ENEMY_ALERT_RANGE) {
        if (enemy.state === 'patrol') {
          enemy.state = 'alert';
          enemy.lastKnownTargetPos = { x: targetPos.x, y: targetPos.y };
          enemy.alertTimer = 300;
          
          if (window.__game && Math.random() < 0.3) {
            const responses = ['Copy!', 'On it!', 'Moving!', 'Got it!'];
            const response = responses[Math.floor(Math.random() * responses.length)];
            window.__game.particles.push({
              type: 'cheer',
              x: enemy.x,
              y: enemy.y - 20,
              text: response,
              life: 35,
              maxLife: 35,
              color: '#ffcc00',
              vy: -0.5
            });
          }
        }
      }
    }
  }

  findCoverPosition(level, threatPos) {
    const searchRange = CONFIG.ENEMY_COVER_SEARCH_RANGE;
    const positions = [];
    
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      for (let dist = 40; dist < searchRange; dist += 30) {
        const testX = this.x + Math.cos(angle) * dist;
        const testY = this.y + Math.sin(angle) * dist;
        
        if (level.isSolid(testX, testY)) continue;
        
        const checkX = testX + Math.cos(utils.angle(testX, testY, threatPos.x, threatPos.y)) * 20;
        const checkY = testY + Math.sin(utils.angle(testX, testY, threatPos.x, threatPos.y)) * 20;
        
        if (level.isSolid(checkX, checkY)) {
          const distToThreat = utils.distance(testX, testY, threatPos.x, threatPos.y);
          positions.push({ x: testX, y: testY, score: distToThreat > 80 ? 1 : 0.5 });
        }
      }
    }
    
    if (positions.length === 0) return null;
    positions.sort((a, b) => b.score - a.score);
    return positions[0];
  }

  findFlankPosition(level, targetPos) {
    const angleToTarget = utils.angle(this.x, this.y, targetPos.x, targetPos.y);
    const flankAngles = [angleToTarget + Math.PI * 0.6, angleToTarget - Math.PI * 0.6];
    
    for (const flankAngle of flankAngles) {
      const flankX = targetPos.x + Math.cos(flankAngle) * CONFIG.ENEMY_FLANK_DISTANCE;
      const flankY = targetPos.y + Math.sin(flankAngle) * CONFIG.ENEMY_FLANK_DISTANCE;
      
      if (!level.isSolid(flankX, flankY)) {
        return { x: flankX, y: flankY };
      }
    }
    return null;
  }

  canSeeTarget(target, level, smokeClouds) {
    if (target.isDead) return false;

    const dist = utils.distance(this.x, this.y, target.x, target.y);
    if (dist > CONFIG.ENEMY_VIEW_RANGE) return false;

    const angleToTarget = utils.angle(this.x, this.y, target.x, target.y);
    let angleDiff = angleToTarget - this.angle;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    if (Math.abs(angleDiff) > CONFIG.ENEMY_VIEW_ANGLE / 2) return false;

    return level.checkLineOfSight(this.x, this.y, target.x, target.y, smokeClouds);
  }

  hearSound(x, y, loudness) {
    const dist = utils.distance(this.x, this.y, x, y);
    if (dist < CONFIG.ENEMY_HEARING_RANGE * loudness) {
      this.hearingEvents.push({ x, y, time: 180 });
      if (this.state === 'patrol') {
        this.state = 'alert';
        this.lastKnownTargetPos = { x, y };
        this.alertTimer = 300;
      }
    }
  }

  updatePatrol(players, level, smokeClouds) {
    for (const player of players) {
      if (this.canSeeTarget(player, level, smokeClouds)) {
        this.target = player;
        this.state = 'combat';
        this.lastKnownTargetPos = { x: player.x, y: player.y };
        
        this.alertNearbyEnemies({ x: player.x, y: player.y });
        
        if (window.__game && Math.random() < 0.5) {
          const taunts = ['Contact!', 'There!', 'Enemy!', 'Spotted!', 'Target!', 'Hostile!'];
          const taunt = taunts[Math.floor(Math.random() * taunts.length)];
          window.__game.particles.push({
            type: 'cheer',
            x: this.x,
            y: this.y - 20,
            text: taunt,
            life: 45,
            maxLife: 45,
            color: '#ffaa00',
            vy: -0.5
          });
        }
        
        return;
      }
    }

    if (this.waitTimer > 0) {
      this.waitTimer--;
      return;
    }

    if (this.patrolPoints.length === 0) {
      if (Math.random() < 0.02) {
        this.angle += (Math.random() - 0.5) * 0.5;
      }

      const nextX = this.x + Math.cos(this.angle) * CONFIG.ENEMY_SPEED * 0.5;
      const nextY = this.y + Math.sin(this.angle) * CONFIG.ENEMY_SPEED * 0.5;

      if (!level.isSolid(nextX, nextY)) {
        this.x = nextX;
        this.y = nextY;
      } else {
        this.angle += Math.PI / 2;
      }
    }
  }

  updateAlert(players, level, smokeClouds) {
    for (const player of players) {
      if (this.canSeeTarget(player, level, smokeClouds)) {
        this.target = player;
        this.state = 'combat';
        this.lastKnownTargetPos = { x: player.x, y: player.y };
        this.alertNearbyEnemies({ x: player.x, y: player.y });
        return;
      }
    }

    if (this.lastKnownTargetPos) {
      const dist = utils.distance(this.x, this.y, this.lastKnownTargetPos.x, this.lastKnownTargetPos.y);
      if (dist < 30) {
        this.lastKnownTargetPos = null;
        this.alertTimer = 120;
      } else {
        this.angle = utils.angle(this.x, this.y, this.lastKnownTargetPos.x, this.lastKnownTargetPos.y);
        const nextX = this.x + Math.cos(this.angle) * CONFIG.ENEMY_SPEED;
        const nextY = this.y + Math.sin(this.angle) * CONFIG.ENEMY_SPEED;

        if (!level.isSolid(nextX, nextY)) {
          this.x = nextX;
          this.y = nextY;
        }
      }
    }

    this.alertTimer--;
    if (this.alertTimer <= 0) {
      this.state = 'patrol';
      this.hasAlerted = false;
    }
  }

  updateCombat(players, level, smokeClouds) {
    if (!this.target || this.target.isDead) {
      this.target = null;
      this.state = 'alert';
      this.alertTimer = 180;
      return null;
    }

    const canSee = this.canSeeTarget(this.target, level, smokeClouds);
    const dist = utils.distance(this.x, this.y, this.target.x, this.target.y);

    if (this.suppression >= CONFIG.ENEMY_SUPPRESSION_THRESHOLD && this.coverTimer <= 0) {
      const cover = this.findCoverPosition(level, this.target);
      if (cover) {
        this.coverPos = cover;
        this.state = 'cover';
        this.coverTimer = 180;
        return null;
      }
    }

    if (this.role === 'flanker' && canSee && dist > 100 && this.flankTimer <= 0 && Math.random() < 0.02) {
      const flankPos = this.findFlankPosition(level, this.target);
      if (flankPos) {
        this.flankTarget = flankPos;
        this.state = 'flanking';
        this.flankTimer = 300;
        return null;
      }
    }

    if (canSee) {
      this.lastKnownTargetPos = { x: this.target.x, y: this.target.y };
      this.angle = utils.angle(this.x, this.y, this.target.x, this.target.y);

      if (dist < this.weapon.range && this.fireTimer <= 0 && this.weapon.ammo > 0 && !this.isReloading) {
        return this.fire();
      }

      const optimalDist = 100 + (1 - this.aggression) * 80;
      if (dist > optimalDist + 30) {
        const moveSpeed = CONFIG.ENEMY_SPEED * (1 - this.suppression * 0.3);
        const nextX = this.x + Math.cos(this.angle) * moveSpeed;
        const nextY = this.y + Math.sin(this.angle) * moveSpeed;
        if (!level.isSolid(nextX, nextY)) {
          this.x = nextX;
          this.y = nextY;
        }
      } else if (dist < optimalDist - 30 && this.hp < this.maxHp * 0.5) {
        const retreatAngle = this.angle + Math.PI;
        const nextX = this.x + Math.cos(retreatAngle) * CONFIG.ENEMY_SPEED * 0.7;
        const nextY = this.y + Math.sin(retreatAngle) * CONFIG.ENEMY_SPEED * 0.7;
        if (!level.isSolid(nextX, nextY)) {
          this.x = nextX;
          this.y = nextY;
        }
      }
    } else {
      this.state = 'alert';
      this.alertTimer = 180;
    }

    return null;
  }

  updateCover(players, level, smokeClouds) {
    if (!this.coverPos) {
      this.state = 'combat';
      return null;
    }

    const distToCover = utils.distance(this.x, this.y, this.coverPos.x, this.coverPos.y);
    
    if (distToCover > 15) {
      this.angle = utils.angle(this.x, this.y, this.coverPos.x, this.coverPos.y);
      const nextX = this.x + Math.cos(this.angle) * CONFIG.ENEMY_SPEED * 1.3;
      const nextY = this.y + Math.sin(this.angle) * CONFIG.ENEMY_SPEED * 1.3;
      if (!level.isSolid(nextX, nextY)) {
        this.x = nextX;
        this.y = nextY;
      }
    } else {
      this.suppression = Math.max(0, this.suppression - 0.1);
      
      if (this.target && !this.target.isDead) {
        const canSee = this.canSeeTarget(this.target, level, smokeClouds);
        if (canSee && this.fireTimer <= 0 && this.weapon.ammo > 0 && !this.isReloading) {
          this.angle = utils.angle(this.x, this.y, this.target.x, this.target.y);
          return this.fire();
        }
      }
      
      if (this.suppression < 1 && this.coverTimer <= 0) {
        this.coverPos = null;
        this.state = 'combat';
      }
    }

    return null;
  }

  updateFlanking(players, level, smokeClouds) {
    if (!this.flankTarget) {
      this.state = 'combat';
      return null;
    }

    const distToFlank = utils.distance(this.x, this.y, this.flankTarget.x, this.flankTarget.y);
    
    if (distToFlank > 20) {
      this.angle = utils.angle(this.x, this.y, this.flankTarget.x, this.flankTarget.y);
      const nextX = this.x + Math.cos(this.angle) * CONFIG.ENEMY_SPEED * 1.2;
      const nextY = this.y + Math.sin(this.angle) * CONFIG.ENEMY_SPEED * 1.2;
      if (!level.isSolid(nextX, nextY)) {
        this.x = nextX;
        this.y = nextY;
      } else {
        this.flankTarget = null;
        this.state = 'combat';
      }
    } else {
      this.flankTarget = null;
      this.state = 'combat';
      
      if (window.__game && Math.random() < 0.5) {
        window.__game.particles.push({
          type: 'cheer',
          x: this.x,
          y: this.y - 20,
          text: 'Flanking!',
          life: 40,
          maxLife: 40,
          color: '#ff6600',
          vy: -0.5
        });
      }
    }

    if (this.target && !this.target.isDead) {
      const canSee = this.canSeeTarget(this.target, level, smokeClouds);
      if (canSee && this.fireTimer <= 0 && this.weapon.ammo > 0 && !this.isReloading) {
        const aimAngle = utils.angle(this.x, this.y, this.target.x, this.target.y);
        this.angle = aimAngle;
        return this.fire();
      }
    }

    return null;
  }

  fire() {
    if (this.weapon.ammo <= 0) return null;

    this.weapon.ammo--;
    this.fireTimer = this.weapon.fireRate + Math.random() * 10;

    const accuracyMod = 1 + this.suppression * 0.5;
    const difficultyAccuracy = window.__game ? 
      window.__game.difficultyDirector.getEnemyAccuracy(1.0) : 1.0;
    const spread = this.weapon.spread * 1.5 * accuracyMod / difficultyAccuracy;
    const angleOffset = (Math.random() - 0.5) * spread;
    const bulletAngle = this.angle + angleOffset;

    const spawnX = this.x + Math.cos(this.angle) * 15;
    const spawnY = this.y + Math.sin(this.angle) * 15;

    sound.play(this.weapon.sound, this.x, this.y);

    return {
      bullet: new Bullet(spawnX, spawnY, bulletAngle, this.weapon, this),
      casing: new ShellCasing(this.x, this.y, this.angle)
    };
  }

  takeDamage(amount, fromX, fromY) {
    this.hp -= amount;
    this.suppression = Math.min(this.suppression + 0.5, CONFIG.ENEMY_SUPPRESSION_THRESHOLD + 1);
    this.lastDamageTime = Date.now();
    sound.play('hit');

    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
      
      if (window.__game) {
        const points = window.__game.addScore(100);
        window.__game.onComboEvent();
        window.__game.difficultyDirector.recordKill();
        
        const deathQuips = ['Argh!', 'Oof!', 'Down!', 'Hit!', '*thud*', 'Noo!'];
        const quip = deathQuips[Math.floor(Math.random() * deathQuips.length)];
        window.__game.particles.push({
          type: 'cheer',
          x: this.x,
          y: this.y - 20,
          text: quip,
          life: 60,
          maxLife: 60,
          color: '#ff6b6b',
          vy: -1
        });
        
        if (Math.random() < 0.3) {
          const dropTypes = ['ammo', 'medkit', 'adrenaline', 'charm'];
          const weights = [0.4, 0.3, 0.2, 0.1];
          
          let rand = Math.random();
          let dropType = 'ammo';
          let cumulative = 0;
          for (let i = 0; i < dropTypes.length; i++) {
            cumulative += weights[i];
            if (rand < cumulative) {
              dropType = dropTypes[i];
              break;
            }
          }
          
          let dropAmount = 30;
          if (dropType === 'medkit') dropAmount = 40;
          else if (dropType === 'adrenaline') dropAmount = 1;
          else if (dropType === 'charm') dropAmount = 1;
          
          const drop = {
            type: dropType,
            x: this.x + (Math.random() - 0.5) * 20,
            y: this.y + (Math.random() - 0.5) * 20,
            amount: dropAmount,
            collected: false,
            lifetime: 0,
            bobOffset: Math.random() * Math.PI * 2,
            radius: 12,
            update: function() { this.lifetime++; },
            draw: function(ctx) {
              if (this.collected) return;
              const bob = Math.sin(this.lifetime * 0.05 + this.bobOffset) * 3;
              const y = this.y + bob;
              
              ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
              ctx.beginPath();
              ctx.arc(this.x, y + 2, this.radius + 2, 0, Math.PI * 2);
              ctx.fill();
              
              let color = '#ffffff';
              if (this.type === 'ammo') color = '#f5a623';
              else if (this.type === 'medkit') color = '#2ecc71';
              else if (this.type === 'adrenaline') color = '#e74c3c';
              else if (this.type === 'charm') color = '#9b59b6';
              
              ctx.fillStyle = color;
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(this.x, y, this.radius, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
              
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 12px Arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              let text = '';
              if (this.type === 'ammo') text = String(this.amount);
              else if (this.type === 'medkit') text = '❤';
              else if (this.type === 'adrenaline') text = '⚡';
              else if (this.type === 'charm') text = '✨';
              
              ctx.fillText(text, this.x, y);
            }
          };
          
          window.__game.itemDrops.push(drop);
        }
      }
      
      return true;
    }

    if (this.state === 'patrol') {
      this.state = 'alert';
      this.lastKnownTargetPos = { x: fromX, y: fromY };
      this.alertTimer = 300;
      this.alertNearbyEnemies({ x: fromX, y: fromY });
    }

    return false;
  }

  draw(ctx) {
    if (this.isDead) {
      // Dead body shadow
      ctx.save();
      ctx.translate(this.x + 3, this.y + 3);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Dead body with gradient
      ctx.save();
      ctx.translate(this.x, this.y);
      const deadGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
      deadGrad.addColorStop(0, '#5a5a5a');
      deadGrad.addColorStop(1, '#3a3a3a');
      ctx.fillStyle = deadGrad;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();

      // Blood pool
      ctx.fillStyle = 'rgba(120, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(3, 5, this.radius * 0.8, this.radius * 0.5, 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      return;
    }

    // Draw shadow first
    ctx.save();
    ctx.translate(this.x + 4, this.y + 4);
    ctx.rotate(this.angle);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Determine colors based on state
    let baseColor, lightColor, darkColor;
    if (this.state === 'combat') {
      baseColor = '#aa3333'; lightColor = '#dd5555'; darkColor = '#771818';
    } else if (this.state === 'alert') {
      baseColor = '#aa6633'; lightColor = '#cc8855'; darkColor = '#774422';
    } else if (this.state === 'cover') {
      baseColor = '#336699'; lightColor = '#5588bb'; darkColor = '#224466';
    } else if (this.state === 'flanking') {
      baseColor = '#993399'; lightColor = '#bb55bb'; darkColor = '#662266';
    } else {
      baseColor = '#666666'; lightColor = '#888888'; darkColor = '#444444';
    }

    // Body gradient
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    gradient.addColorStop(0, lightColor);
    gradient.addColorStop(0.6, baseColor);
    gradient.addColorStop(1, darkColor);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Body outline
    ctx.strokeStyle = darkColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Flanker role highlight
    if (this.role === 'flanker') {
      ctx.strokeStyle = '#ffcc00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Tactical gear detail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(0, -2, this.radius * 0.5, Math.PI, 0);
    ctx.fill();

    // Weapon with gradient
    const weaponGrad = ctx.createLinearGradient(5, -2, 20, 2);
    weaponGrad.addColorStop(0, '#2a2a2a');
    weaponGrad.addColorStop(0.5, '#4a4a4a');
    weaponGrad.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = weaponGrad;
    ctx.fillRect(5, -2, 15, 4);

    // Weapon outline
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    ctx.strokeRect(5, -2, 15, 4);

    // Muzzle flash with glow (if firing)
    if (this.fireTimer > 0 && this.fireTimer < 3) {
      ctx.shadowColor = '#ff6600';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ffaa00';
      ctx.beginPath();
      ctx.arc(22, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(22, 0, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Direction indicator
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.radius - 3, 0, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Enhanced health bar
    const barWidth = 24;
    const barHeight = 4;
    const x = this.x - barWidth/2;
    const y = this.y - this.radius - 10;

    // Health bar background with shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x + 1, y + 1, barWidth, barHeight);
    ctx.fillStyle = '#222';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Health bar fill with gradient
    const healthPct = this.hp / this.maxHp;
    if (healthPct > 0) {
      const healthGrad = ctx.createLinearGradient(x, y, x, y + barHeight);
      healthGrad.addColorStop(0, '#ff6666');
      healthGrad.addColorStop(0.5, '#ff3333');
      healthGrad.addColorStop(1, '#cc0000');
      ctx.fillStyle = healthGrad;
      ctx.fillRect(x + 1, y + 1, (barWidth - 2) * healthPct, barHeight - 2);

      // Shine effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x + 1, y + 1, (barWidth - 2) * healthPct, 1);
    }

    // Health bar outline
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barWidth, barHeight);
    
    // Suppression indicator
    if (this.suppression > 0) {
      const suppGrad = ctx.createLinearGradient(x, y - 5, x + barWidth, y - 5);
      suppGrad.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
      suppGrad.addColorStop(1, 'rgba(255, 200, 0, 0.5)');
      ctx.fillStyle = suppGrad;
      ctx.fillRect(x, y - 5, barWidth * (this.suppression / CONFIG.ENEMY_SUPPRESSION_THRESHOLD), 2);
    }
  }
}

// =============================================================================
// SPECIALIZED ENEMY TYPES
// =============================================================================

class ShieldBearer extends Enemy {
  constructor(x, y) {
    super(x, y, 'shield');
    this.hp = 120;
    this.maxHp = 120;
    this.weapon = { ...CONFIG.WEAPONS.pistol, ammo: 15, reserveAmmo: 45, type: 'pistol' };
    this.shieldAngle = 0;
    this.shieldArc = Math.PI * 0.8;
    this.role = 'assault';
    this.aggression = 0.7;
  }

  takeDamage(amount, fromX, fromY) {
    const angleFromShot = utils.angle(this.x, this.y, fromX, fromY);
    let angleDiff = angleFromShot - this.angle;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    
    if (Math.abs(angleDiff) < this.shieldArc / 2) {
      amount *= 0.2;
      sound.play('ricochet', this.x, this.y);
      
      if (window.__game && Math.random() < 0.3) {
        window.__game.particles.push({
          type: 'cheer',
          x: this.x,
          y: this.y - 25,
          text: 'Blocked!',
          life: 30,
          maxLife: 30,
          color: '#4488ff',
          vy: -0.5
        });
      }
    }
    
    return super.takeDamage(amount, fromX, fromY);
  }

  draw(ctx) {
    if (this.isDead) {
      super.draw(ctx);
      return;
    }

    // Shadow
    ctx.save();
    ctx.translate(this.x + 4, this.y + 4);
    ctx.rotate(this.angle);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Body gradient
    const baseColor = this.state === 'combat' ? '#3366aa' : '#4477bb';
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    gradient.addColorStop(0, this.state === 'combat' ? '#5588cc' : '#6699dd');
    gradient.addColorStop(0.6, baseColor);
    gradient.addColorStop(1, this.state === 'combat' ? '#224488' : '#335599');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Body outline
    ctx.strokeStyle = '#224488';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Shield with gradient and glow
    ctx.shadowColor = '#5599ff';
    ctx.shadowBlur = 8;
    const shieldGrad = ctx.createRadialGradient(this.radius, 0, 0, this.radius, 0, this.radius + 6);
    shieldGrad.addColorStop(0, '#7799dd');
    shieldGrad.addColorStop(0.5, '#5588cc');
    shieldGrad.addColorStop(1, '#4477bb');
    ctx.fillStyle = shieldGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, this.radius + 6, -this.shieldArc/2, this.shieldArc/2);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Shield edge highlight
    ctx.strokeStyle = '#99bbff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 6, -this.shieldArc/2, this.shieldArc/2);
    ctx.stroke();

    // Weapon with gradient
    const weaponGrad = ctx.createLinearGradient(5, -2, 17, 2);
    weaponGrad.addColorStop(0, '#2a2a2a');
    weaponGrad.addColorStop(0.5, '#4a4a4a');
    weaponGrad.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = weaponGrad;
    ctx.fillRect(5, -2, 12, 4);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    ctx.strokeRect(5, -2, 12, 4);

    ctx.restore();

    // Enhanced health bar
    const barWidth = 24;
    const barHeight = 4;
    const x = this.x - barWidth/2;
    const y = this.y - this.radius - 14;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x + 1, y + 1, barWidth, barHeight);
    ctx.fillStyle = '#222';
    ctx.fillRect(x, y, barWidth, barHeight);

    const healthPct = this.hp / this.maxHp;
    if (healthPct > 0) {
      const healthGrad = ctx.createLinearGradient(x, y, x, y + barHeight);
      healthGrad.addColorStop(0, '#66aaff');
      healthGrad.addColorStop(0.5, '#4488ff');
      healthGrad.addColorStop(1, '#3366cc');
      ctx.fillStyle = healthGrad;
      ctx.fillRect(x + 1, y + 1, (barWidth - 2) * healthPct, barHeight - 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x + 1, y + 1, (barWidth - 2) * healthPct, 1);
    }
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barWidth, barHeight);
  }
}

class Demolitionist extends Enemy {
  constructor(x, y) {
    super(x, y, 'demo');
    this.hp = 70;
    this.maxHp = 70;
    this.weapon = { ...CONFIG.WEAPONS.smg, ammo: 30, reserveAmmo: 60, type: 'smg' };
    this.grenadeCount = 2;
    this.grenadeTimer = 0;
    this.grenadeCooldown = 300;
    this.role = 'assault';
    this.aggression = 0.4;
  }

  update(players, level, smokeClouds) {
    if (this.isDead) return null;
    
    if (this.grenadeTimer > 0) this.grenadeTimer--;
    
    if (this.state === 'combat' && this.target && !this.target.isDead && 
        this.grenadeCount > 0 && this.grenadeTimer <= 0 && this.fireTimer <= 0) {
      const dist = utils.distance(this.x, this.y, this.target.x, this.target.y);
      if (dist > 80 && dist < 250 && Math.random() < 0.015) {
        return this.throwGrenade();
      }
    }
    
    return super.update(players, level, smokeClouds);
  }

  throwGrenade() {
    if (this.grenadeCount <= 0 || !this.target) return null;
    
    this.grenadeCount--;
    this.grenadeTimer = this.grenadeCooldown;
    
    const type = Math.random() < 0.6 ? 'frag' : 'flash';
    
    if (window.__game) {
      window.__game.particles.push({
        type: 'cheer',
        x: this.x,
        y: this.y - 20,
        text: type === 'frag' ? 'Frag out!' : 'Flash!',
        life: 40,
        maxLife: 40,
        color: type === 'frag' ? '#ff4400' : '#ffff00',
        vy: -0.5
      });
    }
    
    return {
      grenade: {
        type: type,
        x: this.x,
        y: this.y,
        targetX: this.target.x + (Math.random() - 0.5) * 40,
        targetY: this.target.y + (Math.random() - 0.5) * 40,
        throwerId: this.id
      }
    };
  }

  draw(ctx) {
    if (this.isDead) {
      super.draw(ctx);
      return;
    }

    // Shadow
    ctx.save();
    ctx.translate(this.x + 4, this.y + 4);
    ctx.rotate(this.angle);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Body gradient
    const baseColor = this.state === 'combat' ? '#cc4400' : '#aa5522';
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    gradient.addColorStop(0, this.state === 'combat' ? '#ff6622' : '#cc7744');
    gradient.addColorStop(0.6, baseColor);
    gradient.addColorStop(1, this.state === 'combat' ? '#882200' : '#773311');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Body outline
    ctx.strokeStyle = '#662200';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tactical gear detail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(0, -2, this.radius * 0.5, Math.PI, 0);
    ctx.fill();

    // Weapon with gradient
    const weaponGrad = ctx.createLinearGradient(5, -2, 20, 2);
    weaponGrad.addColorStop(0, '#2a2a2a');
    weaponGrad.addColorStop(0.5, '#4a4a4a');
    weaponGrad.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = weaponGrad;
    ctx.fillRect(5, -2, 15, 4);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    ctx.strokeRect(5, -2, 15, 4);

    ctx.restore();

    // Grenade indicators with glow
    for (let i = 0; i < this.grenadeCount; i++) {
      ctx.shadowColor = '#88aa44';
      ctx.shadowBlur = 4;
      const grenGrad = ctx.createRadialGradient(this.x - 8 + i * 10, this.y + this.radius + 6, 0, this.x - 8 + i * 10, this.y + this.radius + 6, 5);
      grenGrad.addColorStop(0, '#66aa44');
      grenGrad.addColorStop(1, '#446622');
      ctx.fillStyle = grenGrad;
      ctx.beginPath();
      ctx.arc(this.x - 8 + i * 10, this.y + this.radius + 6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Enhanced health bar
    const barWidth = 24;
    const barHeight = 4;
    const x = this.x - barWidth/2;
    const y = this.y - this.radius - 10;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x + 1, y + 1, barWidth, barHeight);
    ctx.fillStyle = '#222';
    ctx.fillRect(x, y, barWidth, barHeight);

    const healthPct = this.hp / this.maxHp;
    if (healthPct > 0) {
      const healthGrad = ctx.createLinearGradient(x, y, x, y + barHeight);
      healthGrad.addColorStop(0, '#ff8833');
      healthGrad.addColorStop(0.5, '#ff6600');
      healthGrad.addColorStop(1, '#cc4400');
      ctx.fillStyle = healthGrad;
      ctx.fillRect(x + 1, y + 1, (barWidth - 2) * healthPct, barHeight - 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x + 1, y + 1, (barWidth - 2) * healthPct, 1);
    }
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barWidth, barHeight);
  }
}

class Spotter extends Enemy {
  constructor(x, y) {
    super(x, y, 'spotter');
    this.hp = 60;
    this.maxHp = 60;
    this.weapon = { ...CONFIG.WEAPONS.pistol, ammo: 15, reserveAmmo: 30, type: 'pistol' };
    this.spotTimer = 0;
    this.spotDuration = 180;
    this.markedTarget = null;
    this.role = 'flanker';
    this.aggression = 0.2;
  }

  update(players, level, smokeClouds) {
    if (this.isDead) return null;
    
    if (this.spotTimer > 0) this.spotTimer--;
    
    const result = super.update(players, level, smokeClouds);
    
    if (this.state === 'combat' && this.target && !this.target.isDead && 
        this.spotTimer <= 0 && Math.random() < 0.01) {
      this.markTarget();
    }
    
    return result;
  }

  markTarget() {
    if (!this.target || !window.__game) return;
    
    this.markedTarget = this.target;
    this.spotTimer = this.spotDuration;
    
    window.__game.particles.push({
      type: 'cheer',
      x: this.x,
      y: this.y - 20,
      text: 'Marked!',
      life: 50,
      maxLife: 50,
      color: '#ff00ff',
      vy: -0.5
    });
    
    for (const enemy of window.__game.enemies) {
      if (enemy === this || enemy.isDead) continue;
      if (enemy.state === 'patrol' || enemy.state === 'alert') {
        enemy.target = this.target;
        enemy.state = 'combat';
        enemy.lastKnownTargetPos = { x: this.target.x, y: this.target.y };
      }
    }
  }

  draw(ctx) {
    if (this.isDead) {
      super.draw(ctx);
      return;
    }

    // Shadow
    ctx.save();
    ctx.translate(this.x + 4, this.y + 4);
    ctx.rotate(this.angle);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Body gradient
    const baseColor = this.state === 'combat' ? '#9900cc' : '#7722aa';
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    gradient.addColorStop(0, this.state === 'combat' ? '#bb44ee' : '#9944cc');
    gradient.addColorStop(0.6, baseColor);
    gradient.addColorStop(1, this.state === 'combat' ? '#660088' : '#551177');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Body outline
    ctx.strokeStyle = '#551177';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Spotter aura ring with glow
    ctx.shadowColor = '#cc44ff';
    ctx.shadowBlur = 6;
    ctx.strokeStyle = '#cc44ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Tactical gear detail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(0, -2, this.radius * 0.5, Math.PI, 0);
    ctx.fill();

    // Weapon with gradient
    const weaponGrad = ctx.createLinearGradient(5, -2, 17, 2);
    weaponGrad.addColorStop(0, '#2a2a2a');
    weaponGrad.addColorStop(0.5, '#4a4a4a');
    weaponGrad.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = weaponGrad;
    ctx.fillRect(5, -2, 12, 4);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    ctx.strokeRect(5, -2, 12, 4);

    ctx.restore();

    // Marked target line with glow
    if (this.spotTimer > 0 && this.markedTarget && !this.markedTarget.isDead) {
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = `rgba(255, 0, 255, ${0.4 + Math.sin(Date.now() * 0.01) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.markedTarget.x, this.markedTarget.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
      
      ctx.strokeStyle = '#ff00ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.markedTarget.x, this.markedTarget.y, 20, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Enhanced health bar
    const barWidth = 24;
    const barHeight = 4;
    const x = this.x - barWidth/2;
    const y = this.y - this.radius - 10;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x + 1, y + 1, barWidth, barHeight);
    ctx.fillStyle = '#222';
    ctx.fillRect(x, y, barWidth, barHeight);

    const healthPct = this.hp / this.maxHp;
    if (healthPct > 0) {
      const healthGrad = ctx.createLinearGradient(x, y, x, y + barHeight);
      healthGrad.addColorStop(0, '#dd66ff');
      healthGrad.addColorStop(0.5, '#cc44ff');
      healthGrad.addColorStop(1, '#9933cc');
      ctx.fillStyle = healthGrad;
      ctx.fillRect(x + 1, y + 1, (barWidth - 2) * healthPct, barHeight - 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x + 1, y + 1, (barWidth - 2) * healthPct, 1);
    }
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barWidth, barHeight);
  }
}

// =============================================================================
// BOSS CLASS
// =============================================================================

class Boss extends Enemy {
  constructor(x, y) {
    super(x, y);

    // Enhanced stats
    this.hp = 500;
    this.maxHp = 500;
    this.radius = CONFIG.ENEMY_RADIUS * 1.5; // 50% larger

    // Better weapon - rifle instead of smg
    this.weapon = { ...CONFIG.WEAPONS.rifle, ammo: 30, reserveAmmo: 120, type: 'rifle' };

    // Boss-specific properties
    this.isBoss = true;
    this.armor = 0.5; // 50% damage reduction
    this.moveSpeed = CONFIG.ENEMY_SPEED * 0.8; // Slightly slower
    this.aggroRange = CONFIG.ENEMY_VIEW_RANGE * 1.5; // Larger aggro range

    // Special abilities
    this.grenadeCount = 3;
    this.grenadeTimer = 0;
    this.grenadeCooldown = 600; // 10 seconds at 60fps

    this.healTimer = 0;
    this.healCooldown = 900; // 15 seconds
    this.canHeal = true;
  }

  takeDamage(amount, fromX, fromY) {
    // Apply armor reduction
    const reducedDamage = amount * this.armor;
    this.hp -= reducedDamage;
    sound.play('hit');

    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
      return true;
    }

    // Self-heal ability when below 30% HP
    if (this.hp < this.maxHp * 0.3 && this.canHeal && this.healTimer <= 0) {
      this.hp = Math.min(this.hp + 150, this.maxHp);
      this.healTimer = this.healCooldown;
      this.canHeal = false; // Only heal once
      sound.play('reload'); // Use reload sound as heal sound
    }

    // React to being shot
    if (this.state === 'patrol') {
      this.state = 'alert';
      this.lastKnownTargetPos = { x: fromX, y: fromY };
      this.alertTimer = 300;
    }

    return false;
  }

  update(players, level, smokeClouds) {
    if (this.isDead) return null;

    // Update timers
    if (this.fireTimer > 0) this.fireTimer--;
    if (this.grenadeTimer > 0) this.grenadeTimer--;
    if (this.healTimer > 0) this.healTimer--;

    // Try to throw grenade at players
    const grenadeResult = this.tryThrowGrenade(players, level);
    if (grenadeResult) {
      return { ...super.update(players, level, smokeClouds), grenade: grenadeResult };
    }

    return super.update(players, level, smokeClouds);
  }

  tryThrowGrenade(players, level) {
    if (this.grenadeCount <= 0 || this.grenadeTimer > 0) return null;

    // Find nearest visible player
    let nearestPlayer = null;
    let nearestDist = Infinity;

    for (const player of players) {
      if (player.isDead) continue;
      const dist = utils.distance(this.x, this.y, player.x, player.y);
      if (dist < 400 && dist > 150) { // Throw range: 150-400 pixels
        if (level.checkLineOfSight(this.x, this.y, player.x, player.y, [])) {
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestPlayer = player;
          }
        }
      }
    }

    if (nearestPlayer) {
      this.grenadeCount--;
      this.grenadeTimer = this.grenadeCooldown;
      return new Grenade(this.x, this.y, nearestPlayer.x, nearestPlayer.y, 'frag', this);
    }

    return null;
  }

  draw(ctx) {
    if (this.isDead) {
      this.drawDead(ctx);
      return;
    }

    // Draw shadow first
    ctx.save();
    ctx.translate(this.x + 5, this.y + 5);
    ctx.rotate(this.angle);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw boss with special appearance
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Draw glow effect for boss
    ctx.shadowColor = '#ff3333';
    ctx.shadowBlur = 15;
    const glowGradient = ctx.createRadialGradient(0, 0, this.radius * 0.5, 0, 0, this.radius * 2);
    glowGradient.addColorStop(0, 'rgba(255, 50, 50, 0.4)');
    glowGradient.addColorStop(1, 'rgba(255, 50, 50, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Boss body with gradient
    const bodyGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    bodyGrad.addColorStop(0, '#cc2222');
    bodyGrad.addColorStop(0.6, '#8b0000');
    bodyGrad.addColorStop(1, '#550000');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Body outline with glow
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#ff3333';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Tactical gear detail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.arc(0, -2, this.radius * 0.5, Math.PI, 0);
    ctx.fill();

    // Weapon with gradient
    const weaponGrad = ctx.createLinearGradient(0, -4, this.radius + 8, 4);
    weaponGrad.addColorStop(0, '#2a2a2a');
    weaponGrad.addColorStop(0.5, '#4a4a4a');
    weaponGrad.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = weaponGrad;
    ctx.fillRect(0, -3, this.radius + 8, 6);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, -3, this.radius + 8, 6);

    // Weapon extension
    ctx.fillStyle = '#555';
    ctx.fillRect(this.radius, -5, 8, 10);

    // Boss crown/marker with glow
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#ffd700';
    ctx.strokeStyle = '#ff8c00';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const x1 = Math.cos(angle) * this.radius * 0.7;
      const y1 = Math.sin(angle) * this.radius * 0.7;
      const x2 = Math.cos(angle) * this.radius * 1.1;
      const y2 = Math.sin(angle) * this.radius * 1.1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x2 + 2, y2);
      ctx.lineTo(x1, y1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // Muzzle flash with glow (if firing)
    if (this.fireTimer > 0 && this.fireTimer < 3) {
      ctx.shadowColor = '#ff6600';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#ffaa00';
      ctx.beginPath();
      ctx.arc(this.radius + 10, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.radius + 10, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.restore();

    // Draw enhanced health bar
    const barWidth = 60;
    const barHeight = 6;
    const x = this.x - barWidth/2;
    const y = this.y - this.radius - 18;

    // Health bar shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(x + 2, y + 2, barWidth, barHeight);

    // Background
    ctx.fillStyle = '#111';
    ctx.fillRect(x - 1, y - 1, barWidth + 2, barHeight + 2);

    // HP bar with gradient based on health
    const hpPercent = this.hp / this.maxHp;
    if (hpPercent > 0) {
      const healthGrad = ctx.createLinearGradient(x, y, x, y + barHeight);
      if (hpPercent > 0.7) {
        healthGrad.addColorStop(0, '#ff5555');
        healthGrad.addColorStop(0.5, '#ff0000');
        healthGrad.addColorStop(1, '#aa0000');
      } else if (hpPercent > 0.3) {
        healthGrad.addColorStop(0, '#ff9944');
        healthGrad.addColorStop(0.5, '#ff6600');
        healthGrad.addColorStop(1, '#cc4400');
      } else {
        healthGrad.addColorStop(0, '#ffcc66');
        healthGrad.addColorStop(0.5, '#ffaa00');
        healthGrad.addColorStop(1, '#cc8800');
      }
      ctx.fillStyle = healthGrad;
      ctx.fillRect(x, y, barWidth * hpPercent, barHeight);

      // Shine effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x, y, barWidth * hpPercent, 2);
    }

    // Health bar outline
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 1, y - 1, barWidth + 2, barHeight + 2);

    // Boss label with shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BOSS', this.x + 1, y - 4);
    ctx.fillStyle = '#ffd700';
    ctx.fillText('BOSS', this.x, y - 5);
  }

  drawDead(ctx) {
    // Dead boss shadow
    ctx.save();
    ctx.translate(this.x + 4, this.y + 4);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Dead boss body with gradient
    ctx.save();
    ctx.translate(this.x, this.y);
    const deadGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    deadGrad.addColorStop(0, '#6d0000');
    deadGrad.addColorStop(1, '#3d0000');
    ctx.fillStyle = deadGrad;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Outline
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Blood pool
    ctx.fillStyle = 'rgba(100, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.ellipse(4, 6, this.radius * 1.0, this.radius * 0.6, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // X mark
    ctx.strokeStyle = '#ff3333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-this.radius * 0.5, -this.radius * 0.5);
    ctx.lineTo(this.radius * 0.5, this.radius * 0.5);
    ctx.moveTo(this.radius * 0.5, -this.radius * 0.5);
    ctx.lineTo(-this.radius * 0.5, this.radius * 0.5);
    ctx.stroke();
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
    this.canvas.width = CONFIG.CANVAS_WIDTH;
    this.canvas.height = CONFIG.CANVAS_HEIGHT;

    this.level = null;
    this.player = null;
    this.teammates = [];
    this.enemies = [];
    this.bullets = [];
    this.grenades = [];
    this.particles = [];
    this.shellCasings = [];
    this.smokeClouds = [];
    this.breachCharges = [];
    this.explosionEffects = [];
    this.itemDrops = [];

    // Map selection
    this.selectedMap = 'compound';

    // Soldier class selection
    this.selectedClass = 'assault';

    // Team formation
    this.currentFormation = 'closeCombat';
    this.formationKeys = Object.keys(CONFIG.FORMATIONS);

    // Soldier selection - index into teammates array
    this.controlledSoldierIndex = 0;

    // Camera system
    this.cameraX = 0;
    this.cameraY = 0;

    // Mouse in world coordinates
    this.mouseX = 0;
    this.mouseY = 0;
    // Mouse in screen coordinates
    this.mouseScreenX = 0;
    this.mouseScreenY = 0;

    this.isRunning = false;
    this.isPaused = false;
    this.missionComplete = false;
    this.missionFailed = false;

    this.flashOverlay = 0;
    this.screenShake = 0;

    // Multiplayer state
    this.isMultiplayer = false;
    this.remotePlayers = new Map(); // Map of playerId -> Player object
    this.playerIdToEntity = new Map(); // Map server playerId to local Player objects

    // Score & Combo system
    this.score = 0;
    this.multiplier = 1;
    this.comboTimer = 0;
    this.comboWindow = 300; // frames (~5 seconds at 60fps)

    // FUN meter system
    this.funMeter = 0; // 0-100
    this.funActive = false;
    this.funTimer = 0;
    this.funDuration = 240; // ~4 seconds

    // Power-up effects
    this.adrenalineActive = false;
    this.adrenalineTimer = 0;
    this.adrenalineDuration = 360; // ~6 seconds

    // Dynamic Difficulty Director
    this.difficultyDirector = new DifficultyDirector();

    // Global reference for Enemy class
    window.__game = this;

    this.bindEvents();
    this.bindMultiplayerEvents();
    this.showMenu();
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    this.canvas.addEventListener('wheel', (e) => this.handleMouseWheel(e));

    // Main menu buttons
    document.getElementById('singleplayer-btn')?.addEventListener('click', () => this.showSingleplayerMenu());
    document.getElementById('multiplayer-btn')?.addEventListener('click', () => this.showMultiplayerMenu());

    // Single player menu
    document.getElementById('start-btn')?.addEventListener('click', () => this.startMission());
    document.getElementById('back-to-main')?.addEventListener('click', () => this.showMainMenu());

    // Sound toggle
    document.getElementById('sound-toggle')?.addEventListener('click', () => {
      const enabled = sound.toggle();
      document.getElementById('sound-toggle').textContent = `Sound: ${enabled ? 'ON' : 'OFF'}`;
    });

    // Class selection buttons
    document.querySelectorAll('.class-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target.closest('.class-btn');
        if (!target) return;
        document.querySelectorAll('.class-btn').forEach(b => b.classList.remove('selected'));
        target.classList.add('selected');
        this.selectedClass = target.dataset.class;
        this.updateClassPreview();
      });
    });

    // Map selection buttons (single player)
    document.querySelectorAll('.map-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');
        this.selectedMap = e.target.dataset.map;
        this.updateMapDescription();
      });
    });

    // Map selection buttons (multiplayer)
    document.querySelectorAll('.map-btn-mp').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!multiplayer.isHost) return; // Only host can change map
        document.querySelectorAll('.map-btn-mp').forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');
        this.selectedMap = e.target.dataset.map;
      });
    });

    // Initialize map description
    this.updateMapDescription();

    // Load game button (main menu)
    document.getElementById('load-game-btn')?.addEventListener('click', () => {
      this.showSaveLoadMenu('load');
    });

    // Pause menu buttons
    document.getElementById('resume-btn')?.addEventListener('click', () => this.resumeGame());
    document.getElementById('save-game-btn')?.addEventListener('click', () => this.showSaveLoadMenu('save'));
    document.getElementById('load-game-pause-btn')?.addEventListener('click', () => this.showSaveLoadMenu('load'));
    document.getElementById('quit-to-menu-btn')?.addEventListener('click', () => this.quitToMenu());

    // Save/Load menu close button
    document.getElementById('save-load-close-btn')?.addEventListener('click', () => this.hideSaveLoadMenu());
  }

  bindMultiplayerEvents() {
    // Multiplayer menu buttons
    document.getElementById('mp-back-to-main')?.addEventListener('click', () => this.showMainMenu());
    document.getElementById('create-room-btn')?.addEventListener('click', () => this.createRoom());
    document.getElementById('join-room-btn')?.addEventListener('click', () => this.joinRoom());
    document.getElementById('leave-room-btn')?.addEventListener('click', () => this.leaveRoom());
    document.getElementById('start-mp-game-btn')?.addEventListener('click', () => this.startMultiplayerGame());

    // Setup multiplayer callbacks
    multiplayer.onConnected = () => {
      this.updateMpStatus('Connected to server');
    };

    multiplayer.onDisconnected = () => {
      this.updateMpStatus('Disconnected from server');
      if (this.isMultiplayer && this.isRunning) {
        // Handle disconnect during game
        this.isMultiplayer = false;
      }
    };

    multiplayer.onRoomCreated = (data) => {
      this.showLobby(data);
    };

    multiplayer.onRoomJoined = (data) => {
      this.showLobby(data);
    };

    multiplayer.onPlayerJoined = (data) => {
      this.updateLobbyPlayers(data.players);
    };

    multiplayer.onPlayerLeft = (data) => {
      this.updateLobbyPlayers(data.players);
      // Update host status
      if (multiplayer.isHost) {
        document.getElementById('start-mp-game-btn').style.display = 'block';
        document.getElementById('waiting-text').style.display = 'none';
      }
      // Handle player leaving during game
      if (this.isRunning && this.isMultiplayer) {
        this.handleRemotePlayerLeft(data);
      }
    };

    multiplayer.onRoomLeft = () => {
      this.showMultiplayerMenu();
    };

    multiplayer.onGameStart = (data) => {
      this.startMultiplayerMission(data);
    };

    multiplayer.onGameUpdate = (data) => {
      this.handleGameUpdate(data);
    };

    multiplayer.onError = (data) => {
      this.updateMpStatus(data.message);
    };
  }

  showMainMenu() {
    document.getElementById('main-menu-buttons').style.display = 'flex';
    document.getElementById('singleplayer-menu').style.display = 'none';
    document.getElementById('multiplayer-menu').style.display = 'none';
    document.getElementById('lobby-screen').style.display = 'none';
  }

  showSingleplayerMenu() {
    document.getElementById('main-menu-buttons').style.display = 'none';
    document.getElementById('singleplayer-menu').style.display = 'block';
    document.getElementById('multiplayer-menu').style.display = 'none';
    document.getElementById('lobby-screen').style.display = 'none';
  }

  showMultiplayerMenu() {
    document.getElementById('main-menu-buttons').style.display = 'none';
    document.getElementById('singleplayer-menu').style.display = 'none';
    document.getElementById('multiplayer-menu').style.display = 'block';
    document.getElementById('lobby-screen').style.display = 'none';
    this.updateMpStatus('');

    // Connect to server if not connected
    if (!multiplayer.isConnected) {
      this.updateMpStatus('Connecting...');
      multiplayer.connect()
        .then(() => this.updateMpStatus('Connected! Create or join a room.'))
        .catch(() => this.updateMpStatus('Failed to connect to server'));
    }
  }

  showLobby(data) {
    document.getElementById('main-menu-buttons').style.display = 'none';
    document.getElementById('singleplayer-menu').style.display = 'none';
    document.getElementById('multiplayer-menu').style.display = 'none';
    document.getElementById('lobby-screen').style.display = 'block';

    document.getElementById('lobby-room-code').textContent = data.roomCode;
    this.updateLobbyPlayers(data.players);

    // Show/hide start button based on host status
    if (multiplayer.isHost) {
      document.getElementById('start-mp-game-btn').style.display = 'block';
      document.getElementById('waiting-text').style.display = 'none';
      // Enable map selection for host
      document.querySelectorAll('.map-btn-mp').forEach(btn => btn.disabled = false);
    } else {
      document.getElementById('start-mp-game-btn').style.display = 'none';
      document.getElementById('waiting-text').style.display = 'block';
      // Disable map selection for non-host
      document.querySelectorAll('.map-btn-mp').forEach(btn => btn.disabled = true);
    }
  }

  updateLobbyPlayers(players) {
    const list = document.getElementById('lobby-players');
    const count = document.getElementById('player-count');
    list.innerHTML = '';
    count.textContent = players.length;

    players.forEach(p => {
      const li = document.createElement('li');
      const nameSpan = document.createElement('span');
      nameSpan.className = 'player-name';
      nameSpan.textContent = p.name;
      li.appendChild(nameSpan);

      const badges = document.createElement('span');
      if (p.isHost) {
        const hostBadge = document.createElement('span');
        hostBadge.className = 'player-host';
        hostBadge.textContent = 'HOST';
        badges.appendChild(hostBadge);
      }
      if (p.id === multiplayer.playerId) {
        const youBadge = document.createElement('span');
        youBadge.className = 'player-you';
        youBadge.textContent = 'YOU';
        youBadge.style.marginLeft = '5px';
        badges.appendChild(youBadge);
      }
      li.appendChild(badges);
      list.appendChild(li);
    });
  }

  updateMpStatus(message) {
    const statusEl = document.getElementById('mp-status');
    if (statusEl) statusEl.textContent = message;
  }

  createRoom() {
    const nameInput = document.getElementById('player-name');
    const playerName = nameInput?.value.trim() || 'Player';
    multiplayer.createRoom(playerName);
  }

  joinRoom() {
    const nameInput = document.getElementById('player-name');
    const codeInput = document.getElementById('room-code-input');
    const playerName = nameInput?.value.trim() || 'Player';
    const roomCode = codeInput?.value.trim().toUpperCase() || '';

    if (roomCode.length !== 4) {
      this.updateMpStatus('Please enter a 4-character room code');
      return;
    }

    multiplayer.joinRoom(roomCode, playerName);
  }

  leaveRoom() {
    multiplayer.leaveRoom();
  }

  startMultiplayerGame() {
    if (!multiplayer.isHost) return;
    multiplayer.startGame(this.selectedMap);
  }

  updateMapDescription() {
    const descEl = document.getElementById('map-description');
    if (descEl && MAP_TYPES[this.selectedMap]) {
      descEl.textContent = MAP_TYPES[this.selectedMap].description;
    }
  }

  updateClassPreview() {
    const classData = CONFIG.SOLDIER_CLASSES[this.selectedClass];
    if (!classData) return;

    const descEl = document.getElementById('class-description');
    if (descEl) descEl.textContent = classData.description;

    const stats = classData.stats;
    document.getElementById('preview-health').style.width = `${stats.health}%`;
    document.getElementById('preview-armor').style.width = `${Math.min(100, stats.armor * 2)}%`;
    document.getElementById('preview-speed').style.width = `${stats.speed * 100}%`;
    document.getElementById('preview-accuracy').style.width = `${stats.accuracy * 100}%`;

    const gearList = document.getElementById('gear-list');
    if (gearList) {
      const weapons = classData.defaultWeapons.map(w => CONFIG.WEAPONS[w]?.name || w).join(' + ');
      const gearItems = classData.defaultGear.map(g => CONFIG.GEAR[g]?.name || g);
      gearList.innerHTML = `<li>${weapons}</li>` + gearItems.map(g => `<li>${g}</li>`).join('');
    }
  }

  showMenu() {
    document.getElementById('menu-screen').style.display = 'flex';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('hud').style.display = 'none';

    // Reset multiplayer state
    this.isMultiplayer = false;
    this.remotePlayers.clear();
    this.playerIdToEntity.clear();
    multiplayer.stopSync();

    // Show main menu
    this.showMainMenu();
  }

  startMission() {
    sound.init();
    sound.resume();

    // Ensure single player mode
    this.isMultiplayer = false;
    this.remotePlayers.clear();
    this.playerIdToEntity.clear();

    document.getElementById('menu-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('hud').style.display = 'block';

    // Create level with selected map type
    this.level = new Level(this.selectedMap);

    // Reset camera to starting position
    this.cameraX = 0;
    this.cameraY = 0;

    // Spawn player with selected class
    const spawn = this.level.spawnPoints.team[0];
    this.player = new Player(spawn.x, spawn.y, true, this.selectedClass);

    // Spawn AI teammates with varied classes
    const aiClasses = ['support', 'breacher', 'recon'];
    this.teammates = [this.player];
    for (let i = 1; i < this.level.spawnPoints.team.length; i++) {
      const sp = this.level.spawnPoints.team[i];
      const aiClass = aiClasses[(i - 1) % aiClasses.length];
      const teammate = new Player(sp.x, sp.y, false, aiClass);
      teammate.name = ['Alpha', 'Bravo', 'Charlie'][i-1] || `Team ${i}`;
      teammate.isAI = true;
      this.teammates.push(teammate);
    }

    // Spawn enemies with variety
    this.enemies = [];
    const enemySpawns = this.level.spawnPoints.enemy;
    for (let i = 0; i < enemySpawns.length; i++) {
      const sp = enemySpawns[i];
      const roll = Math.random();
      let enemy;
      if (roll < 0.15) {
        enemy = new ShieldBearer(sp.x, sp.y);
      } else if (roll < 0.30) {
        enemy = new Demolitionist(sp.x, sp.y);
      } else if (roll < 0.40) {
        enemy = new Spotter(sp.x, sp.y);
      } else {
        enemy = new Enemy(sp.x, sp.y);
      }
      this.enemies.push(enemy);
    }

    // Spawn boss if level has a boss spawn point
    if (this.level.spawnPoints.boss) {
      const bossSpawn = this.level.spawnPoints.boss;
      this.enemies.push(new Boss(bossSpawn.x, bossSpawn.y));
    }

    this.bullets = [];
    this.grenades = [];
    this.particles = [];
    this.shellCasings = [];
    this.smokeClouds = [];
    this.breachCharges = [];
    this.explosionEffects = [];

    this.missionComplete = false;
    this.missionFailed = false;
    this.isRunning = true;

    // Reset difficulty director for new mission
    this.difficultyDirector.reset();

    this.gameLoop();
  }

  startMultiplayerMission(data) {
    sound.init();
    sound.resume();

    this.isMultiplayer = true;

    document.getElementById('menu-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('hud').style.display = 'block';

    // Use map type from server (host's selection)
    const mapType = data.mapType || this.selectedMap;

    // Create level with selected map type (from host)
    this.level = new Level(mapType);

    // Reset camera to starting position
    this.cameraX = 0;
    this.cameraY = 0;

    // Find this player's spawn index
    const myPlayerIndex = data.players.findIndex(p => p.id === multiplayer.playerId);

    // Spawn all players
    this.teammates = [];
    this.remotePlayers.clear();
    this.playerIdToEntity.clear();

    for (let i = 0; i < data.players.length; i++) {
      const playerData = data.players[i];
      const spawn = this.level.spawnPoints.team[i] || this.level.spawnPoints.team[0];
      const isLocal = playerData.id === multiplayer.playerId;

      const player = new Player(spawn.x, spawn.y, isLocal);
      player.name = playerData.name;
      player.networkId = playerData.id;
      player.isAI = false;
      player.isRemote = !isLocal;

      if (isLocal) {
        this.player = player;
        this.controlledSoldierIndex = i;
      } else {
        this.remotePlayers.set(playerData.id, player);
      }

      this.teammates.push(player);
      this.playerIdToEntity.set(playerData.id, player);
    }

    // Spawn AI teammates to fill remaining slots
    const aiCount = data.aiCount || 0;
    for (let i = 0; i < aiCount && this.teammates.length < 4; i++) {
      const spawnIndex = this.teammates.length;
      const sp = this.level.spawnPoints.team[spawnIndex] || this.level.spawnPoints.team[0];
      const aiTeammate = new Player(sp.x, sp.y, false);
      aiTeammate.name = ['Alpha', 'Bravo', 'Charlie', 'Delta'][spawnIndex] || `AI ${i+1}`;
      aiTeammate.isAI = true;
      this.teammates.push(aiTeammate);
    }

    // Spawn enemies with variety
    this.enemies = [];
    const enemySpawns = this.level.spawnPoints.enemy;
    for (let i = 0; i < enemySpawns.length; i++) {
      const sp = enemySpawns[i];
      const roll = Math.random();
      let enemy;
      if (roll < 0.15) {
        enemy = new ShieldBearer(sp.x, sp.y);
      } else if (roll < 0.30) {
        enemy = new Demolitionist(sp.x, sp.y);
      } else if (roll < 0.40) {
        enemy = new Spotter(sp.x, sp.y);
      } else {
        enemy = new Enemy(sp.x, sp.y);
      }
      this.enemies.push(enemy);
    }

    // Spawn boss if level has a boss spawn point
    if (this.level.spawnPoints.boss) {
      const bossSpawn = this.level.spawnPoints.boss;
      this.enemies.push(new Boss(bossSpawn.x, bossSpawn.y));
    }

    this.bullets = [];
    this.grenades = [];
    this.particles = [];
    this.shellCasings = [];
    this.smokeClouds = [];
    this.breachCharges = [];
    this.explosionEffects = [];

    this.missionComplete = false;
    this.missionFailed = false;
    this.isRunning = true;

    // Reset difficulty director for new mission
    this.difficultyDirector.reset();

    // Start syncing player state
    multiplayer.startSync(this);

    this.gameLoop();
  }

  handleGameUpdate(data) {
    if (!this.isRunning || !this.isMultiplayer) return;

    const senderId = data.senderId;
    const state = data.data;

    // Handle events (bullets, grenades)
    if (state.event) {
      switch (state.event) {
        case 'bullet_fired':
          this.handleRemoteBullet(state);
          break;
        case 'grenade_thrown':
          this.handleRemoteGrenade(state);
          break;
      }
      return;
    }

    // Update remote player state
    const remotePlayer = this.remotePlayers.get(senderId);
    if (remotePlayer) {
      // Interpolate position for smooth movement
      remotePlayer.targetX = state.x;
      remotePlayer.targetY = state.y;
      remotePlayer.targetAngle = state.angle;

      // Immediate state updates
      remotePlayer.hp = state.hp;
      remotePlayer.isDead = state.isDead;
      remotePlayer.stance = state.stance;
      remotePlayer.lean = state.lean;
      remotePlayer.isFiring = state.isFiring;
      remotePlayer.isReloading = state.isReloading;
      remotePlayer.currentWeapon = state.currentWeapon;
      remotePlayer.muzzleFlash = state.muzzleFlash;
    }
  }

  handleRemoteBullet(state) {
    // Create bullet from remote player
    const weapon = CONFIG.WEAPONS[state.weaponType] || CONFIG.WEAPONS.rifle;
    const bullet = new Bullet(state.x, state.y, state.angle, weapon, null);
    bullet.isRemote = true;
    this.bullets.push(bullet);
    sound.play(weapon.sound, state.x, state.y);
  }

  handleRemoteGrenade(state) {
    // Create grenade from remote player
    const grenade = new Grenade(state.x, state.y, state.targetX, state.targetY, state.type, null);
    grenade.isRemote = true;
    this.grenades.push(grenade);
  }

  handleRemotePlayerLeft(data) {
    // Find and remove the disconnected player
    for (const [playerId, player] of this.remotePlayers) {
      if (!data.players.some(p => p.id === playerId)) {
        // Player left - make them an AI or remove them
        player.isAI = true;
        player.isRemote = false;
        player.name = player.name + ' (DC)';
        this.remotePlayers.delete(playerId);
      }
    }
  }

  updateRemotePlayers() {
    // Interpolate remote player positions
    for (const remotePlayer of this.remotePlayers.values()) {
      if (remotePlayer.isDead) continue;

      // Smooth position interpolation
      if (remotePlayer.targetX !== undefined) {
        remotePlayer.x = utils.lerp(remotePlayer.x, remotePlayer.targetX, 0.3);
        remotePlayer.y = utils.lerp(remotePlayer.y, remotePlayer.targetY, 0.3);
      }

      // Smooth angle interpolation
      if (remotePlayer.targetAngle !== undefined) {
        // Handle angle wrapping
        let angleDiff = remotePlayer.targetAngle - remotePlayer.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        remotePlayer.angle += angleDiff * 0.3;
      }
    }
  }

  gameLoop() {
    if (!this.isRunning) return;

    // Only update game state if not paused
    if (!this.isPaused) {
      this.update();
    }
    this.draw();

    requestAnimationFrame(() => this.gameLoop());
  }

  updateCamera() {
    // Camera follows player, centered on screen
    const targetX = this.player.x - CONFIG.CANVAS_WIDTH / 2;
    const targetY = this.player.y - CONFIG.CANVAS_HEIGHT / 2;

    // Smooth camera movement
    this.cameraX = utils.lerp(this.cameraX, targetX, 0.1);
    this.cameraY = utils.lerp(this.cameraY, targetY, 0.1);

    // Clamp camera to map bounds
    this.cameraX = utils.clamp(this.cameraX, 0, CONFIG.MAP_WIDTH - CONFIG.CANVAS_WIDTH);
    this.cameraY = utils.clamp(this.cameraY, 0, CONFIG.MAP_HEIGHT - CONFIG.CANVAS_HEIGHT);

    // Update world mouse coordinates
    this.mouseX = this.mouseScreenX + this.cameraX;
    this.mouseY = this.mouseScreenY + this.cameraY;
  }

  update() {
    if (this.isPaused || this.missionComplete || this.missionFailed) return;

    // Update camera
    this.updateCamera();

    // Update dynamic difficulty director
    this.difficultyDirector.update(this.player, this.teammates);

    // Update fog of war (reveal areas around player and teammates)
    this.level.updateFogOfWar(this.player.x, this.player.y, this.teammates);

    // Update player
    this.player.update(this.mouseX, this.mouseY, this.level);

    // Check for item pickups near player
    this.checkItemPickups(this.player);

    // Auto-fire for held mouse
    if (this.player.isFiring && this.player.weapon.auto) {
      const result = this.player.fire();
      if (result) {
        this.bullets.push(...result.bullets);
        this.shellCasings.push(result.casing);
        this.notifyEnemiesOfSound(this.player.x, this.player.y, 1);
      }
    }

    // Update AI teammates with formation
    for (let i = 0; i < this.teammates.length; i++) {
      const tm = this.teammates[i];
      if (tm.isAI && !tm.isDead) {
        this.updateAITeammate(tm, i);
      }
    }

    // Check for item pickups near teammates
    for (const tm of this.teammates) {
      if (!tm.isDead) {
        this.checkItemPickups(tm);
      }
    }

    // Update remote players (multiplayer)
    if (this.isMultiplayer) {
      this.updateRemotePlayers();
    }

    // Update enemies
    for (const enemy of this.enemies) {
      const result = enemy.update(this.teammates.filter(t => !t.isDead), this.level, this.smokeClouds);
      if (result) {
        if (result.bullet) {
          this.bullets.push(result.bullet);
          this.shellCasings.push(result.casing);
          this.notifyEnemiesOfSound(enemy.x, enemy.y, 0.8);
        }
        // Handle boss grenades
        if (result.grenade) {
          this.grenades.push(result.grenade);
          this.notifyEnemiesOfSound(enemy.x, enemy.y, 0.5);
        }
      }
    }

    // Update bullets
    const allEntities = [...this.teammates, ...this.enemies];
    for (const bullet of this.bullets) {
      const hit = bullet.update(this.level, allEntities.filter(e => e !== bullet.shooter));
      if (hit?.type === 'entity') {
        const damage = bullet.damage;
        const wasAlive = !hit.entity.isDead;
        hit.entity.takeDamage(damage, bullet.startX, bullet.startY);
        this.spawnBlood(hit.x, hit.y);

        // Spawn drops if enemy just died
        if (wasAlive && hit.entity.isDead && this.enemies.includes(hit.entity)) {
          this.spawnEnemyDrops(hit.entity);
        }
      } else if (hit?.type === 'wall') {
        this.spawnSparks(hit.x, hit.y);
      }
    }
    this.bullets = this.bullets.filter(b => !b.dead);

    // Update grenades
    for (const grenade of this.grenades) {
      const result = grenade.update(this.level);
      if (result) {
        this.handleGrenadeExplosion(grenade);
      }
    }
    this.grenades = this.grenades.filter(g => !g.dead);

    // Update smoke clouds
    for (const smoke of this.smokeClouds) {
      smoke.update();
    }
    this.smokeClouds = this.smokeClouds.filter(s => s.life > 0);

    // Update explosion effects
    for (const effect of this.explosionEffects) {
      effect.update();
    }
    this.explosionEffects = this.explosionEffects.filter(e => !e.dead);

    // Update particles (with special logic for new types)
    for (const p of this.particles) {
      if (p.type === 'confetti') {
        // Update confetti physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // Gravity
        p.vx *= 0.98;
        p.vy *= 0.98;
        if (p.rotation !== undefined) {
          p.rotation += p.rotSpeed || 0;
        }
        p.life--;
      } else if (p.type === 'cheer') {
        // Update cheer text (floats upward)
        p.y += p.vy || -0.5;
        p.life--;
      } else {
        // Standard particle update
        p.update();
      }
    }
    this.particles = this.particles.filter(p => p.life > 0);

    // Update shell casings
    for (const c of this.shellCasings) c.update();
    this.shellCasings = this.shellCasings.filter(c => c.life > 0);

    // Update item drops
    for (const drop of this.itemDrops) drop.update();

    // Update effects
    if (this.flashOverlay > 0) this.flashOverlay -= 3;
    if (this.screenShake > 0) this.screenShake *= 0.9;

    // Update combo timer (decay multiplier when timer expires)
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer === 0) {
        // Reset multiplier when combo expires (use same step as increase)
        this.multiplier = Math.max(1, this.multiplier - 0.5);
      }
    }

    // Update FUN meter system
    if (this.funMeter >= 100 && !this.funActive) {
      // Activate FUN mode!
      this.funActive = true;
      this.funTimer = this.funDuration;
      this.funMeter = 0; // Reset meter
      
      // Show cheer message
      if (this.player) {
        this.particles.push({
          type: 'cheer',
          x: this.player.x,
          y: this.player.y - 40,
          text: '🎉 FUN MODE! 🎉',
          life: 120,
          maxLife: 120,
          color: '#ffd700',
          vy: -0.5,
          size: 20
        });
      }
    }

    // Update FUN mode timer
    if (this.funActive) {
      this.funTimer--;
      
      // Spawn confetti periodically
      if (this.funTimer % 10 === 0 && this.player) {
        const colors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff', '#ff6bff'];
        for (let i = 0; i < 3; i++) {
          this.particles.push({
            type: 'confetti',
            x: this.player.x + (Math.random() - 0.5) * 60,
            y: this.player.y + (Math.random() - 0.5) * 60,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4 - 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 60,
            maxLife: 60,
            size: 4,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.3
          });
        }
      }
      
      if (this.funTimer <= 0) {
        this.funActive = false;
      }
    }

    // Update adrenaline effect
    if (this.adrenalineActive) {
      this.adrenalineTimer--;
      if (this.adrenalineTimer <= 0) {
        this.adrenalineActive = false;
      }
    }

    // Handle item pickups for player
    this.handleItemPickups();

    // Dynamic difficulty - spawn reinforcements when player is dominating
    if (this.difficultyDirector.shouldSpawnReinforcements() && this.enemies.filter(e => !e.isDead).length < 8) {
      this.spawnDifficultyReinforcements();
    }

    // Check mission status
    this.checkMissionStatus();

    // Update HUD
    this.updateHUD();
  }

  updateAITeammate(tm, index) {
    // Initialize AI state if not present
    if (!tm.aiState) {
      tm.aiState = {
        lastReloadTime: 0,
        lastGrenadeTime: 0,
        suppressionLevel: 0, // How suppressed the AI is (0-100)
        lastDamageTime: 0,
        coverPosition: null,
        preferredEngagementRange: 150,
        burstCounter: 0,
        targetEnemy: null
      };
    }

    // Decay suppression over time
    if (tm.aiState.suppressionLevel > 0) {
      tm.aiState.suppressionLevel = Math.max(0, tm.aiState.suppressionLevel - 0.5);
    }

    // Check if taking damage recently (increases suppression)
    const timeSinceLastDamage = Date.now() - tm.aiState.lastDamageTime;
    if (timeSinceLastDamage < 2000) {
      tm.aiState.suppressionLevel = Math.min(100, tm.aiState.suppressionLevel + 5);
    }

    // Find all visible enemies and select best target
    let nearestEnemy = null;
    let nearestDist = Infinity;
    let threats = [];

    for (const enemy of this.enemies) {
      if (enemy.isDead) continue;
      const d = utils.distance(tm.x, tm.y, enemy.x, enemy.y);
      if (this.level.checkLineOfSight(tm.x, tm.y, enemy.x, enemy.y, this.smokeClouds)) {
        threats.push({ enemy, distance: d });
        if (d < nearestDist) {
          nearestDist = d;
          nearestEnemy = enemy;
        }
      }
    }

    // Smart target selection: prioritize threats and distribute targets among team
    let targetEnemy = nearestEnemy;
    if (threats.length > 1) {
      // Look for enemies that recently damaged us
      const recentThreat = threats.find(t =>
        t.enemy.lastTarget === tm && Date.now() - (t.enemy.lastAttackTime || 0) < 3000
      );
      if (recentThreat) {
        targetEnemy = recentThreat.enemy;
      } else {
        // Target distribution: prefer enemies not already targeted by teammates
        const teammateTargets = this.teammates
          .filter(t => t !== tm && t.isAI && !t.isDead && t.aiState?.targetEnemy)
          .map(t => t.aiState.targetEnemy);

        // Find an enemy not being targeted by others
        const untargetedThreat = threats.find(t => !teammateTargets.includes(t.enemy));
        if (untargetedThreat && Math.random() < 0.7) {
          targetEnemy = untargetedThreat.enemy;
        }
      }
    }
    tm.aiState.targetEnemy = targetEnemy;

    // Check if low health (tactical retreat needed)
    const healthPercent = tm.hp / 100;
    const isLowHealth = healthPercent < 0.3;
    const isCriticalHealth = healthPercent < 0.15;

    // Proactive reloading (reload when safe and ammo is low)
    const ammoPercent = tm.weapon.ammo / tm.weapon.magSize;
    if (!targetEnemy && ammoPercent < 0.3 && tm.weapon.reserveAmmo > 0) {
      const timeSinceReload = Date.now() - tm.aiState.lastReloadTime;
      if (timeSinceReload > 5000) {
        tm.reload();
        tm.aiState.lastReloadTime = Date.now();
      }
    }

    // Smart grenade usage (suppress groups or flush out cover)
    if (targetEnemy && tm.grenades && tm.grenades.frag > 0) {
      const timeSinceGrenade = Date.now() - tm.aiState.lastGrenadeTime;
      const enemiesNearby = threats.filter(t => t.distance < 200).length;

      // Throw grenade if: multiple enemies clustered OR enemy in cover at medium range
      if (timeSinceGrenade > 15000 && (enemiesNearby >= 2 || (nearestDist > 80 && nearestDist < 200))) {
        if (Math.random() < 0.15) { // 15% chance per update when conditions met
          const grenade = tm.throwGrenade(targetEnemy.x, targetEnemy.y);
          if (grenade) {
            this.grenades.push(grenade);
            tm.aiState.lastGrenadeTime = Date.now();
            this.notifyEnemiesOfSound(tm.x, tm.y, 0.5);
          }
        }
      }
    }

    // Combat behavior with suppression and tactics
    const engagementRange = tm.aiState.preferredEngagementRange;
    const shouldEngage = targetEnemy && nearestDist < 300;

    if (shouldEngage) {
      tm.angle = utils.angle(tm.x, tm.y, targetEnemy.x, targetEnemy.y);

      // Decide whether to advance, hold, or retreat
      let combatAction = 'hold'; // 'advance', 'hold', 'retreat'

      if (isCriticalHealth) {
        combatAction = 'retreat'; // Always retreat when critical
      } else if (isLowHealth || tm.aiState.suppressionLevel > 60) {
        combatAction = 'retreat'; // Retreat when low health or heavily suppressed
      } else if (nearestDist > engagementRange * 1.5 && healthPercent > 0.6) {
        combatAction = 'advance'; // Advance if healthy and enemy is far
      } else if (nearestDist < engagementRange * 0.5) {
        combatAction = 'retreat'; // Too close, back up
      }

      // Execute combat movement (unless in specific order mode)
      if (tm.currentOrder === 'follow' || !tm.currentOrder) {
        const moveSpeed = tm.speed * 0.3;
        let moveAngle;

        if (combatAction === 'advance') {
          moveAngle = utils.angle(tm.x, tm.y, targetEnemy.x, targetEnemy.y);
        } else if (combatAction === 'retreat') {
          moveAngle = utils.angle(targetEnemy.x, targetEnemy.y, tm.x, tm.y); // Away from enemy
        }

        if (moveAngle !== undefined) {
          const nextX = tm.x + Math.cos(moveAngle) * moveSpeed;
          const nextY = tm.y + Math.sin(moveAngle) * moveSpeed;
          if (!this.level.isSolid(nextX, tm.y)) tm.x = nextX;
          if (!this.level.isSolid(tm.x, nextY)) tm.y = nextY;
        }
      }

      // Smart firing with burst control and suppression awareness
      if (tm.fireTimer <= 0 && tm.weapon.ammo > 0) {
        const accuracyMod = tm.aiState.suppressionLevel / 200; // More suppression = less accurate
        const shouldFire = tm.aiState.suppressionLevel < 80; // Don't fire when heavily suppressed

        if (shouldFire) {
          // Burst fire control (fire 3-5 rounds then pause)
          tm.aiState.burstCounter++;
          const burstSize = 3 + Math.floor(Math.random() * 3);

          if (tm.aiState.burstCounter >= burstSize) {
            tm.aiState.burstCounter = 0;
            tm.fireTimer = tm.weapon.fireRate * (3 + Math.random() * 2); // Longer pause between bursts
          } else {
            tm.fireTimer = tm.weapon.fireRate + Math.random() * 3;
          }

          const spread = tm.weapon.spread * (1.2 + accuracyMod);
          const angleOffset = (Math.random() - 0.5) * spread;
          const bulletAngle = tm.angle + angleOffset;
          const spawnX = tm.x + Math.cos(tm.angle) * 15;
          const spawnY = tm.y + Math.sin(tm.angle) * 15;
          this.bullets.push(new Bullet(spawnX, spawnY, bulletAngle, tm.weapon, tm));
          this.shellCasings.push(new ShellCasing(tm.x, tm.y, tm.angle));
          sound.play(tm.weapon.sound, tm.x, tm.y);
        }
      }
    }

    // Handle movement based on current order
    switch (tm.currentOrder) {
      case 'stay':
        // Stay at current position, don't move
        if (tm.orderPosition) {
          const distToOrder = utils.distance(tm.x, tm.y, tm.orderPosition.x, tm.orderPosition.y);
          if (distToOrder > 10) {
            // Move back to stay position if pushed away
            const moveAngle = utils.angle(tm.x, tm.y, tm.orderPosition.x, tm.orderPosition.y);
            const speed = tm.speed * 0.5;
            const nextX = tm.x + Math.cos(moveAngle) * speed;
            const nextY = tm.y + Math.sin(moveAngle) * speed;
            if (!this.level.isSolid(nextX, tm.y)) tm.x = nextX;
            if (!this.level.isSolid(tm.x, nextY)) tm.y = nextY;
          }
        }
        // Face the nearest threat or player direction
        if (!nearestEnemy) {
          tm.angle = this.player.angle;
        }
        break;

      case 'guard':
        // Guard a position, move within radius
        if (tm.orderPosition) {
          const distToGuard = utils.distance(tm.x, tm.y, tm.orderPosition.x, tm.orderPosition.y);

          if (nearestEnemy && nearestDist < tm.guardRadius) {
            // Enemy in guard radius - engage but stay in area
            if (distToGuard > tm.guardRadius * 0.7) {
              // Move back toward guard position
              const moveAngle = utils.angle(tm.x, tm.y, tm.orderPosition.x, tm.orderPosition.y);
              const speed = tm.speed * 0.4;
              const nextX = tm.x + Math.cos(moveAngle) * speed;
              const nextY = tm.y + Math.sin(moveAngle) * speed;
              if (!this.level.isSolid(nextX, tm.y)) tm.x = nextX;
              if (!this.level.isSolid(tm.x, nextY)) tm.y = nextY;
            }
          } else if (distToGuard > 20) {
            // Return to guard position
            const moveAngle = utils.angle(tm.x, tm.y, tm.orderPosition.x, tm.orderPosition.y);
            const speed = tm.speed * 0.6;
            const nextX = tm.x + Math.cos(moveAngle) * speed;
            const nextY = tm.y + Math.sin(moveAngle) * speed;
            if (!this.level.isSolid(nextX, tm.y)) tm.x = nextX;
            if (!this.level.isSolid(tm.x, nextY)) tm.y = nextY;
          } else {
            // In position - scan for threats
            if (!nearestEnemy) {
              tm.angle += 0.02; // Slowly rotate to scan
            }
          }
        }
        break;

      case 'cover':
        // Move to cover position and provide suppressing fire
        if (tm.coverTarget) {
          const distToCover = utils.distance(tm.x, tm.y, tm.coverTarget.x, tm.coverTarget.y);

          if (distToCover > 20) {
            // Move to cover position
            const moveAngle = utils.angle(tm.x, tm.y, tm.coverTarget.x, tm.coverTarget.y);
            const speed = tm.speed * 0.8;
            const nextX = tm.x + Math.cos(moveAngle) * speed;
            const nextY = tm.y + Math.sin(moveAngle) * speed;
            if (!this.level.isSolid(nextX, tm.y)) tm.x = nextX;
            if (!this.level.isSolid(tm.x, nextY)) tm.y = nextY;
          } else {
            // In cover position - provide covering fire
            if (nearestEnemy) {
              // More aggressive firing when in cover
              if (tm.fireTimer <= 0 && tm.weapon.ammo > 0 && Math.random() < 0.3) {
                tm.fireTimer = tm.weapon.fireRate;
                const spread = tm.weapon.spread * 1.5;
                const angleOffset = (Math.random() - 0.5) * spread;
                const bulletAngle = tm.angle + angleOffset;
                const spawnX = tm.x + Math.cos(tm.angle) * 15;
                const spawnY = tm.y + Math.sin(tm.angle) * 15;
                this.bullets.push(new Bullet(spawnX, spawnY, bulletAngle, tm.weapon, tm));
                this.shellCasings.push(new ShellCasing(tm.x, tm.y, tm.angle));
                sound.play(tm.weapon.sound, tm.x, tm.y);
              }
            }
          }
        } else if (!nearestEnemy) {
          // No cover target set, face player direction
          tm.angle = this.player.angle;
        }
        break;

      case 'follow':
      default:
        // Follow player in formation (original behavior)
        const formation = CONFIG.FORMATIONS[this.currentFormation];
        const posIndex = index - 1;
        const formationPos = formation.positions[posIndex] || formation.positions[0];

        const playerAngle = this.player.angle;
        const targetAngle = playerAngle + formationPos.angleOffset;
        const targetX = this.player.x + Math.cos(targetAngle) * formationPos.distance;
        const targetY = this.player.y + Math.sin(targetAngle) * formationPos.distance;
        const distToTarget = utils.distance(tm.x, tm.y, targetX, targetY);

        if (nearestEnemy && nearestDist < 250) {
          // Combat - try to maintain formation
          if (this.currentFormation === 'closeCombat' && distToTarget > 20) {
            const moveAngle = utils.angle(tm.x, tm.y, targetX, targetY);
            const speed = tm.speed * 0.4;
            const nextX = tm.x + Math.cos(moveAngle) * speed;
            const nextY = tm.y + Math.sin(moveAngle) * speed;
            if (!this.level.isSolid(nextX, tm.y)) tm.x = nextX;
            if (!this.level.isSolid(tm.x, nextY)) tm.y = nextY;
          }
        } else if (distToTarget > 15) {
          // Move to formation position
          const moveAngle = utils.angle(tm.x, tm.y, targetX, targetY);
          const speedMult = distToTarget > 100 ? 1.0 : distToTarget > 50 ? 0.8 : 0.6;
          const speed = tm.speed * speedMult;
          const nextX = tm.x + Math.cos(moveAngle) * speed;
          const nextY = tm.y + Math.sin(moveAngle) * speed;
          if (!this.level.isSolid(nextX, tm.y)) tm.x = nextX;
          if (!this.level.isSolid(tm.x, nextY)) tm.y = nextY;
          tm.angle = playerAngle;
        } else {
          // In position
          tm.angle = playerAngle;
        }
        break;
    }

    // Smart item pickup (when safe and needed)
    if (!shouldEngage || tm.aiState.suppressionLevel < 30) {
      for (let i = this.itemDrops.length - 1; i >= 0; i--) {
        const item = this.itemDrops[i];
        const distToItem = utils.distance(tm.x, tm.y, item.x, item.y);

        // Pick up items that are useful
        if (distToItem < 30) {
          let shouldPickup = false;

          switch (item.type) {
            case 'health':
              if (healthPercent < 0.7) shouldPickup = true;
              break;
            case 'ammo':
              if (tm.weapon.reserveAmmo < tm.weapon.magSize * 2) shouldPickup = true;
              break;
            case 'grenade':
              if (!tm.grenades.frag || tm.grenades.frag < 2) shouldPickup = true;
              break;
            case 'weapon':
              // AI can pick up better weapons (simplified: always pick up)
              shouldPickup = true;
              break;
          }

          if (shouldPickup) {
            switch (item.type) {
              case 'health':
                tm.hp = Math.min(100, tm.hp + item.amount);
                this.itemDrops.splice(i, 1);
                break;
              case 'ammo':
                tm.weapon.reserveAmmo += item.amount;
                this.itemDrops.splice(i, 1);
                break;
              case 'grenade':
                if (!tm.grenades.frag) tm.grenades.frag = 0;
                tm.grenades.frag += item.amount;
                this.itemDrops.splice(i, 1);
                break;
            }
          }
        } else if (distToItem < 100 && !shouldEngage && healthPercent < 0.5 && item.type === 'health') {
          // Move toward health packs when low health and safe
          const moveAngle = utils.angle(tm.x, tm.y, item.x, item.y);
          const speed = tm.speed * 0.5;
          const nextX = tm.x + Math.cos(moveAngle) * speed;
          const nextY = tm.y + Math.sin(moveAngle) * speed;
          if (!this.level.isSolid(nextX, tm.y)) tm.x = nextX;
          if (!this.level.isSolid(tm.x, nextY)) tm.y = nextY;
          break; // Only move toward one item at a time
        }
      }
    }

    // Update timers and reload
    if (tm.fireTimer > 0) tm.fireTimer--;
    if (tm.weapon.ammo <= 0 && tm.weapon.reserveAmmo > 0) {
      tm.weapon.ammo = tm.weapon.magSize;
      tm.weapon.reserveAmmo -= tm.weapon.magSize;
    }
  }

  cycleFormation() {
    const currentIndex = this.formationKeys.indexOf(this.currentFormation);
    const nextIndex = (currentIndex + 1) % this.formationKeys.length;
    this.currentFormation = this.formationKeys[nextIndex];
    return CONFIG.FORMATIONS[this.currentFormation];
  }

  giveOrderToTeam(orderType) {
    // Give order to all AI teammates
    for (const tm of this.teammates) {
      if (tm.isAI && !tm.isDead && tm !== this.player) {
        switch (orderType) {
          case 'stay':
            tm.currentOrder = 'stay';
            tm.orderPosition = { x: tm.x, y: tm.y };
            break;
          case 'guard':
            tm.currentOrder = 'guard';
            tm.orderPosition = { x: tm.x, y: tm.y };
            tm.guardRadius = 150;
            break;
          case 'follow':
            tm.currentOrder = 'follow';
            tm.orderPosition = null;
            tm.coverTarget = null;
            break;
          case 'cover':
            tm.currentOrder = 'cover';
            // Set cover target to mouse position or ahead of player
            tm.coverTarget = { x: this.mouseX, y: this.mouseY };
            break;
        }
      }
    }
    return orderType;
  }

  // Score and Combo System Methods
  addScore(basePoints) {
    const points = Math.floor(basePoints * this.multiplier);
    this.score += points;
    this.funMeter = Math.min(100, this.funMeter + (points / 50)); // Gain fun meter with score
    return points;
  }

  onComboEvent() {
    // Extend combo timer
    this.comboTimer = this.comboWindow;
    
    // Increase multiplier (max x9)
    this.multiplier = Math.min(9, this.multiplier + 0.5);
  }

  // Power-up Methods
  applyAdrenaline() {
    this.adrenalineActive = true;
    this.adrenalineTimer = this.adrenalineDuration;
    // Boost will be applied in player update logic
  }

  // Item pickup handler
  handleItemPickups() {
    if (!this.player || this.player.isDead) return;

    for (let i = this.itemDrops.length - 1; i >= 0; i--) {
      const drop = this.itemDrops[i];
      if (drop.collected) continue;

      const dist = utils.distance(this.player.x, this.player.y, drop.x, drop.y);
      if (dist < 40) {
        // Pickup logic based on drop type
        let pickedUp = false;

        if (drop.type === 'ammo') {
          // Refill mag and add to reserve
          if (this.player.weapon.ammo < this.player.weapon.magSize || this.player.weapon.reserveAmmo < this.player.weapon.magSize * 3) {
            this.player.weapon.ammo = this.player.weapon.magSize;
            this.player.weapon.reserveAmmo += drop.amount;
            pickedUp = true;
          }
        } else if (drop.type === 'medkit') {
          if (this.player.hp < 100) {
            this.player.hp = Math.min(100, this.player.hp + drop.amount);
            pickedUp = true;
          }
        } else if (drop.type === 'adrenaline') {
          this.applyAdrenaline();
          pickedUp = true;
        } else if (drop.type === 'charm') {
          this.multiplier = Math.min(9, this.multiplier + 2);
          this.comboTimer = this.comboWindow; // Extend combo
          this.funMeter = Math.min(100, this.funMeter + 20);
          pickedUp = true;
        }

        if (pickedUp) {
          drop.collected = true;
          this.itemDrops.splice(i, 1);
        }
      }
    }
  }

  switchToSoldier(index) {
    // Validate index
    if (index < 0 || index >= this.teammates.length) return false;

    const targetSoldier = this.teammates[index];

    // Can't switch to dead soldiers
    if (targetSoldier.isDead) return false;

    // Already controlling this soldier
    if (index === this.controlledSoldierIndex) return false;

    // Make current player an AI
    const currentSoldier = this.teammates[this.controlledSoldierIndex];
    currentSoldier.isLocal = false;
    currentSoldier.isAI = true;
    // Clear movement inputs
    currentSoldier.moveUp = false;
    currentSoldier.moveDown = false;
    currentSoldier.moveLeft = false;
    currentSoldier.moveRight = false;
    currentSoldier.isFiring = false;
    currentSoldier.moveTargetX = null;
    currentSoldier.moveTargetY = null;

    // Make target soldier player-controlled
    targetSoldier.isLocal = true;
    targetSoldier.isAI = false;

    // Update references
    this.controlledSoldierIndex = index;
    this.player = targetSoldier;

    // Show feedback message
    const soldierName = targetSoldier.name || `Soldier ${index + 1}`;
    this.showQuickMessage(`Now controlling: ${soldierName}`);

    return true;
  }

  cycleSoldier(direction = 1) {
    // Find next alive soldier
    const count = this.teammates.length;
    let nextIndex = this.controlledSoldierIndex;

    for (let i = 0; i < count; i++) {
      nextIndex = (nextIndex + direction + count) % count;
      if (!this.teammates[nextIndex].isDead) {
        return this.switchToSoldier(nextIndex);
      }
    }
    return false;
  }

  selectSoldierAtPosition(worldX, worldY) {
    // Check if clicking on any teammate
    for (let i = 0; i < this.teammates.length; i++) {
      const tm = this.teammates[i];
      if (tm.isDead) continue;

      const dist = utils.distance(worldX, worldY, tm.x, tm.y);
      if (dist <= tm.radius + 5) { // Small tolerance for easier clicking
        return this.switchToSoldier(i);
      }
    }
    return false;
  }

  handleGrenadeExplosion(grenade) {
    const x = grenade.x;
    const y = grenade.y;

    switch (grenade.type) {
      case 'frag':
        sound.play('explosion');
        this.screenShake = 15;
        this.level.breachWall(x, y, CONFIG.FRAG_RADIUS * 0.3);

        // Spawn explosion area effect visualization
        this.explosionEffects.push(new ExplosionEffect(x, y, CONFIG.FRAG_RADIUS));

        // Damage entities
        for (const entity of [...this.teammates, ...this.enemies]) {
          const dist = utils.distance(x, y, entity.x, entity.y);
          if (dist < CONFIG.FRAG_RADIUS) {
            const damage = CONFIG.FRAG_DAMAGE * (1 - dist / CONFIG.FRAG_RADIUS);
            const wasAlive = !entity.isDead;
            entity.takeDamage(damage, x, y);

            // Spawn drops if enemy just died
            if (wasAlive && entity.isDead && this.enemies.includes(entity)) {
              this.spawnEnemyDrops(entity);
            }
          }
        }

        // Explosion particles with enhanced types
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 4 + Math.random() * 6;
          this.particles.push(new Particle(
            x, y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            '#ff6600',
            25 + Math.random() * 20,
            4 + Math.random() * 3,
            'explosion'
          ));
        }
        for (let i = 0; i < 15; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 5 + Math.random() * 8;
          this.particles.push(new Particle(
            x, y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            '#ffaa00',
            15 + Math.random() * 15,
            1.5 + Math.random() * 1.5,
            'spark'
          ));
        }
        for (let i = 0; i < 8; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 3 + Math.random() * 5;
          this.particles.push(new Particle(
            x, y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed - 2,
            '#444444',
            35 + Math.random() * 25,
            3 + Math.random() * 4,
            'debris'
          ));
        }
        break;

      case 'smoke':
        this.smokeClouds.push(new SmokeCloud(x, y));
        break;
    }
  }

  notifyEnemiesOfSound(x, y, loudness) {
    for (const enemy of this.enemies) {
      enemy.hearSound(x, y, loudness);
    }
  }

  spawnBlood(x, y) {
    const bloodColors = ['#aa0000', '#880000', '#cc0000', '#660000', '#990000'];
    for (let i = 0; i < CONFIG.BLOOD_PARTICLES + 4; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;
      const color = bloodColors[Math.floor(Math.random() * bloodColors.length)];
      const size = 2 + Math.random() * 3;
      this.particles.push(new Particle(
        x + (Math.random() - 0.5) * 4, 
        y + (Math.random() - 0.5) * 4,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        color,
        25 + Math.random() * 25,
        size,
        'blood'
      ));
    }
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;
      this.particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        '#550000',
        40 + Math.random() * 30,
        4 + Math.random() * 3,
        'blood'
      ));
    }
  }

  spawnSparks(x, y) {
    const sparkColors = ['#ffcc00', '#ffaa00', '#ff8800', '#ffffff', '#ffff66'];
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 5;
      const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
      this.particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        color,
        15 + Math.random() * 15,
        1 + Math.random() * 1.5,
        'spark'
      ));
    }
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      this.particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        '#555555',
        20 + Math.random() * 15,
        2 + Math.random() * 2,
        'debris'
      ));
    }
  }

  spawnEnemyDrops(enemy) {
    const isBoss = enemy.isBoss === true;

    // Boss drops - guaranteed and enhanced
    if (isBoss) {
      // Always drop weapon
      if (enemy.weapon && enemy.weapon.type) {
        this.itemDrops.push(new ItemDrop(enemy.x, enemy.y, 'weapon', enemy.weapon.type));
      }

      // Guaranteed ammo drops - lots of it
      for (let i = 0; i < 3; i++) {
        const ammoAmount = Math.floor(40 + Math.random() * 40); // 40-80 rounds
        this.itemDrops.push(new ItemDrop(
          enemy.x + (Math.random() - 0.5) * 40,
          enemy.y + (Math.random() - 0.5) * 40,
          'ammo',
          enemy.weapon.type,
          ammoAmount
        ));
      }

      // Guaranteed grenades - multiple
      for (let i = 0; i < 2; i++) {
        this.itemDrops.push(new ItemDrop(
          enemy.x + (Math.random() - 0.5) * 50,
          enemy.y + (Math.random() - 0.5) * 50,
          'grenade',
          'frag',
          2 // 2 grenades per drop
        ));
      }

      // Guaranteed health pack - large
      this.itemDrops.push(new ItemDrop(
        enemy.x + (Math.random() - 0.5) * 45,
        enemy.y + (Math.random() - 0.5) * 45,
        'health',
        null,
        50 // 50 HP restore
      ));

      // Bonus weapon drops - random other weapons
      const bonusWeapons = ['rifle', 'shotgun'];
      for (const weaponType of bonusWeapons) {
        this.itemDrops.push(new ItemDrop(
          enemy.x + (Math.random() - 0.5) * 60,
          enemy.y + (Math.random() - 0.5) * 60,
          'weapon',
          weaponType
        ));
      }

      return; // Boss drops are complete
    }

    // Regular enemy drops
    // Enemies always drop their weapon
    if (enemy.weapon && enemy.weapon.type) {
      this.itemDrops.push(new ItemDrop(enemy.x, enemy.y, 'weapon', enemy.weapon.type));
    }

    // 70% chance to drop ammo for their weapon type
    if (Math.random() < 0.7) {
      const ammoAmount = Math.floor(20 + Math.random() * 30); // 20-50 rounds
      this.itemDrops.push(new ItemDrop(
        enemy.x + (Math.random() - 0.5) * 20,
        enemy.y + (Math.random() - 0.5) * 20,
        'ammo',
        enemy.weapon.type,
        ammoAmount
      ));
    }

    // 30% chance to drop a grenade
    if (Math.random() < 0.3) {
      const grenadeType = Math.random() < 0.7 ? 'frag' : 'smoke';
      this.itemDrops.push(new ItemDrop(
        enemy.x + (Math.random() - 0.5) * 25,
        enemy.y + (Math.random() - 0.5) * 25,
        'grenade',
        grenadeType,
        1
      ));
    }

    // 15% chance to drop health pack
    if (Math.random() < 0.15) {
      this.itemDrops.push(new ItemDrop(
        enemy.x + (Math.random() - 0.5) * 30,
        enemy.y + (Math.random() - 0.5) * 30,
        'health',
        null,
        30 // HP restore amount
      ));
    }
  }

  checkItemPickups(entity) {
    if (entity.isDead) return;

    for (const drop of this.itemDrops) {
      if (drop.collected) continue;
      const dx = drop.x - entity.x;
      const dy = drop.y - entity.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 40) continue;

      // Found a nearby item
      switch (drop.type) {
        case 'weapon':
          // Check if player already has this weapon type
          const hasWeapon = entity.weapons.some(w => w.type === drop.subtype);
          if (!hasWeapon && entity.weapons.length < 2) {
            // Add new weapon
            entity.weapons.push(entity.createWeapon(drop.subtype));
            drop.collected = true;
          } else if (hasWeapon) {
            // Already have this weapon, add ammo instead
            const weapon = entity.weapons.find(w => w.type === drop.subtype);
            if (weapon) {
              const template = CONFIG.WEAPONS[drop.subtype];
              weapon.reserveAmmo += template.magSize * 2;
              drop.collected = true;
            }
          }
          break;

        case 'ammo':
          // Add ammo to matching weapon type
          const weapon = entity.weapons.find(w => w.type === drop.subtype);
          if (weapon) {
            weapon.reserveAmmo += drop.amount;
            drop.collected = true;
          }
          break;

        case 'grenade':
          entity.grenades[drop.subtype] = Math.min(
            (entity.grenades[drop.subtype] || 0) + drop.amount,
            10 // Max 10 of each grenade type
          );
          drop.collected = true;
          break;

        case 'health':
          if (entity.hp < 100) {
            entity.hp = Math.min(entity.hp + drop.amount, 100);
            drop.collected = true;
          }
          break;
      }
    }

    // Remove collected items
    this.itemDrops = this.itemDrops.filter(d => !d.collected);
  }

  checkMissionStatus() {
    // All enemies dead = win
    if (this.enemies.every(e => e.isDead)) {
      this.missionComplete = true;
      if (this.isMultiplayer) {
        multiplayer.stopSync();
      }
    }

    // Check for mission failure
    if (this.isMultiplayer) {
      // In multiplayer, fail only if all human players are dead
      const allHumansDead = this.teammates
        .filter(t => !t.isAI)
        .every(t => t.isDead);
      if (allHumansDead) {
        this.missionFailed = true;
        multiplayer.stopSync();
      }
    } else {
      // Single player - fail if player is dead
      if (this.player.isDead) {
        this.missionFailed = true;
      }
    }
  }

  updateHUD() {
    const w = this.player.weapon;
    document.getElementById('weapon-name').textContent = w.name;
    document.getElementById('ammo-count').textContent = `${w.ammo}/${w.reserveAmmo}`;
    
    const healthPercent = (this.player.hp / this.player.maxHp) * 100;
    document.getElementById('health-fill').style.width = `${healthPercent}%`;
    
    const hpText = document.getElementById('hp-text');
    if (hpText) {
      hpText.textContent = Math.round(this.player.hp);
    }

    const g = this.player.grenades;
    document.getElementById('grenade-count').textContent =
      `${this.player.selectedGrenade.toUpperCase()}: ${g[this.player.selectedGrenade]}`;
  }

  draw() {
    const ctx = this.ctx;

    // Screen shake
    ctx.save();
    if (this.screenShake > 1) {
      ctx.translate(
        (Math.random() - 0.5) * this.screenShake,
        (Math.random() - 0.5) * this.screenShake
      );
    }

    // Apply camera translation
    ctx.translate(-this.cameraX, -this.cameraY);

    // Clear (larger area for map)
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(this.cameraX, this.cameraY, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // Level
    this.level.draw(ctx);

    // Shell casings
    for (const c of this.shellCasings) c.draw(ctx);

    // Smoke clouds
    for (const smoke of this.smokeClouds) smoke.draw(ctx);

    // Explosion effects (area visualization)
    for (const effect of this.explosionEffects) effect.draw(ctx);

    // Grenades
    for (const g of this.grenades) g.draw(ctx);

    // Breach charges
    for (const bc of this.breachCharges) bc.draw(ctx);

    // Enemies (only draw if visible through fog of war)
    for (const enemy of this.enemies) {
      if (!enemy.isDead) {
        const isVisible = this.level.isCurrentlyVisible(
          enemy.x, enemy.y,
          this.player.x, this.player.y,
          this.teammates
        );
        if (isVisible) {
          enemy.draw(ctx);
        }
      } else {
        enemy.draw(ctx); // Always show dead enemies
      }
    }

    // Teammates
    for (const tm of this.teammates) tm.draw(ctx);

    // Draw highlight for controlled soldier
    this.drawControlledSoldierHighlight(ctx);

    // Draw order indicators for AI teammates
    this.drawOrderIndicators(ctx);

    // Bullets
    for (const bullet of this.bullets) bullet.draw(ctx);

    // Particles (with special rendering for new types)
    for (const p of this.particles) {
      if (p.type === 'confetti') {
        // Confetti particles (colored squares rotating)
        const alpha = p.life / p.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
        ctx.globalAlpha = 1;
      } else if (p.type === 'cheer') {
        // Cheer text particles (floating text)
        const alpha = p.life / p.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.font = `bold ${p.size || 12}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(p.text, p.x, p.y);
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
        ctx.globalAlpha = 1;
      } else {
        // Standard particle drawing
        p.draw(ctx);
      }
    }

    // Item drops
    for (const drop of this.itemDrops) drop.draw(ctx);

    // Grenade aiming indicator
    this.drawGrenadeAimIndicator(ctx);

    // Draw fog of war overlay
    this.level.drawFogOfWar(ctx, this.player.x, this.player.y, this.teammates);

    ctx.restore();

    // Flash overlay
    if (this.flashOverlay > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.flashOverlay / 255})`;
      ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    }

    // Player flash effect
    if (this.player.flashedTimer > 0) {
      const intensity = this.player.flashedTimer / CONFIG.FLASH_DURATION;
      ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.8})`;
      ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    }

    // Draw minimap (always on top, not affected by camera)
    this.drawMinimap(ctx);

    // Draw controlled soldier HUD
    this.drawControlledSoldierHUD(ctx);

    // Mission overlays
    if (this.missionComplete) {
      this.drawOverlay(ctx, 'MISSION COMPLETE', '#00ff00');
    } else if (this.missionFailed) {
      this.drawOverlay(ctx, 'MISSION FAILED', '#ff0000');
    }
  }

  drawMinimap(ctx) {
    const minimapWidth = 200;
    const minimapHeight = 140;
    const minimapX = CONFIG.CANVAS_WIDTH - minimapWidth - 10;
    const minimapY = 10;
    const scaleX = minimapWidth / CONFIG.MAP_WIDTH;
    const scaleY = minimapHeight / CONFIG.MAP_HEIGHT;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(minimapX, minimapY, minimapWidth, minimapHeight);

    // Border
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.strokeRect(minimapX, minimapY, minimapWidth, minimapHeight);

    // Draw walls (only in discovered areas)
    ctx.fillStyle = '#666';
    for (const wall of this.level.walls) {
      if (wall.destroyed) continue;
      // Only show if area is discovered
      if (!this.level.isDiscovered(wall.x + wall.w/2, wall.y + wall.h/2)) continue;
      ctx.fillRect(
        minimapX + wall.x * scaleX,
        minimapY + wall.y * scaleY,
        Math.max(1, wall.w * scaleX),
        Math.max(1, wall.h * scaleY)
      );
    }

    // Draw doors (only in discovered areas)
    for (const door of this.level.doors) {
      if (door.destroyed) continue;
      // Only show if area is discovered
      if (!this.level.isDiscovered(door.x + door.w/2, door.y + door.h/2)) continue;
      ctx.fillStyle = door.open ? '#333' : '#654321';
      ctx.fillRect(
        minimapX + door.x * scaleX,
        minimapY + door.y * scaleY,
        Math.max(1, door.w * scaleX),
        Math.max(1, door.h * scaleY)
      );
    }

    // Draw objectives (only in discovered areas)
    for (const obj of this.level.objectives) {
      if (obj.secured) continue;
      // Only show if area is discovered
      if (!this.level.isDiscovered(obj.x, obj.y)) continue;
      const colors = { hostage: '#ffff00', intel: '#00ff00', bomb: '#ff0000' };
      ctx.fillStyle = colors[obj.type] || '#ffff00';
      ctx.beginPath();
      ctx.arc(minimapX + obj.x * scaleX, minimapY + obj.y * scaleY, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw enemies (red dots) - only if currently visible
    ctx.fillStyle = '#ff0000';
    for (const enemy of this.enemies) {
      if (enemy.isDead) continue;
      // Only show enemies in currently visible areas
      const isVisible = this.level.isCurrentlyVisible(
        enemy.x, enemy.y,
        this.player.x, this.player.y,
        this.teammates
      );
      if (!isVisible) continue;
      ctx.beginPath();
      ctx.arc(minimapX + enemy.x * scaleX, minimapY + enemy.y * scaleY, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw teammates (blue dots)
    ctx.fillStyle = '#4a7cc9';
    for (const tm of this.teammates) {
      if (tm.isDead || tm.isLocal) continue;
      ctx.beginPath();
      ctx.arc(minimapX + tm.x * scaleX, minimapY + tm.y * scaleY, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw player (white dot, larger)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(minimapX + this.player.x * scaleX, minimapY + this.player.y * scaleY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw fog of war overlay on minimap
    const fogGridSize = this.level.fogGridSize;
    const fogScaleX = minimapWidth / CONFIG.MAP_WIDTH;
    const fogScaleY = minimapHeight / CONFIG.MAP_HEIGHT;
    for (let cellY = 0; cellY < this.level.fogGridHeight; cellY++) {
      for (let cellX = 0; cellX < this.level.fogGridWidth; cellX++) {
        const discovered = this.level.discoveredGrid[cellY * this.level.fogGridWidth + cellX];
        if (!discovered) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(
            minimapX + cellX * fogGridSize * fogScaleX,
            minimapY + cellY * fogGridSize * fogScaleY,
            fogGridSize * fogScaleX + 1,
            fogGridSize * fogScaleY + 1
          );
        }
      }
    }

    // Draw viewport rectangle
    ctx.strokeStyle = '#ffffff44';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      minimapX + this.cameraX * scaleX,
      minimapY + this.cameraY * scaleY,
      CONFIG.CANVAS_WIDTH * scaleX,
      CONFIG.CANVAS_HEIGHT * scaleY
    );
  }

  drawControlledSoldierHUD(ctx) {
    if (!this.player) return;

    // Draw soldier info in top-left corner
    const padding = 10;
    const boxX = padding;
    const boxY = padding;
    const boxWidth = 200;
    const boxHeight = 80;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Border
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Soldier name
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    const name = this.player.name || 'Player';
    ctx.fillText(`Controlling: ${name}`, boxX + 10, boxY + 25);

    // Key hint
    ctx.fillStyle = '#aaaaaa';
    ctx.font = '12px monospace';
    ctx.fillText('TAB: Cycle soldiers', boxX + 10, boxY + 45);
    ctx.fillText('F1-F4: Direct select', boxX + 10, boxY + 62);

    // Show count of alive teammates
    const aliveCount = this.teammates.filter(tm => !tm.isDead).length;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${aliveCount}/${this.teammates.length}`, boxX + boxWidth - 10, boxY + 25);
  }

  drawOverlay(ctx, text, color) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(text, CONFIG.CANVAS_WIDTH/2, CONFIG.CANVAS_HEIGHT/2);

    ctx.font = '20px Arial';
    ctx.fillStyle = '#ffffff';
    const restartText = this.isMultiplayer ? 'Press R to return to menu' : 'Press R to restart';
    ctx.fillText(restartText, CONFIG.CANVAS_WIDTH/2, CONFIG.CANVAS_HEIGHT/2 + 50);
  }

  drawGrenadeAimIndicator(ctx) {
    // Only show if player has grenades of selected type
    if (this.player.grenades[this.player.selectedGrenade] <= 0) return;

    const playerX = this.player.x;
    const playerY = this.player.y;
    const targetX = this.mouseX;
    const targetY = this.mouseY;

    // Calculate landing point (same logic as Grenade constructor)
    const angle = utils.angle(playerX, playerY, targetX, targetY);
    const maxThrowDist = 300;
    const actualDist = utils.distance(playerX, playerY, targetX, targetY);
    const throwDist = Math.min(actualDist, maxThrowDist);

    const landingX = playerX + Math.cos(angle) * throwDist;
    const landingY = playerY + Math.sin(angle) * throwDist;

    // Determine color used for trajectory line (not for a circle)
    let color;
    if (this.player.selectedGrenade === 'frag') {
      color = 'rgba(255, 100, 50, 0.5)';
    } else if (this.player.selectedGrenade === 'smoke') {
      color = 'rgba(150, 150, 150, 0.4)';
    } else {
      color = 'rgba(255, 255, 255, 0.4)';
    }

    // Draw trajectory arc (dashed line)
    ctx.strokeStyle = color.replace('0.5', '0.7').replace('0.4', '0.6');
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(playerX, playerY);
    const midX = (playerX + landingX) / 2;
    const midY = (playerY + landingY) / 2 - throwDist * 0.1;
    ctx.quadraticCurveTo(midX, midY, landingX, landingY);
    ctx.stroke();
    ctx.setLineDash([]);

    // No blast-radius circle drawn here

    // Crosshair at landing point
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(landingX - 10, landingY);
    ctx.lineTo(landingX + 10, landingY);
    ctx.moveTo(landingX, landingY - 10);
    ctx.lineTo(landingX, landingY + 10);
    ctx.stroke();
  }

  drawControlledSoldierHighlight(ctx) {
    if (!this.player || this.player.isDead) return;

    // Draw pulsing circle around controlled soldier
    const time = Date.now() / 1000;
    const pulse = Math.sin(time * 3) * 0.3 + 0.7; // Pulsate between 0.4 and 1.0

    ctx.save();
    ctx.strokeStyle = `rgba(0, 255, 0, ${pulse})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.player.x, this.player.y, this.player.radius + 8, 0, Math.PI * 2);
    ctx.stroke();

    // Draw soldier name above head
    ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.lineWidth = 3;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';

    const name = this.player.name || 'Player';
    const nameY = this.player.y - this.player.radius - 45;
    ctx.strokeText(name, this.player.x, nameY);
    ctx.fillText(name, this.player.x, nameY);

    // Draw "[CONTROLLED]" tag
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.font = 'bold 10px monospace';
    const tagY = this.player.y - this.player.radius - 32;
    ctx.strokeText('[CONTROLLED]', this.player.x, tagY);
    ctx.fillText('[CONTROLLED]', this.player.x, tagY);

    ctx.restore();
  }

  drawOrderIndicators(ctx) {
    for (const tm of this.teammates) {
      if (tm.isAI && !tm.isDead) {
        // Draw AI state indicators (suppression bar)
        if (tm.aiState && tm.aiState.suppressionLevel > 20) {
          const barWidth = 30;
          const barHeight = 3;
          const barX = tm.x - barWidth / 2;
          const barY = tm.y - tm.radius - 50;

          // Background
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(barX, barY, barWidth, barHeight);

          // Suppression level (yellow to red)
          const suppRatio = Math.min(1, tm.aiState.suppressionLevel / 100);
          const r = 255;
          const g = Math.floor(255 * (1 - suppRatio));
          ctx.fillStyle = `rgb(${r}, ${g}, 0)`;
          ctx.fillRect(barX, barY, barWidth * suppRatio, barHeight);
        }

        // Draw order icon above teammate's head
        const iconY = tm.y - tm.radius - 35;
        const iconSize = 8;

        // Order-specific colors and shapes
        switch (tm.currentOrder) {
          case 'stay':
            // Red square for stay
            ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.fillRect(tm.x - iconSize/2, iconY - iconSize/2, iconSize, iconSize);
            ctx.strokeRect(tm.x - iconSize/2, iconY - iconSize/2, iconSize, iconSize);
            break;

          case 'guard':
            // Orange shield for guard
            ctx.fillStyle = 'rgba(255, 165, 0, 0.8)';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(tm.x, iconY - iconSize);
            ctx.lineTo(tm.x + iconSize, iconY);
            ctx.lineTo(tm.x + iconSize/2, iconY + iconSize/2);
            ctx.lineTo(tm.x, iconY + iconSize);
            ctx.lineTo(tm.x - iconSize/2, iconY + iconSize/2);
            ctx.lineTo(tm.x - iconSize, iconY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Draw guard radius indicator
            if (tm.orderPosition) {
              ctx.strokeStyle = 'rgba(255, 165, 0, 0.3)';
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);
              ctx.beginPath();
              ctx.arc(tm.orderPosition.x, tm.orderPosition.y, tm.guardRadius, 0, Math.PI * 2);
              ctx.stroke();
              ctx.setLineDash([]);
            }
            break;

          case 'cover':
            // Purple crosshairs for cover
            ctx.strokeStyle = 'rgba(200, 100, 255, 0.9)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(tm.x - iconSize, iconY);
            ctx.lineTo(tm.x + iconSize, iconY);
            ctx.moveTo(tm.x, iconY - iconSize);
            ctx.lineTo(tm.x, iconY + iconSize);
            ctx.stroke();

            // Draw line to cover target
            if (tm.coverTarget) {
              ctx.strokeStyle = 'rgba(200, 100, 255, 0.4)';
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);
              ctx.beginPath();
              ctx.moveTo(tm.x, tm.y);
              ctx.lineTo(tm.coverTarget.x, tm.coverTarget.y);
              ctx.stroke();
              ctx.setLineDash([]);

              // Draw target position marker
              ctx.fillStyle = 'rgba(200, 100, 255, 0.3)';
              ctx.strokeStyle = 'rgba(200, 100, 255, 0.7)';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(tm.coverTarget.x, tm.coverTarget.y, 15, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
            }
            break;

          case 'follow':
          default:
            // Green arrow for follow
            ctx.fillStyle = 'rgba(100, 255, 100, 0.8)';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(tm.x, iconY - iconSize);
            ctx.lineTo(tm.x - iconSize, iconY + iconSize/2);
            ctx.lineTo(tm.x - iconSize/3, iconY + iconSize/2);
            ctx.lineTo(tm.x - iconSize/3, iconY + iconSize);
            ctx.lineTo(tm.x + iconSize/3, iconY + iconSize);
            ctx.lineTo(tm.x + iconSize/3, iconY + iconSize/2);
            ctx.lineTo(tm.x + iconSize, iconY + iconSize/2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        }

        // Draw order text label
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.font = 'bold 9px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        const orderText = tm.currentOrder.toUpperCase();
        ctx.strokeText(orderText, tm.x, iconY - 12);
        ctx.fillText(orderText, tm.x, iconY - 12);
      }
    }
  }

  handleKeyDown(e) {
    // Handle ESC for pause menu (even when paused)
    if (e.key === 'Escape') {
      e.preventDefault();
      // Close save/load menu if open
      const saveLoadMenu = document.getElementById('save-load-menu');
      if (saveLoadMenu && saveLoadMenu.style.display !== 'none') {
        this.hideSaveLoadMenu();
        return;
      }
      // Toggle pause menu
      if (this.isRunning && !this.isMultiplayer) {
        if (this.isPaused) {
          this.resumeGame();
        } else {
          this.showPauseMenu();
        }
      }
      return;
    }

    // Handle F5 for quicksave (only in single player)
    if (e.key === 'F5' && this.isRunning && !this.isMultiplayer && !this.isPaused) {
      e.preventDefault();
      const result = this.saveCurrentGame('Quicksave', 'quicksave');
      if (result.success) {
        this.showQuickMessage('Game saved!');
      }
      return;
    }

    // Handle F9 for quickload
    if (e.key === 'F9') {
      e.preventDefault();
      const result = this.loadSavedGame('quicksave');
      if (!result.success) {
        this.showQuickMessage('No quicksave found');
      }
      return;
    }

    if (!this.isRunning || this.isPaused) return;

    const key = e.key.toLowerCase();

    switch(key) {
      case 'w': case 'arrowup': this.player.moveUp = true; break;
      case 's': case 'arrowdown': this.player.moveDown = true; break;
      case 'a': case 'arrowleft': this.player.moveLeft = true; break;
      case 'd': case 'arrowright': this.player.moveRight = true; break;
      case 'shift': this.player.isSprinting = true; break;
      case 'c':
        this.player.stance = this.player.stance === 'stand' ? 'crouch' :
                            this.player.stance === 'crouch' ? 'prone' : 'stand';
        break;
      case 'q': this.player.targetLean = -1; break;
      case 'e': this.player.targetLean = 1; break;
      case 'r':
        if (this.missionComplete || this.missionFailed) {
          // Go back to menu on restart
          this.isRunning = false;
          if (this.isMultiplayer) {
            multiplayer.leaveRoom();
          }
          this.showMenu();
        } else {
          this.player.reload();
        }
        break;
      case '1': case '2':
        this.player.currentWeapon = parseInt(key) - 1;
        break;
      case 'g':
        const grenade = this.player.throwGrenade(this.mouseX, this.mouseY);
        if (grenade) {
          this.grenades.push(grenade);
          this.notifyEnemiesOfSound(this.player.x, this.player.y, 0.5);
        }
        break;
      case 'h':
        this.player.cycleGrenade();
        break;
      case 'f':
        // Interact - open doors
        this.level.openDoor(this.player.x, this.player.y, 40);
        break;
      case 't':
        // Cycle team formation
        this.cycleFormation();
        break;
      case 'z':
        // Order: Follow me
        this.giveOrderToTeam('follow');
        break;
      case 'x':
        // Order: Stay here
        this.giveOrderToTeam('stay');
        break;
      case 'b':
        // Order: Guard this area
        this.giveOrderToTeam('guard');
        break;
      case 'v':
        // Order: Cover me (move to mouse position)
        this.giveOrderToTeam('cover');
        break;
      case 'tab':
        // Cycle through soldiers
        e.preventDefault();
        this.cycleSoldier(e.shiftKey ? -1 : 1);
        break;
    }

    // Handle F1-F4 for direct soldier selection (not lowercase)
    if (e.key === 'F1') { e.preventDefault(); this.switchToSoldier(0); }
    if (e.key === 'F2') { e.preventDefault(); this.switchToSoldier(1); }
    if (e.key === 'F3') { e.preventDefault(); this.switchToSoldier(2); }
    if (e.key === 'F4') { e.preventDefault(); this.switchToSoldier(3); }
  }

  handleKeyUp(e) {
    if (!this.isRunning) return;

    const key = e.key.toLowerCase();

    switch(key) {
      case 'w': case 'arrowup': this.player.moveUp = false; break;
      case 's': case 'arrowdown': this.player.moveDown = false; break;
      case 'a': case 'arrowleft': this.player.moveLeft = false; break;
      case 'd': case 'arrowright': this.player.moveRight = false; break;
      case 'shift': this.player.isSprinting = false; break;
      case 'q': case 'e': this.player.targetLean = 0; break;
    }
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseScreenX = e.clientX - rect.left;
    this.mouseScreenY = e.clientY - rect.top;
    // World coordinates are calculated in updateCamera()
    this.mouseX = this.mouseScreenX + this.cameraX;
    this.mouseY = this.mouseScreenY + this.cameraY;
  }

  handleMouseDown(e) {
    sound.init();
    sound.resume();

    if (!this.isRunning || this.player.isDead) return;

    if (e.button === 0) {
      // Left click - move to position
      this.player.moveTargetX = this.mouseX;
      this.player.moveTargetY = this.mouseY;
    } else if (e.button === 2) {
      // Right click - fire
      this.player.isFiring = true;
      const result = this.player.fire();
      if (result) {
        this.bullets.push(...result.bullets);
        this.shellCasings.push(result.casing);
        this.notifyEnemiesOfSound(this.player.x, this.player.y, 1);
      }
    }
  }

  handleMouseUp(e) {
    if (e.button === 2) {
      // Right click release - stop firing
      this.player.isFiring = false;
    }
  }

  handleMouseWheel(e) {
    if (!this.isRunning || this.player.isDead) return;
    e.preventDefault();

    // Scroll up/down to change weapons
    if (e.deltaY < 0) {
      // Scroll up - previous weapon
      this.player.currentWeapon = (this.player.currentWeapon - 1 + this.player.weapons.length) % this.player.weapons.length;
    } else if (e.deltaY > 0) {
      // Scroll down - next weapon
      this.player.currentWeapon = (this.player.currentWeapon + 1) % this.player.weapons.length;
    }
  }

  // =========================================================================
  // SAVE/LOAD SYSTEM
  // =========================================================================

  // Serialize player state
  serializePlayer(player) {
    return {
      id: player.id,
      x: player.x,
      y: player.y,
      angle: player.angle,
      hp: player.hp,
      maxHp: player.maxHp,
      isDead: player.isDead,
      bleeding: player.bleeding,
      stance: player.stance,
      lean: player.lean,
      isADS: player.isADS,
      weapons: player.weapons.map(w => ({
        type: w.type,
        ammo: w.ammo,
        reserveAmmo: w.reserveAmmo
      })),
      currentWeapon: player.currentWeapon,
      grenades: { ...player.grenades },
      selectedGrenade: player.selectedGrenade,
      isLocal: player.isLocal,
      isAI: player.isAI,
      name: player.name
    };
  }

  // Deserialize player state
  deserializePlayer(data, player) {
    player.x = data.x;
    player.y = data.y;
    player.angle = data.angle;
    player.hp = data.hp;
    player.maxHp = data.maxHp;
    player.isDead = data.isDead;
    player.bleeding = data.bleeding || 0;
    player.stance = data.stance;
    player.lean = data.lean || 0;
    player.targetLean = data.lean || 0;
    player.isADS = data.isADS || false;
    player.currentWeapon = data.currentWeapon;
    player.grenades = { ...data.grenades };
    player.selectedGrenade = data.selectedGrenade || 'frag';

    // Restore weapons
    data.weapons.forEach((w, i) => {
      if (player.weapons[i]) {
        player.weapons[i].ammo = w.ammo;
        player.weapons[i].reserveAmmo = w.reserveAmmo;
      }
    });
  }

  // Serialize enemy state
  serializeEnemy(enemy) {
    return {
      id: enemy.id,
      x: enemy.x,
      y: enemy.y,
      angle: enemy.angle,
      hp: enemy.hp,
      maxHp: enemy.maxHp,
      isDead: enemy.isDead,
      state: enemy.state,
      weapon: {
        type: enemy.weapon.type,
        ammo: enemy.weapon.ammo,
        reserveAmmo: enemy.weapon.reserveAmmo
      },
      patrolPoints: enemy.patrolPoints,
      patrolIndex: enemy.patrolIndex,
      lastKnownTargetPos: enemy.lastKnownTargetPos
    };
  }

  // Deserialize enemy state
  deserializeEnemy(data, enemy) {
    enemy.x = data.x;
    enemy.y = data.y;
    enemy.angle = data.angle;
    enemy.hp = data.hp;
    enemy.maxHp = data.maxHp;
    enemy.isDead = data.isDead;
    enemy.state = data.state || 'patrol';
    enemy.weapon.ammo = data.weapon.ammo;
    enemy.weapon.reserveAmmo = data.weapon.reserveAmmo;
    enemy.patrolPoints = data.patrolPoints || [];
    enemy.patrolIndex = data.patrolIndex || 0;
    enemy.lastKnownTargetPos = data.lastKnownTargetPos;
  }

  // Serialize level state (doors)
  serializeLevel() {
    return {
      mapType: this.level.mapType,
      mapName: this.level.mapName,
      doors: this.level.doors.map(d => ({
        x: d.x,
        y: d.y,
        isOpen: d.isOpen
      }))
    };
  }

  // Get full game state for saving
  getGameStateForSave() {
    return {
      mapType: this.level.mapType,
      mapName: this.level.mapName,
      cameraX: this.cameraX,
      cameraY: this.cameraY,
      currentFormation: this.currentFormation,
      missionComplete: this.missionComplete,
      missionFailed: this.missionFailed,
      player: this.serializePlayer(this.player),
      teammates: this.teammates.filter(t => t !== this.player).map(t => this.serializePlayer(t)),
      enemies: this.enemies.map(e => this.serializeEnemy(e)),
      level: this.serializeLevel()
    };
  }

  // Save current game
  saveCurrentGame(saveName = null, slotId = null) {
    if (!this.isRunning || this.isMultiplayer) {
      return { success: false, error: 'Cannot save in current state' };
    }

    const gameState = this.getGameStateForSave();
    return saveManager.saveGame(gameState, slotId, saveName);
  }

  // Load a saved game
  loadSavedGame(saveId) {
    const result = saveManager.loadGame(saveId);
    if (!result.success) {
      return result;
    }

    const data = result.data;

    // Initialize sound
    sound.init();
    sound.resume();

    // Ensure single player mode
    this.isMultiplayer = false;
    this.remotePlayers.clear();
    this.playerIdToEntity.clear();

    // Show game screen
    document.getElementById('menu-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('hud').style.display = 'block';
    this.hideSaveLoadMenu();

    // Create level with saved map type
    this.selectedMap = data.mapType;
    this.level = new Level(data.mapType);

    // Restore door states
    if (data.level && data.level.doors) {
      data.level.doors.forEach((savedDoor, i) => {
        if (this.level.doors[i]) {
          this.level.doors[i].isOpen = savedDoor.isOpen;
        }
      });
    }

    // Restore camera
    this.cameraX = data.cameraX || 0;
    this.cameraY = data.cameraY || 0;
    this.currentFormation = data.currentFormation || 'closeCombat';

    // Create and restore player
    this.player = new Player(data.player.x, data.player.y, true);
    this.deserializePlayer(data.player, this.player);

    // Create and restore teammates
    this.teammates = [this.player];
    if (data.teammates) {
      data.teammates.forEach(tData => {
        const teammate = new Player(tData.x, tData.y, false);
        teammate.isAI = tData.isAI !== false;
        teammate.name = tData.name;
        this.deserializePlayer(tData, teammate);
        this.teammates.push(teammate);
      });
    }

    // Create enemies at saved positions
    this.enemies = [];
    if (data.enemies) {
      data.enemies.forEach(eData => {
        const enemy = new Enemy(eData.x, eData.y);
        this.deserializeEnemy(eData, enemy);
        this.enemies.push(enemy);
      });
    }

    // Clear transient objects
    this.bullets = [];
    this.grenades = [];
    this.particles = [];
    this.shellCasings = [];
    this.smokeClouds = [];
    this.breachCharges = [];
    this.explosionEffects = [];

    // Restore mission state
    this.missionComplete = data.missionComplete || false;
    this.missionFailed = data.missionFailed || false;
    this.isRunning = true;
    this.isPaused = false;

    // Start game loop
    this.gameLoop();

    return { success: true };
  }

  // Show save/load menu
  showSaveLoadMenu(mode = 'save') {
    this.isPaused = true;
    const menu = document.getElementById('save-load-menu');
    const title = document.getElementById('save-load-title');
    const saveNameSection = document.getElementById('save-name-section');

    if (menu) {
      menu.style.display = 'flex';
      title.textContent = mode === 'save' ? 'SAVE GAME' : 'LOAD GAME';
      menu.dataset.mode = mode;

      // Show save name input only for save mode
      if (saveNameSection) {
        saveNameSection.style.display = mode === 'save' ? 'block' : 'none';
      }

      this.populateSaveSlots(mode);
    }
  }

  // Hide save/load menu
  hideSaveLoadMenu() {
    const menu = document.getElementById('save-load-menu');
    if (menu) {
      menu.style.display = 'none';
    }
    if (this.isRunning) {
      this.isPaused = false;
    }
  }

  // Populate save slots in the UI
  populateSaveSlots(mode) {
    const container = document.getElementById('save-slots-container');
    if (!container) return;

    const saves = saveManager.getAllSaves();
    container.innerHTML = '';

    // Add "New Save" option in save mode
    if (mode === 'save') {
      const newSlot = document.createElement('div');
      newSlot.className = 'save-slot new-save';
      newSlot.innerHTML = `
        <div class="save-slot-content">
          <div class="save-name">+ Create New Save</div>
          <div class="save-info">Save to a new slot</div>
        </div>
      `;
      newSlot.addEventListener('click', () => this.handleSaveSlotClick(null, mode));
      container.appendChild(newSlot);
    }

    // Add existing saves
    saves.forEach(save => {
      const slot = document.createElement('div');
      slot.className = 'save-slot';
      slot.dataset.saveId = save.id;

      const date = new Date(save.timestamp);
      const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

      slot.innerHTML = `
        <div class="save-slot-content">
          <div class="save-name">${this.escapeHtml(save.name)}</div>
          <div class="save-info">
            <span class="save-map">${save.mapName || save.mapType}</span>
            <span class="save-hp">HP: ${Math.round(save.playerHp || 100)}</span>
            <span class="save-enemies">Enemies: ${save.enemiesRemaining || '?'}</span>
          </div>
          <div class="save-date">${dateStr}</div>
        </div>
        <div class="save-slot-actions">
          ${mode === 'save' ? '<button class="save-overwrite-btn">Overwrite</button>' : '<button class="save-load-btn">Load</button>'}
          <button class="save-delete-btn">Delete</button>
        </div>
      `;

      // Event listeners
      const actionBtn = slot.querySelector(mode === 'save' ? '.save-overwrite-btn' : '.save-load-btn');
      actionBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleSaveSlotClick(save.id, mode);
      });

      const deleteBtn = slot.querySelector('.save-delete-btn');
      deleteBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleDeleteSave(save.id);
      });

      container.appendChild(slot);
    });

    // Show empty state if no saves and in load mode
    if (saves.length === 0 && mode === 'load') {
      const emptyState = document.createElement('div');
      emptyState.className = 'save-slots-empty';
      emptyState.textContent = 'No saved games found';
      container.appendChild(emptyState);
    }
  }

  // Handle save slot click
  handleSaveSlotClick(saveId, mode) {
    if (mode === 'save') {
      const nameInput = document.getElementById('save-name-input');
      const saveName = nameInput?.value.trim() || null;
      const result = this.saveCurrentGame(saveName, saveId);

      if (result.success) {
        this.showSaveLoadMessage('Game saved successfully!', 'success');
        this.populateSaveSlots(mode);
        if (nameInput) nameInput.value = '';
      } else {
        this.showSaveLoadMessage(result.error || 'Failed to save', 'error');
      }
    } else {
      // Load mode
      const result = this.loadSavedGame(saveId);
      if (!result.success) {
        this.showSaveLoadMessage(result.error || 'Failed to load', 'error');
      }
    }
  }

  // Handle delete save
  handleDeleteSave(saveId) {
    if (confirm('Are you sure you want to delete this save?')) {
      const result = saveManager.deleteSave(saveId);
      if (result.success) {
        const mode = document.getElementById('save-load-menu')?.dataset.mode || 'save';
        this.populateSaveSlots(mode);
        this.showSaveLoadMessage('Save deleted', 'success');
      } else {
        this.showSaveLoadMessage(result.error || 'Failed to delete', 'error');
      }
    }
  }

  // Show save/load message
  showSaveLoadMessage(message, type) {
    const msgEl = document.getElementById('save-load-message');
    if (msgEl) {
      msgEl.textContent = message;
      msgEl.className = `save-load-message ${type}`;
      msgEl.style.display = 'block';
      setTimeout(() => {
        msgEl.style.display = 'none';
      }, 3000);
    }
  }

  // Escape HTML for display
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Show pause menu
  showPauseMenu() {
    if (this.isMultiplayer) return; // No pause in multiplayer
    this.isPaused = true;
    document.getElementById('pause-menu').style.display = 'flex';
  }

  // Hide pause menu
  hidePauseMenu() {
    document.getElementById('pause-menu').style.display = 'none';
  }

  // Resume game from pause
  resumeGame() {
    this.isPaused = false;
    this.hidePauseMenu();
    this.hideSaveLoadMenu();
  }

  // Quit to main menu
  quitToMenu() {
    this.isRunning = false;
    this.isPaused = false;
    this.hidePauseMenu();
    this.hideSaveLoadMenu();
    this.showMenu();
  }

  // Show quick message (for quicksave/quickload feedback)
  showQuickMessage(message) {
    // Create or update quick message element
    let msgEl = document.getElementById('quick-message');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.id = 'quick-message';
      msgEl.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: #4caf50;
        padding: 10px 25px;
        border-radius: 4px;
        font-size: 0.9rem;
        z-index: 2000;
        border: 1px solid rgba(76, 175, 80, 0.4);
        font-family: 'Segoe UI', 'Roboto', sans-serif;
      `;
      document.body.appendChild(msgEl);
    }
    msgEl.textContent = message;
    msgEl.style.display = 'block';

    setTimeout(() => {
      msgEl.style.display = 'none';
    }, 2000);
  }
}

// =============================================================================
// SAVE MANAGER CLASS
// =============================================================================

class SaveManager {
  constructor() {
    this.STORAGE_KEY = 'viscera_saves';
    this.MAX_SAVES = 10;
  }

  // Get all saved games
  getAllSaves() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load saves:', e);
      return [];
    }
  }

  // Save a game
  saveGame(gameData, slotId = null, saveName = null) {
    const saves = this.getAllSaves();
    const timestamp = Date.now();
    const id = slotId || `save_${timestamp}`;

    // Generate default name if not provided
    const defaultName = `${gameData.mapName} - ${new Date(timestamp).toLocaleString()}`;

    const saveData = {
      id,
      name: saveName || defaultName,
      timestamp,
      mapType: gameData.mapType,
      mapName: gameData.mapName,
      playerHp: gameData.player.hp,
      enemiesRemaining: gameData.enemies.filter(e => !e.isDead).length,
      gameState: gameData
    };

    // Check if updating existing save
    const existingIndex = saves.findIndex(s => s.id === id);
    if (existingIndex >= 0) {
      saves[existingIndex] = saveData;
    } else {
      // Add new save (limit to MAX_SAVES)
      if (saves.length >= this.MAX_SAVES) {
        // Remove oldest save
        saves.sort((a, b) => b.timestamp - a.timestamp);
        saves.pop();
      }
      saves.unshift(saveData);
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saves));
      return { success: true, saveId: id };
    } catch (e) {
      console.error('Failed to save game:', e);
      return { success: false, error: 'Storage full or unavailable' };
    }
  }

  // Load a game by ID
  loadGame(saveId) {
    const saves = this.getAllSaves();
    const save = saves.find(s => s.id === saveId);
    if (save) {
      return { success: true, data: save.gameState };
    }
    return { success: false, error: 'Save not found' };
  }

  // Delete a save by ID
  deleteSave(saveId) {
    const saves = this.getAllSaves();
    const filteredSaves = saves.filter(s => s.id !== saveId);

    if (filteredSaves.length === saves.length) {
      return { success: false, error: 'Save not found' };
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredSaves));
      return { success: true };
    } catch (e) {
      console.error('Failed to delete save:', e);
      return { success: false, error: 'Failed to delete' };
    }
  }

  // Rename a save
  renameSave(saveId, newName) {
    const saves = this.getAllSaves();
    const save = saves.find(s => s.id === saveId);

    if (!save) {
      return { success: false, error: 'Save not found' };
    }

    save.name = newName;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saves));
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Failed to rename' };
    }
  }
}

// Global save manager instance
const saveManager = new SaveManager();

// =============================================================================
// INITIALIZE
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  window.game = new Game('game-canvas');
});
