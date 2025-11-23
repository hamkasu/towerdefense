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

  // Effects
  MUZZLE_FLASH_DURATION: 3,
  BLOOD_PARTICLES: 6,
  SHELL_CASING_LIFETIME: 120,
};

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
  constructor(x, y, vx, vy, color, life, size = 2) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.color = color;
    this.life = life;
    this.maxLife = life;
    this.size = size;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.life--;
  }

  draw(ctx) {
    const alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
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
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.9;
    this.vy *= 0.9;
    this.rotation += this.rotSpeed;
    this.rotSpeed *= 0.95;
    this.life--;
  }

  draw(ctx) {
    const alpha = Math.min(1, this.life / 30);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#c9a227';
    ctx.fillRect(-3, -1.5, 6, 3);
    ctx.restore();
    ctx.globalAlpha = 1;
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
  random: { name: 'Random Generated', description: 'Procedurally generated layout' }
};

// =============================================================================
// LEVEL CLASS
// =============================================================================

class Level {
  constructor(mapType = 'compound') {
    this.walls = [];
    this.doors = [];
    this.spawnPoints = { team: [], enemy: [] };
    this.objectives = [];
    this.mapType = mapType;
    this.mapName = MAP_TYPES[mapType]?.name || 'Unknown';
    this.generate(mapType);
  }

  generate(mapType) {
    // Clear existing
    this.walls = [];
    this.doors = [];
    this.spawnPoints = { team: [], enemy: [] };
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
    const W = CONFIG.MAP_WIDTH;
    const H = CONFIG.MAP_HEIGHT;

    // Outer walls (concrete)
    this.addWall(0, 0, W, 20, 'concrete');
    this.addWall(0, H-20, W, 20, 'concrete');
    this.addWall(0, 0, 20, H, 'concrete');
    this.addWall(W-20, 0, 20, H, 'concrete');

    // === BUILDING 1: ENTRY (LEFT SIDE) ===
    // Main corridor vertical wall
    this.addWall(400, 20, 15, 450, 'concrete');
    this.addWall(400, 520, 15, 500, 'concrete');
    this.addDoor(400, 470, 15, 50, 'vertical');

    // Room 1A (top left) - Reception
    this.addWall(20, 300, 380, 12, 'drywall');
    this.addDoor(200, 300, 60, 12, 'horizontal');
    this.addWall(200, 20, 12, 280, 'drywall');
    this.addDoor(200, 150, 12, 60, 'vertical');

    // Room 1B (bottom left) - Storage
    this.addWall(20, 600, 380, 12, 'drywall');
    this.addDoor(150, 600, 60, 12, 'horizontal');
    this.addWall(200, 612, 12, 300, 'drywall');
    this.addDoor(200, 750, 12, 60, 'vertical');

    // Room 1C (far bottom left) - Basement
    this.addWall(20, 900, 180, 12, 'concrete');
    this.addDoor(100, 900, 50, 12, 'horizontal');

    // === BUILDING 2: CENTRAL HUB ===
    // Vertical walls
    this.addWall(800, 20, 15, 400, 'concrete');
    this.addWall(800, 470, 15, 500, 'concrete');
    this.addDoor(800, 420, 15, 50, 'vertical');

    // Horizontal connections
    this.addWall(415, 400, 385, 12, 'drywall');
    this.addDoor(550, 400, 60, 12, 'horizontal');
    this.addWall(415, 700, 385, 12, 'drywall');
    this.addDoor(650, 700, 60, 12, 'horizontal');

    // Central rooms
    this.addWall(550, 412, 12, 140, 'drywall');
    this.addDoor(550, 470, 12, 50, 'vertical');
    this.addWall(650, 412, 12, 140, 'drywall');
    this.addDoor(650, 470, 12, 50, 'vertical');

    // Top central area
    this.addWall(550, 150, 12, 200, 'drywall');
    this.addWall(550, 150, 250, 12, 'drywall');
    this.addDoor(680, 150, 60, 12, 'horizontal');
    this.addDoor(550, 250, 12, 50, 'vertical');

    // === BUILDING 3: RIGHT WING ===
    this.addWall(1200, 20, 15, 600, 'concrete');
    this.addWall(1200, 670, 15, 500, 'concrete');
    this.addDoor(1200, 620, 15, 50, 'vertical');

    // Offices right side
    this.addWall(815, 300, 385, 12, 'drywall');
    this.addDoor(1000, 300, 60, 12, 'horizontal');
    this.addWall(1000, 20, 12, 280, 'drywall');
    this.addDoor(1000, 150, 12, 60, 'vertical');

    // Conference room
    this.addWall(815, 550, 385, 15, 'glass');
    this.addDoor(950, 550, 15, 60, 'vertical');

    // Server room (metal)
    this.addWall(900, 800, 300, 12, 'metal');
    this.addWall(900, 800, 12, 200, 'metal');
    this.addWall(900, 1000, 300, 12, 'metal');
    this.addDoor(900, 880, 12, 60, 'vertical');

    // === BUILDING 4: FAR RIGHT COMPOUND ===
    this.addWall(1600, 20, 15, 800, 'concrete');
    this.addWall(1600, 870, 15, 700, 'concrete');
    this.addDoor(1600, 820, 15, 50, 'vertical');

    // Upper compound
    this.addWall(1215, 400, 385, 15, 'concrete');
    this.addDoor(1400, 400, 60, 15, 'horizontal');

    // Research labs
    this.addWall(1400, 20, 12, 380, 'drywall');
    this.addDoor(1400, 200, 12, 60, 'vertical');
    this.addWall(1300, 200, 100, 12, 'glass');

    // Lower compound rooms
    this.addWall(1215, 600, 200, 12, 'drywall');
    this.addDoor(1300, 600, 50, 12, 'horizontal');
    this.addWall(1450, 600, 150, 12, 'drywall');
    this.addDoor(1500, 600, 50, 12, 'horizontal');

    // === BUILDING 5: SOUTHERN COMPLEX ===
    this.addWall(400, 1100, 800, 15, 'concrete');
    this.addDoor(750, 1100, 60, 15, 'horizontal');

    // South rooms
    this.addWall(600, 1115, 12, 300, 'drywall');
    this.addDoor(600, 1200, 12, 60, 'vertical');
    this.addWall(900, 1115, 12, 300, 'drywall');
    this.addDoor(900, 1250, 12, 60, 'vertical');

    // Armory (metal)
    this.addWall(1100, 1115, 12, 200, 'metal');
    this.addWall(1100, 1300, 200, 12, 'metal');
    this.addDoor(1100, 1200, 12, 50, 'vertical');

    // === OUTDOOR AREAS ===
    // Courtyard walls
    this.addWall(1700, 500, 300, 15, 'concrete');
    this.addWall(1700, 500, 15, 400, 'concrete');
    this.addWall(1700, 900, 300, 15, 'concrete');
    this.addDoor(1700, 680, 15, 60, 'vertical');

    // Guard tower
    this.addWall(2200, 200, 200, 15, 'concrete');
    this.addWall(2200, 200, 15, 200, 'concrete');
    this.addWall(2200, 400, 200, 15, 'concrete');
    this.addWall(2400, 200, 15, 200, 'concrete');
    this.addDoor(2200, 280, 15, 60, 'vertical');

    // Warehouse
    this.addWall(2000, 700, 400, 15, 'metal');
    this.addWall(2000, 700, 15, 400, 'metal');
    this.addWall(2000, 1100, 400, 15, 'metal');
    this.addWall(2400, 700, 15, 400, 'metal');
    this.addDoor(2000, 850, 15, 80, 'vertical');
    this.addDoor(2150, 700, 80, 15, 'horizontal');

    // Additional warehouse interior
    this.addWall(2150, 850, 12, 200, 'drywall');
    this.addWall(2300, 800, 12, 150, 'wood');

    // === PERIMETER STRUCTURES ===
    // North fence with gap
    this.addWall(1700, 100, 600, 12, 'concrete');
    this.addWall(2400, 100, 580, 12, 'concrete');

    // East compound
    this.addWall(2600, 300, 15, 600, 'concrete');
    this.addWall(2600, 950, 15, 600, 'concrete');
    this.addDoor(2600, 900, 15, 50, 'vertical');

    this.addWall(2615, 500, 300, 12, 'drywall');
    this.addDoor(2750, 500, 60, 12, 'horizontal');
    this.addWall(2615, 800, 300, 12, 'drywall');
    this.addDoor(2700, 800, 60, 12, 'horizontal');

    // === COVER OBJECTS ===
    // Various cover throughout the map
    this.addWall(500, 200, 40, 20, 'wood');
    this.addWall(700, 550, 50, 20, 'wood');
    this.addWall(1050, 450, 20, 50, 'wood');
    this.addWall(1350, 550, 40, 20, 'wood');
    this.addWall(1800, 650, 30, 30, 'wood');
    this.addWall(2250, 950, 40, 20, 'wood');
    this.addWall(450, 800, 30, 30, 'wood');
    this.addWall(1500, 900, 50, 20, 'wood');
    this.addWall(2100, 350, 30, 40, 'wood');
    this.addWall(2700, 650, 40, 20, 'wood');

    // Glass windows throughout
    this.addWall(250, 100, 100, 8, 'glass');
    this.addWall(600, 80, 8, 60, 'glass');
    this.addWall(1100, 100, 80, 8, 'glass');
    this.addWall(1800, 300, 8, 100, 'glass');
    this.addWall(2500, 400, 80, 8, 'glass');

    // === SPAWN POINTS ===
    this.spawnPoints.team = [
      {x: 60, y: 60}, {x: 100, y: 60}, {x: 60, y: 100}, {x: 100, y: 100}
    ];

    this.spawnPoints.enemy = [
      // Building entrances
      {x: 2850, y: 600}, {x: 2850, y: 700},
      // Guard tower
      {x: 2300, y: 300},
      // Warehouse
      {x: 2200, y: 900}, {x: 2300, y: 1000},
      // Far right compound
      {x: 1500, y: 300}, {x: 1700, y: 700},
      // Central areas
      {x: 1100, y: 900}, {x: 700, y: 500},
      // Roaming
      {x: 1900, y: 400}, {x: 2500, y: 1000},
      {x: 1000, y: 600}, {x: 600, y: 1300}
    ];

    // === OBJECTIVES ===
    this.objectives.push({x: 2850, y: 650, type: 'hostage', secured: false});
    this.objectives.push({x: 2300, y: 950, type: 'intel', secured: false});
    this.objectives.push({x: 1000, y: 900, type: 'bomb', secured: false});
  }

  generateWarehouse() {
    const W = CONFIG.MAP_WIDTH;
    const H = CONFIG.MAP_HEIGHT;

    // Outer walls
    this.addWall(0, 0, W, 20, 'metal');
    this.addWall(0, H-20, W, 20, 'metal');
    this.addWall(0, 0, 20, H, 'metal');
    this.addWall(W-20, 0, 20, H, 'metal');

    // === MAIN WAREHOUSE SECTIONS ===
    // Warehouse A - Left side
    this.addWall(500, 20, 15, 800, 'metal');
    this.addDoor(500, 400, 15, 80, 'vertical');
    this.addWall(20, 400, 480, 15, 'metal');
    this.addDoor(250, 400, 80, 15, 'horizontal');

    // Storage racks (wood)
    for (let i = 0; i < 3; i++) {
      this.addWall(80 + i * 140, 100, 80, 20, 'wood');
      this.addWall(80 + i * 140, 200, 80, 20, 'wood');
      this.addWall(80 + i * 140, 550, 80, 20, 'wood');
      this.addWall(80 + i * 140, 650, 80, 20, 'wood');
    }

    // Warehouse B - Center
    this.addWall(500, 900, 15, 600, 'metal');
    this.addDoor(500, 1100, 15, 80, 'vertical');
    this.addWall(515, 900, 600, 15, 'metal');
    this.addDoor(750, 900, 80, 15, 'horizontal');

    // Central open area with scattered cover
    this.addWall(700, 300, 100, 30, 'wood');
    this.addWall(900, 500, 30, 100, 'wood');
    this.addWall(1100, 200, 80, 30, 'wood');
    this.addWall(1300, 400, 30, 80, 'wood');

    // Warehouse C - Right side
    this.addWall(1500, 20, 15, 900, 'metal');
    this.addDoor(1500, 450, 15, 100, 'vertical');
    this.addWall(1515, 500, 500, 15, 'metal');
    this.addDoor(1700, 500, 100, 15, 'horizontal');

    // Loading docks
    this.addWall(2000, 20, 15, 400, 'concrete');
    this.addWall(2000, 470, 15, 450, 'concrete');
    this.addDoor(2000, 420, 15, 50, 'vertical');

    for (let i = 0; i < 4; i++) {
      this.addWall(2100, 80 + i * 200, 200, 15, 'concrete');
      this.addWall(2100, 150 + i * 200, 200, 15, 'concrete');
    }

    // Office section (top right)
    this.addWall(2200, 900, 15, 600, 'drywall');
    this.addDoor(2200, 1100, 15, 60, 'vertical');
    this.addWall(2215, 900, 300, 12, 'drywall');
    this.addWall(2215, 1100, 300, 12, 'drywall');
    this.addDoor(2350, 1100, 60, 12, 'horizontal');
    this.addWall(2215, 1300, 300, 12, 'drywall');
    this.addDoor(2300, 1300, 60, 12, 'horizontal');

    // Glass windows in office
    this.addWall(2215, 950, 8, 100, 'glass');
    this.addWall(2215, 1150, 8, 100, 'glass');

    // Southern warehouse section
    this.addWall(800, 1200, 15, 500, 'metal');
    this.addDoor(800, 1400, 15, 80, 'vertical');
    this.addWall(1200, 1200, 15, 500, 'metal');
    this.addDoor(1200, 1350, 15, 80, 'vertical');

    // Container yard (bottom)
    for (let i = 0; i < 5; i++) {
      this.addWall(100 + i * 300, 1500, 200, 50, 'metal');
      this.addWall(200 + i * 300, 1700, 200, 50, 'metal');
    }

    // Forklift paths (open corridors)
    this.addWall(600, 1000, 150, 20, 'wood');
    this.addWall(1000, 1050, 150, 20, 'wood');

    // Security booth
    this.addWall(2600, 1000, 200, 15, 'concrete');
    this.addWall(2600, 1000, 15, 200, 'concrete');
    this.addWall(2600, 1200, 200, 15, 'concrete');
    this.addWall(2800, 1000, 15, 200, 'concrete');
    this.addDoor(2600, 1080, 15, 60, 'vertical');
    this.addWall(2620, 1050, 8, 80, 'glass');

    // Spawn points
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

    this.objectives.push({x: 2700, y: 1100, type: 'hostage', secured: false});
    this.objectives.push({x: 300, y: 1650, type: 'intel', secured: false});
    this.objectives.push({x: 1700, y: 250, type: 'bomb', secured: false});
  }

  generateOffice() {
    const W = CONFIG.MAP_WIDTH;
    const H = CONFIG.MAP_HEIGHT;

    // Outer walls
    this.addWall(0, 0, W, 20, 'concrete');
    this.addWall(0, H-20, W, 20, 'concrete');
    this.addWall(0, 0, 20, H, 'concrete');
    this.addWall(W-20, 0, 20, H, 'concrete');

    // === FLOOR 1 STYLE - Grid of offices ===
    const roomWidth = 250;
    const roomHeight = 200;
    const corridorWidth = 100;

    // Main horizontal corridors
    for (let y = 0; y < 4; y++) {
      const corridorY = 300 + y * (roomHeight + corridorWidth);
      this.addWall(20, corridorY, W - 40, 12, 'drywall');
      // Add doors along corridor
      for (let x = 0; x < 8; x++) {
        if (Math.random() > 0.3) {
          this.addDoor(150 + x * 350, corridorY, 60, 12, 'horizontal');
        }
      }
    }

    // Main vertical corridors
    for (let x = 0; x < 5; x++) {
      const corridorX = 400 + x * (roomWidth + corridorWidth + 150);
      if (corridorX < W - 100) {
        this.addWall(corridorX, 20, 12, H - 40, 'drywall');
        // Add doors
        for (let y = 0; y < 5; y++) {
          if (Math.random() > 0.3) {
            this.addDoor(corridorX, 150 + y * 400, 12, 60, 'vertical');
          }
        }
      }
    }

    // Conference rooms (larger rooms with glass)
    // Conference 1
    this.addWall(100, 100, 250, 12, 'glass');
    this.addWall(100, 100, 12, 150, 'drywall');
    this.addWall(350, 100, 12, 150, 'drywall');
    this.addDoor(350, 150, 12, 50, 'vertical');

    // Conference 2
    this.addWall(600, 100, 300, 12, 'glass');
    this.addWall(600, 100, 12, 150, 'drywall');
    this.addWall(900, 100, 12, 150, 'drywall');
    this.addDoor(600, 150, 12, 50, 'vertical');

    // Executive suite (top right)
    this.addWall(2200, 100, 12, 400, 'drywall');
    this.addDoor(2200, 250, 12, 80, 'vertical');
    this.addWall(2200, 100, 600, 12, 'drywall');
    this.addWall(2200, 500, 600, 12, 'drywall');
    this.addWall(2500, 100, 12, 400, 'drywall');
    this.addDoor(2500, 280, 12, 60, 'vertical');
    // Glass windows
    this.addWall(2300, 112, 8, 150, 'glass');
    this.addWall(2600, 112, 8, 150, 'glass');

    // Server room (metal walls)
    this.addWall(1500, 800, 300, 15, 'metal');
    this.addWall(1500, 800, 15, 250, 'metal');
    this.addWall(1500, 1050, 300, 15, 'metal');
    this.addWall(1800, 800, 15, 250, 'metal');
    this.addDoor(1500, 900, 15, 60, 'vertical');

    // Cubicle areas (wood partitions)
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

    // Break room
    this.addWall(2400, 700, 12, 300, 'drywall');
    this.addDoor(2400, 800, 12, 60, 'vertical');
    this.addWall(2400, 700, 400, 12, 'drywall');
    this.addWall(2400, 1000, 400, 12, 'drywall');

    // Reception area (bottom)
    this.addWall(20, 1500, 800, 15, 'glass');
    this.addWall(900, 1500, 800, 15, 'glass');
    this.addDoor(800, 1500, 100, 15, 'horizontal');
    this.addWall(400, 1515, 12, 300, 'drywall');
    this.addWall(800, 1515, 12, 300, 'drywall');
    this.addWall(1200, 1515, 12, 300, 'drywall');

    // Bathrooms
    this.addWall(1800, 1500, 15, 400, 'concrete');
    this.addWall(1815, 1500, 200, 12, 'concrete');
    this.addWall(2015, 1500, 15, 400, 'concrete');
    this.addDoor(1800, 1650, 15, 50, 'vertical');
    this.addWall(1815, 1700, 200, 12, 'drywall');
    this.addDoor(1900, 1700, 50, 12, 'horizontal');

    // Stairwells
    this.addWall(2600, 1400, 200, 15, 'concrete');
    this.addWall(2600, 1400, 15, 400, 'concrete');
    this.addWall(2600, 1800, 200, 15, 'concrete');
    this.addWall(2800, 1400, 15, 400, 'concrete');
    this.addDoor(2600, 1550, 15, 80, 'vertical');

    // Scattered desks/furniture
    this.addWall(1200, 400, 60, 30, 'wood');
    this.addWall(1600, 350, 40, 40, 'wood');
    this.addWall(2000, 600, 50, 30, 'wood');

    // Spawn points
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

    this.objectives.push({x: 2600, y: 300, type: 'hostage', secured: false});
    this.objectives.push({x: 1650, y: 920, type: 'intel', secured: false});
    this.objectives.push({x: 200, y: 150, type: 'bomb', secured: false});
  }

  generateEmbassy() {
    const W = CONFIG.MAP_WIDTH;
    const H = CONFIG.MAP_HEIGHT;

    // Outer walls - thick concrete
    this.addWall(0, 0, W, 25, 'concrete');
    this.addWall(0, H-25, W, 25, 'concrete');
    this.addWall(0, 0, 25, H, 'concrete');
    this.addWall(W-25, 0, 25, H, 'concrete');

    // === MAIN BUILDING ===
    // Perimeter fence (inner)
    this.addWall(200, 200, 2600, 15, 'metal');
    this.addWall(200, 200, 15, 1700, 'metal');
    this.addWall(200, 1900, 2600, 15, 'metal');
    this.addWall(2800, 200, 15, 1700, 'metal');
    // Gates
    this.addDoor(200, 1000, 15, 100, 'vertical');
    this.addDoor(1400, 200, 100, 15, 'horizontal');

    // Main embassy building
    this.addWall(500, 400, 15, 1200, 'concrete');
    this.addWall(2500, 400, 15, 1200, 'concrete');
    this.addWall(500, 400, 2000, 15, 'concrete');
    this.addWall(500, 1600, 2000, 15, 'concrete');
    // Main entrance
    this.addDoor(1400, 1600, 120, 15, 'horizontal');
    // Side entrances
    this.addDoor(500, 900, 15, 80, 'vertical');
    this.addDoor(2500, 900, 15, 80, 'vertical');

    // Grand foyer
    this.addWall(800, 1200, 1400, 15, 'drywall');
    this.addDoor(1400, 1200, 120, 15, 'horizontal');
    // Pillars
    this.addWall(900, 1300, 30, 30, 'concrete');
    this.addWall(1200, 1300, 30, 30, 'concrete');
    this.addWall(1700, 1300, 30, 30, 'concrete');
    this.addWall(2000, 1300, 30, 30, 'concrete');

    // West wing - offices
    this.addWall(800, 415, 12, 785, 'drywall');
    this.addDoor(800, 700, 12, 60, 'vertical');
    this.addDoor(800, 1000, 12, 60, 'vertical');

    // Office rooms
    this.addWall(515, 600, 285, 12, 'drywall');
    this.addDoor(650, 600, 50, 12, 'horizontal');
    this.addWall(515, 800, 285, 12, 'drywall');
    this.addDoor(700, 800, 50, 12, 'horizontal');
    this.addWall(515, 1000, 285, 12, 'drywall');
    this.addDoor(600, 1000, 50, 12, 'horizontal');

    // East wing - secure area
    this.addWall(2200, 415, 12, 785, 'metal');
    this.addDoor(2200, 800, 12, 80, 'vertical');

    // Secure rooms
    this.addWall(2212, 600, 288, 12, 'metal');
    this.addDoor(2350, 600, 60, 12, 'horizontal');
    this.addWall(2212, 900, 288, 12, 'metal');
    this.addDoor(2300, 900, 60, 12, 'horizontal');

    // Safe room (heavily fortified)
    this.addWall(2250, 650, 200, 15, 'metal');
    this.addWall(2250, 650, 15, 200, 'metal');
    this.addWall(2250, 850, 200, 15, 'metal');
    this.addWall(2450, 650, 15, 200, 'metal');
    this.addDoor(2250, 720, 15, 60, 'vertical');

    // Central hall
    this.addWall(1200, 415, 12, 400, 'drywall');
    this.addDoor(1200, 550, 12, 80, 'vertical');
    this.addWall(1800, 415, 12, 400, 'drywall');
    this.addDoor(1800, 600, 12, 80, 'vertical');

    // Ambassador's office (center top)
    this.addWall(1212, 415, 588, 12, 'drywall');
    this.addWall(1400, 500, 12, 300, 'drywall');
    this.addWall(1600, 500, 12, 300, 'drywall');
    this.addDoor(1400, 600, 12, 60, 'vertical');
    this.addDoor(1600, 650, 12, 60, 'vertical');
    // Large windows
    this.addWall(1300, 427, 100, 8, 'glass');
    this.addWall(1600, 427, 100, 8, 'glass');

    // Guard posts
    this.addWall(300, 300, 100, 15, 'concrete');
    this.addWall(300, 300, 15, 100, 'concrete');
    this.addWall(300, 400, 100, 15, 'concrete');
    this.addWall(400, 300, 15, 100, 'concrete');
    this.addDoor(400, 330, 15, 50, 'vertical');

    this.addWall(2600, 300, 100, 15, 'concrete');
    this.addWall(2600, 300, 15, 100, 'concrete');
    this.addWall(2600, 400, 100, 15, 'concrete');
    this.addWall(2700, 300, 15, 100, 'concrete');
    this.addDoor(2600, 330, 15, 50, 'vertical');

    // Garden area with cover
    this.addWall(300, 1700, 150, 30, 'wood');
    this.addWall(600, 1750, 30, 100, 'wood');
    this.addWall(2400, 1700, 150, 30, 'wood');
    this.addWall(2350, 1750, 30, 100, 'wood');

    // Parking/vehicle barriers
    this.addWall(800, 1800, 80, 40, 'concrete');
    this.addWall(1000, 1800, 80, 40, 'concrete');
    this.addWall(1900, 1800, 80, 40, 'concrete');
    this.addWall(2100, 1800, 80, 40, 'concrete');

    // Spawn points
    this.spawnPoints.team = [
      {x: 100, y: 1000}, {x: 100, y: 1050}, {x: 100, y: 1100}, {x: 150, y: 1050}
    ];

    this.spawnPoints.enemy = [
      {x: 2350, y: 750}, // Safe room
      {x: 2400, y: 500}, {x: 2300, y: 1100},
      {x: 1500, y: 500}, // Ambassador office
      {x: 650, y: 700}, {x: 650, y: 900},
      {x: 1500, y: 1400}, {x: 1200, y: 1000},
      {x: 350, y: 350}, {x: 2650, y: 350},
      {x: 2700, y: 1800}
    ];

    this.objectives.push({x: 2350, y: 750, type: 'hostage', secured: false});
    this.objectives.push({x: 1500, y: 480, type: 'intel', secured: false});
    this.objectives.push({x: 650, y: 500, type: 'bomb', secured: false});
  }

  generateRandom() {
    const W = CONFIG.MAP_WIDTH;
    const H = CONFIG.MAP_HEIGHT;

    // Outer walls
    this.addWall(0, 0, W, 20, 'concrete');
    this.addWall(0, H-20, W, 20, 'concrete');
    this.addWall(0, 0, 20, H, 'concrete');
    this.addWall(W-20, 0, 20, H, 'concrete');

    // Generate rooms using BSP (Binary Space Partitioning)
    const rooms = [];
    const minRoomSize = 200;
    const maxRoomSize = 500;

    // Recursive space partitioning
    const partitions = [];
    this.splitSpace(50, 50, W - 100, H - 100, partitions, minRoomSize * 2);

    // Create rooms from partitions
    for (const part of partitions) {
      const padding = 30;
      const roomW = part.w - padding * 2;
      const roomH = part.h - padding * 2;

      if (roomW > minRoomSize && roomH > minRoomSize) {
        rooms.push({
          x: part.x + padding,
          y: part.y + padding,
          w: roomW,
          h: roomH
        });
      }
    }

    // Draw room walls and doors
    const materials = ['concrete', 'drywall', 'drywall', 'drywall', 'metal'];

    for (const room of rooms) {
      const mat = materials[Math.floor(Math.random() * materials.length)];

      // Top wall with possible door
      if (Math.random() > 0.3) {
        const doorX = room.x + room.w * (0.3 + Math.random() * 0.4);
        this.addWall(room.x, room.y, doorX - room.x - 30, 12, mat);
        this.addDoor(doorX - 30, room.y, 60, 12, 'horizontal');
        this.addWall(doorX + 30, room.y, room.x + room.w - doorX - 30, 12, mat);
      } else {
        this.addWall(room.x, room.y, room.w, 12, mat);
      }

      // Bottom wall with possible door
      if (Math.random() > 0.3) {
        const doorX = room.x + room.w * (0.3 + Math.random() * 0.4);
        this.addWall(room.x, room.y + room.h, doorX - room.x - 30, 12, mat);
        this.addDoor(doorX - 30, room.y + room.h, 60, 12, 'horizontal');
        this.addWall(doorX + 30, room.y + room.h, room.x + room.w - doorX - 30, 12, mat);
      } else {
        this.addWall(room.x, room.y + room.h, room.w, 12, mat);
      }

      // Left wall with possible door
      if (Math.random() > 0.3) {
        const doorY = room.y + room.h * (0.3 + Math.random() * 0.4);
        this.addWall(room.x, room.y, 12, doorY - room.y - 30, mat);
        this.addDoor(room.x, doorY - 30, 12, 60, 'vertical');
        this.addWall(room.x, doorY + 30, 12, room.y + room.h - doorY - 30, mat);
      } else {
        this.addWall(room.x, room.y, 12, room.h, mat);
      }

      // Right wall with possible door
      if (Math.random() > 0.3) {
        const doorY = room.y + room.h * (0.3 + Math.random() * 0.4);
        this.addWall(room.x + room.w, room.y, 12, doorY - room.y - 30, mat);
        this.addDoor(room.x + room.w, doorY - 30, 12, 60, 'vertical');
        this.addWall(room.x + room.w, doorY + 30, 12, room.y + room.h - doorY - 30, mat);
      } else {
        this.addWall(room.x + room.w, room.y, 12, room.h, mat);
      }

      // Random interior elements
      if (Math.random() > 0.5) {
        const coverX = room.x + 50 + Math.random() * (room.w - 150);
        const coverY = room.y + 50 + Math.random() * (room.h - 150);
        this.addWall(coverX, coverY, 40 + Math.random() * 60, 15, 'wood');
      }

      // Sometimes add glass windows
      if (Math.random() > 0.7) {
        const side = Math.floor(Math.random() * 4);
        if (side === 0) this.addWall(room.x + room.w * 0.3, room.y + 2, room.w * 0.4, 8, 'glass');
        else if (side === 1) this.addWall(room.x + room.w * 0.3, room.y + room.h - 2, room.w * 0.4, 8, 'glass');
        else if (side === 2) this.addWall(room.x + 2, room.y + room.h * 0.3, 8, room.h * 0.4, 'glass');
        else this.addWall(room.x + room.w - 2, room.y + room.h * 0.3, 8, room.h * 0.4, 'glass');
      }
    }

    // Add corridors between rooms
    for (let i = 0; i < rooms.length - 1; i++) {
      const r1 = rooms[i];
      const r2 = rooms[i + 1];
      const cx1 = r1.x + r1.w / 2;
      const cy1 = r1.y + r1.h / 2;
      const cx2 = r2.x + r2.w / 2;
      const cy2 = r2.y + r2.h / 2;

      // Sometimes add cover in corridors
      if (Math.random() > 0.6) {
        const midX = (cx1 + cx2) / 2;
        const midY = (cy1 + cy2) / 2;
        this.addWall(midX - 20, midY - 10, 40, 20, 'wood');
      }
    }

    // Spawn team in bottom-left area
    this.spawnPoints.team = [
      {x: 80, y: 80}, {x: 140, y: 80}, {x: 80, y: 140}, {x: 140, y: 140}
    ];

    // Spawn enemies throughout the map
    const enemyCount = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < enemyCount; i++) {
      // Prefer spawning in rooms
      if (rooms.length > 0 && Math.random() > 0.3) {
        const room = rooms[Math.floor(Math.random() * rooms.length)];
        this.spawnPoints.enemy.push({
          x: room.x + 50 + Math.random() * (room.w - 100),
          y: room.y + 50 + Math.random() * (room.h - 100)
        });
      } else {
        this.spawnPoints.enemy.push({
          x: W * 0.4 + Math.random() * (W * 0.5),
          y: H * 0.3 + Math.random() * (H * 0.6)
        });
      }
    }

    // Place objectives in different areas
    const objTypes = ['hostage', 'intel', 'bomb'];
    for (let i = 0; i < 3; i++) {
      if (rooms.length > i) {
        const room = rooms[rooms.length - 1 - i];
        this.objectives.push({
          x: room.x + room.w / 2,
          y: room.y + room.h / 2,
          type: objTypes[i],
          secured: false
        });
      } else {
        this.objectives.push({
          x: W * 0.6 + i * 200,
          y: H * 0.5 + (Math.random() - 0.5) * 400,
          type: objTypes[i],
          secured: false
        });
      }
    }
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

  isSolid(x, y, ignoreDestroyed = true) {
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
    // Floor
    ctx.fillStyle = '#2a2a35';
    ctx.fillRect(0, 0, CONFIG.MAP_WIDTH, CONFIG.MAP_HEIGHT);

    // Grid pattern
    ctx.strokeStyle = '#333340';
    ctx.lineWidth = 1;
    for (let x = 0; x < CONFIG.MAP_WIDTH; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CONFIG.MAP_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < CONFIG.MAP_HEIGHT; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CONFIG.MAP_WIDTH, y);
      ctx.stroke();
    }

    // Walls
    for (const wall of this.walls) {
      if (wall.destroyed) {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
        continue;
      }

      ctx.fillStyle = wall.material.color;
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);

      // Damage indication
      if (wall.hp < 100) {
        ctx.fillStyle = `rgba(0,0,0,${0.5 - wall.hp/200})`;
        ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
      }
    }

    // Doors
    for (const door of this.doors) {
      if (door.destroyed) {
        ctx.fillStyle = '#1a1a1a';
      } else if (door.open) {
        ctx.fillStyle = '#3a3a3a';
      } else {
        ctx.fillStyle = door.material.color;
      }
      ctx.fillRect(door.x, door.y, door.w, door.h);
    }

    // Objectives
    for (const obj of this.objectives) {
      if (obj.secured) continue;
      // Different colors for different objective types
      const colors = {
        hostage: { fill: '#ffff0044', stroke: '#ffff00' },
        intel: { fill: '#00ff0044', stroke: '#00ff00' },
        bomb: { fill: '#ff000044', stroke: '#ff0000' }
      };
      const color = colors[obj.type] || colors.hostage;
      ctx.fillStyle = color.fill;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = color.stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}

// =============================================================================
// PLAYER CLASS
// =============================================================================

class Player {
  constructor(x, y, isLocal = false) {
    this.id = utils.generateId();
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.radius = CONFIG.PLAYER_RADIUS;

    this.isLocal = isLocal;
    this.isAI = false;
    this.team = 'blue';
    this.name = isLocal ? 'You' : 'Teammate';

    // Health
    this.hp = CONFIG.PLAYER_MAX_HP;
    this.maxHp = CONFIG.PLAYER_MAX_HP;
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

    // Weapons
    this.weapons = [
      this.createWeapon('rifle'),
      this.createWeapon('pistol')
    ];
    this.currentWeapon = 0;
    this.fireTimer = 0;
    this.isReloading = false;
    this.reloadTimer = 0;
    this.isFiring = false;

    // Grenades
    this.grenades = { frag: 2, flash: 2, smoke: 1 };
    this.selectedGrenade = 'frag';

    // Effects
    this.flashedTimer = 0;
    this.muzzleFlash = 0;
    this.recoilOffset = 0;

    // Audio
    this.footstepTimer = 0;
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
    if (this.isSprinting && this.stance === 'stand') base *= 1.5;
    if (this.isADS) base *= 0.5;
    return base;
  }

  get accuracy() {
    let acc = this.stance === 'stand' ? CONFIG.ACCURACY_STAND :
              this.stance === 'crouch' ? CONFIG.ACCURACY_CROUCH :
              CONFIG.ACCURACY_PRONE;
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

    if (this.moveUp) this.vy -= 1;
    if (this.moveDown) this.vy += 1;
    if (this.moveLeft) this.vx -= 1;
    if (this.moveRight) this.vx += 1;

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
    this.reloadTimer = this.weapon.reloadTime;
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
    const types = ['frag', 'flash', 'smoke'];
    const idx = types.indexOf(this.selectedGrenade);
    this.selectedGrenade = types[(idx + 1) % types.length];
  }

  takeDamage(amount, fromX, fromY) {
    if (this.isDead) return false;

    // Armor reduction for torso (simplified)
    const reduction = this.stance === 'prone' ? 0.7 : 0.85;
    this.hp -= amount * reduction;

    // Start bleeding
    if (amount > 20) {
      this.bleeding = Math.min(this.bleeding + amount * 0.3, 10);
    }

    sound.play('hit');

    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
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

    ctx.save();
    ctx.translate(this.x + leanOffsetX, this.y + leanOffsetY);
    ctx.rotate(this.angle);

    // Body
    const bodySize = this.stance === 'prone' ? this.radius * 1.3 : this.radius;
    ctx.fillStyle = this.team === 'blue' ? '#4a7cc9' : '#c94a4a';
    ctx.beginPath();
    ctx.arc(0, 0, bodySize, 0, Math.PI * 2);
    ctx.fill();

    // Stance indicator
    if (this.stance === 'crouch') {
      ctx.strokeStyle = '#ffffff44';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (this.stance === 'prone') {
      ctx.strokeStyle = '#ffffff66';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Weapon
    ctx.fillStyle = '#333';
    const weaponLen = this.isADS ? 25 : 20;
    ctx.fillRect(5, -3, weaponLen - this.recoilOffset, 6);

    // Muzzle flash
    if (this.muzzleFlash > 0) {
      ctx.fillStyle = '#ffaa00';
      ctx.beginPath();
      ctx.arc(weaponLen + 5, 0, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Direction indicator
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(bodySize - 3, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Name
    if (!this.isLocal) {
      ctx.fillStyle = '#aaa';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(this.name, this.x, this.y - 25);
    }

    // Health bar
    this.drawHealthBar(ctx);
  }

  drawDead(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = '#4a4a4a';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // X mark
    ctx.strokeStyle = '#aa0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-5, -5);
    ctx.lineTo(5, 5);
    ctx.moveTo(5, -5);
    ctx.lineTo(-5, 5);
    ctx.stroke();
    ctx.restore();
  }

  drawHealthBar(ctx) {
    const barWidth = 30;
    const barHeight = 4;
    const x = this.x - barWidth/2;
    const y = this.y - this.radius - 12;

    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, barWidth, barHeight);

    const hpPct = this.hp / this.maxHp;
    ctx.fillStyle = hpPct > 0.6 ? '#4caf50' : hpPct > 0.3 ? '#ffeb3b' : '#f44336';
    ctx.fillRect(x, y, barWidth * hpPct, barHeight);
  }
}

// =============================================================================
// ENEMY CLASS
// =============================================================================

class Enemy {
  constructor(x, y) {
    this.id = utils.generateId();
    this.x = x;
    this.y = y;
    this.angle = Math.random() * Math.PI * 2;
    this.radius = CONFIG.ENEMY_RADIUS;

    this.hp = 80;
    this.maxHp = 80;
    this.isDead = false;

    this.weapon = { ...CONFIG.WEAPONS.smg, ammo: 30, reserveAmmo: 60, type: 'smg' };
    this.fireTimer = 0;

    this.state = 'patrol'; // 'patrol', 'alert', 'combat', 'cover'
    this.target = null;
    this.lastKnownTargetPos = null;
    this.alertTimer = 0;
    this.coverPos = null;

    this.patrolPoints = [];
    this.patrolIndex = 0;
    this.waitTimer = 0;

    this.hearingEvents = [];
  }

  update(players, level, smokeClouds) {
    if (this.isDead) return null;

    if (this.fireTimer > 0) this.fireTimer--;

    // State machine
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
        this.updateCover(players, level, smokeClouds);
        break;
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
    // Check for visible players
    for (const player of players) {
      if (this.canSeeTarget(player, level, smokeClouds)) {
        this.target = player;
        this.state = 'combat';
        this.lastKnownTargetPos = { x: player.x, y: player.y };
        return;
      }
    }

    // Simple patrol behavior
    if (this.waitTimer > 0) {
      this.waitTimer--;
      return;
    }

    if (this.patrolPoints.length === 0) {
      // Random wandering
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
    // Check for visible players
    for (const player of players) {
      if (this.canSeeTarget(player, level, smokeClouds)) {
        this.target = player;
        this.state = 'combat';
        this.lastKnownTargetPos = { x: player.x, y: player.y };
        return;
      }
    }

    // Move towards last known position
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

    if (canSee) {
      this.lastKnownTargetPos = { x: this.target.x, y: this.target.y };
      this.angle = utils.angle(this.x, this.y, this.target.x, this.target.y);

      const dist = utils.distance(this.x, this.y, this.target.x, this.target.y);

      // Fire if in range
      if (dist < this.weapon.range && this.fireTimer <= 0 && this.weapon.ammo > 0) {
        return this.fire();
      }

      // Move to optimal range
      if (dist > 150) {
        const nextX = this.x + Math.cos(this.angle) * CONFIG.ENEMY_SPEED;
        const nextY = this.y + Math.sin(this.angle) * CONFIG.ENEMY_SPEED;
        if (!level.isSolid(nextX, nextY)) {
          this.x = nextX;
          this.y = nextY;
        }
      }
    } else {
      // Lost sight, go to last known position
      this.state = 'alert';
      this.alertTimer = 180;
    }

    return null;
  }

  updateCover(players, level, smokeClouds) {
    // Simplified cover behavior
    this.state = 'combat';
  }

  fire() {
    if (this.weapon.ammo <= 0) return null;

    this.weapon.ammo--;
    this.fireTimer = this.weapon.fireRate + Math.random() * 10;

    const spread = this.weapon.spread * 1.5; // Enemies are less accurate
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
    sound.play('hit');

    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
      return true;
    }

    // React to being shot
    if (this.state === 'patrol') {
      this.state = 'alert';
      this.lastKnownTargetPos = { x: fromX, y: fromY };
      this.alertTimer = 300;
    }

    return false;
  }

  draw(ctx) {
    if (this.isDead) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.fillStyle = '#4a4a4a';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Body
    ctx.fillStyle = this.state === 'combat' ? '#aa3333' :
                    this.state === 'alert' ? '#aa6633' : '#666666';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Weapon
    ctx.fillStyle = '#333';
    ctx.fillRect(5, -2, 15, 4);

    // View cone (debug)
    /*
    ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, CONFIG.ENEMY_VIEW_RANGE, -CONFIG.ENEMY_VIEW_ANGLE/2, CONFIG.ENEMY_VIEW_ANGLE/2);
    ctx.closePath();
    ctx.fill();
    */

    ctx.restore();

    // Health bar
    const barWidth = 20;
    const barHeight = 3;
    const x = this.x - barWidth/2;
    const y = this.y - this.radius - 8;

    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillStyle = '#f44336';
    ctx.fillRect(x, y, barWidth * (this.hp / this.maxHp), barHeight);
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

    // Map selection
    this.selectedMap = 'compound';

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

    this.bindEvents();
    this.showMenu();
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    document.getElementById('start-btn')?.addEventListener('click', () => this.startMission());
    document.getElementById('sound-toggle')?.addEventListener('click', () => {
      const enabled = sound.toggle();
      document.getElementById('sound-toggle').textContent = `Sound: ${enabled ? 'ON' : 'OFF'}`;
    });

    // Map selection buttons
    document.querySelectorAll('.map-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');
        this.selectedMap = e.target.dataset.map;
        this.updateMapDescription();
      });
    });

    // Initialize map description
    this.updateMapDescription();
  }

  updateMapDescription() {
    const descEl = document.getElementById('map-description');
    if (descEl && MAP_TYPES[this.selectedMap]) {
      descEl.textContent = MAP_TYPES[this.selectedMap].description;
    }
  }

  showMenu() {
    document.getElementById('menu-screen').style.display = 'flex';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('hud').style.display = 'none';
  }

  startMission() {
    sound.init();
    sound.resume();

    document.getElementById('menu-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('hud').style.display = 'block';

    // Create level with selected map type
    this.level = new Level(this.selectedMap);

    // Reset camera to starting position
    this.cameraX = 0;
    this.cameraY = 0;

    // Spawn player
    const spawn = this.level.spawnPoints.team[0];
    this.player = new Player(spawn.x, spawn.y, true);

    // Spawn AI teammates
    this.teammates = [this.player];
    for (let i = 1; i < this.level.spawnPoints.team.length; i++) {
      const sp = this.level.spawnPoints.team[i];
      const teammate = new Player(sp.x, sp.y, false);
      teammate.name = ['Alpha', 'Bravo', 'Charlie'][i-1] || `Team ${i}`;
      teammate.isAI = true;
      this.teammates.push(teammate);
    }

    // Spawn enemies
    this.enemies = [];
    for (const sp of this.level.spawnPoints.enemy) {
      this.enemies.push(new Enemy(sp.x, sp.y));
    }

    this.bullets = [];
    this.grenades = [];
    this.particles = [];
    this.shellCasings = [];
    this.smokeClouds = [];
    this.breachCharges = [];

    this.missionComplete = false;
    this.missionFailed = false;
    this.isRunning = true;

    this.gameLoop();
  }

  gameLoop() {
    if (!this.isRunning) return;

    this.update();
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

    // Update player
    this.player.update(this.mouseX, this.mouseY, this.level);

    // Auto-fire for held mouse
    if (this.player.isFiring && this.player.weapon.auto) {
      const result = this.player.fire();
      if (result) {
        this.bullets.push(...result.bullets);
        this.shellCasings.push(result.casing);
        this.notifyEnemiesOfSound(this.player.x, this.player.y, 1);
      }
    }

    // Update AI teammates (simplified)
    for (const tm of this.teammates) {
      if (tm.isAI && !tm.isDead) {
        this.updateAITeammate(tm);
      }
    }

    // Update enemies
    for (const enemy of this.enemies) {
      const result = enemy.update(this.teammates.filter(t => !t.isDead), this.level, this.smokeClouds);
      if (result) {
        this.bullets.push(result.bullet);
        this.shellCasings.push(result.casing);
        this.notifyEnemiesOfSound(enemy.x, enemy.y, 0.8);
      }
    }

    // Update bullets
    const allEntities = [...this.teammates, ...this.enemies];
    for (const bullet of this.bullets) {
      const hit = bullet.update(this.level, allEntities.filter(e => e !== bullet.shooter));
      if (hit?.type === 'entity') {
        const damage = bullet.damage;
        hit.entity.takeDamage(damage, bullet.startX, bullet.startY);
        this.spawnBlood(hit.x, hit.y);
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

    // Update particles
    for (const p of this.particles) p.update();
    this.particles = this.particles.filter(p => p.life > 0);

    // Update shell casings
    for (const c of this.shellCasings) c.update();
    this.shellCasings = this.shellCasings.filter(c => c.life > 0);

    // Update effects
    if (this.flashOverlay > 0) this.flashOverlay -= 3;
    if (this.screenShake > 0) this.screenShake *= 0.9;

    // Check mission status
    this.checkMissionStatus();

    // Update HUD
    this.updateHUD();
  }

  updateAITeammate(tm) {
    // Simple AI: follow player and engage enemies
    const dist = utils.distance(tm.x, tm.y, this.player.x, this.player.y);

    // Find nearest visible enemy
    let nearestEnemy = null;
    let nearestDist = Infinity;
    for (const enemy of this.enemies) {
      if (enemy.isDead) continue;
      const d = utils.distance(tm.x, tm.y, enemy.x, enemy.y);
      if (d < nearestDist && this.level.checkLineOfSight(tm.x, tm.y, enemy.x, enemy.y, this.smokeClouds)) {
        nearestDist = d;
        nearestEnemy = enemy;
      }
    }

    if (nearestEnemy && nearestDist < 250) {
      // Combat
      tm.angle = utils.angle(tm.x, tm.y, nearestEnemy.x, nearestEnemy.y);
      if (tm.fireTimer <= 0 && tm.weapon.ammo > 0) {
        tm.fireTimer = tm.weapon.fireRate + Math.random() * 5;
        const spread = tm.weapon.spread * 1.2;
        const angleOffset = (Math.random() - 0.5) * spread;
        const bulletAngle = tm.angle + angleOffset;
        const spawnX = tm.x + Math.cos(tm.angle) * 15;
        const spawnY = tm.y + Math.sin(tm.angle) * 15;
        this.bullets.push(new Bullet(spawnX, spawnY, bulletAngle, tm.weapon, tm));
        this.shellCasings.push(new ShellCasing(tm.x, tm.y, tm.angle));
        sound.play(tm.weapon.sound, tm.x, tm.y);
      }
    } else if (dist > 80) {
      // Follow player
      tm.angle = utils.angle(tm.x, tm.y, this.player.x, this.player.y);
      const speed = tm.speed * 0.8;
      const nextX = tm.x + Math.cos(tm.angle) * speed;
      const nextY = tm.y + Math.sin(tm.angle) * speed;
      if (!this.level.isSolid(nextX, tm.y)) tm.x = nextX;
      if (!this.level.isSolid(tm.x, nextY)) tm.y = nextY;
    }

    if (tm.fireTimer > 0) tm.fireTimer--;
    if (tm.weapon.ammo <= 0 && tm.weapon.reserveAmmo > 0) {
      tm.weapon.ammo = tm.weapon.magSize;
      tm.weapon.reserveAmmo -= tm.weapon.magSize;
    }
  }

  handleGrenadeExplosion(grenade) {
    const x = grenade.x;
    const y = grenade.y;

    switch (grenade.type) {
      case 'frag':
        sound.play('explosion');
        this.screenShake = 15;
        this.level.breachWall(x, y, CONFIG.FRAG_RADIUS * 0.3);

        // Damage entities
        for (const entity of [...this.teammates, ...this.enemies]) {
          const dist = utils.distance(x, y, entity.x, entity.y);
          if (dist < CONFIG.FRAG_RADIUS) {
            const damage = CONFIG.FRAG_DAMAGE * (1 - dist / CONFIG.FRAG_RADIUS);
            entity.takeDamage(damage, x, y);
          }
        }

        // Particles
        for (let i = 0; i < 30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 3 + Math.random() * 5;
          this.particles.push(new Particle(
            x, y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            '#ff6600',
            30 + Math.random() * 20,
            3
          ));
        }
        break;

      case 'flash':
        sound.play('flashbang');

        for (const entity of [...this.teammates, ...this.enemies]) {
          const dist = utils.distance(x, y, entity.x, entity.y);
          if (dist < CONFIG.FLASH_RADIUS && this.level.checkLineOfSight(x, y, entity.x, entity.y, [])) {
            // Check if facing the flash
            const angleToFlash = utils.angle(entity.x, entity.y, x, y);
            let angleDiff = angleToFlash - entity.angle;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

            const intensity = (1 - dist / CONFIG.FLASH_RADIUS) * (1 - Math.abs(angleDiff) / Math.PI);
            if (entity.flash) {
              entity.flash(CONFIG.FLASH_DURATION * intensity);
            }
            if (entity === this.player) {
              this.flashOverlay = Math.min(255, this.flashOverlay + 255 * intensity);
            }
          }
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
    for (let i = 0; i < CONFIG.BLOOD_PARTICLES; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      this.particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        '#aa0000',
        20 + Math.random() * 20,
        2
      ));
    }
  }

  spawnSparks(x, y) {
    for (let i = 0; i < 4; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      this.particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        '#ffaa00',
        10 + Math.random() * 10,
        1
      ));
    }
  }

  checkMissionStatus() {
    // All enemies dead = win
    if (this.enemies.every(e => e.isDead)) {
      this.missionComplete = true;
    }

    // Player dead = lose
    if (this.player.isDead) {
      this.missionFailed = true;
    }
  }

  updateHUD() {
    const w = this.player.weapon;
    document.getElementById('weapon-name').textContent = w.name;
    document.getElementById('ammo-count').textContent = `${w.ammo}/${w.reserveAmmo}`;
    document.getElementById('health-fill').style.width = `${this.player.hp}%`;
    document.getElementById('stance-text').textContent =
      this.player.stance.charAt(0).toUpperCase() + this.player.stance.slice(1) +
      (this.player.isADS ? ' (ADS)' : '');

    const g = this.player.grenades;
    document.getElementById('grenade-count').textContent =
      `${this.player.selectedGrenade.toUpperCase()}: ${g[this.player.selectedGrenade]}`;

    document.getElementById('enemies-count').textContent =
      `Enemies: ${this.enemies.filter(e => !e.isDead).length}`;
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

    // Grenades
    for (const g of this.grenades) g.draw(ctx);

    // Breach charges
    for (const bc of this.breachCharges) bc.draw(ctx);

    // Enemies
    for (const enemy of this.enemies) enemy.draw(ctx);

    // Teammates
    for (const tm of this.teammates) tm.draw(ctx);

    // Bullets
    for (const bullet of this.bullets) bullet.draw(ctx);

    // Particles
    for (const p of this.particles) p.draw(ctx);

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

    // Draw walls
    ctx.fillStyle = '#666';
    for (const wall of this.level.walls) {
      if (wall.destroyed) continue;
      ctx.fillRect(
        minimapX + wall.x * scaleX,
        minimapY + wall.y * scaleY,
        Math.max(1, wall.w * scaleX),
        Math.max(1, wall.h * scaleY)
      );
    }

    // Draw doors
    for (const door of this.level.doors) {
      if (door.destroyed) continue;
      ctx.fillStyle = door.open ? '#333' : '#654321';
      ctx.fillRect(
        minimapX + door.x * scaleX,
        minimapY + door.y * scaleY,
        Math.max(1, door.w * scaleX),
        Math.max(1, door.h * scaleY)
      );
    }

    // Draw objectives
    for (const obj of this.level.objectives) {
      if (obj.secured) continue;
      const colors = { hostage: '#ffff00', intel: '#00ff00', bomb: '#ff0000' };
      ctx.fillStyle = colors[obj.type] || '#ffff00';
      ctx.beginPath();
      ctx.arc(minimapX + obj.x * scaleX, minimapY + obj.y * scaleY, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw enemies (red dots)
    ctx.fillStyle = '#ff0000';
    for (const enemy of this.enemies) {
      if (enemy.isDead) continue;
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

  drawOverlay(ctx, text, color) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(text, CONFIG.CANVAS_WIDTH/2, CONFIG.CANVAS_HEIGHT/2);

    ctx.font = '20px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Press R to restart', CONFIG.CANVAS_WIDTH/2, CONFIG.CANVAS_HEIGHT/2 + 50);
  }

  handleKeyDown(e) {
    if (!this.isRunning) return;

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
          this.startMission();
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
    }
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
      // Left click - fire
      this.player.isFiring = true;
      const result = this.player.fire();
      if (result) {
        this.bullets.push(...result.bullets);
        this.shellCasings.push(result.casing);
        this.notifyEnemiesOfSound(this.player.x, this.player.y, 1);
      }
    } else if (e.button === 2) {
      // Right click - ADS
      this.player.isADS = true;
    }
  }

  handleMouseUp(e) {
    if (e.button === 0) {
      this.player.isFiring = false;
    } else if (e.button === 2) {
      this.player.isADS = false;
    }
  }
}

// =============================================================================
// INITIALIZE
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  window.game = new Game('game-canvas');
});
