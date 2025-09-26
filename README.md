# Tower Defense Game

A fully-featured web-based tower defense game built with HTML5 Canvas and JavaScript. Defend your base from waves of enemies by strategically placing towers along their path.

## Features

🎮 **Complete Tower Defense Gameplay**
- Multiple tower types with different abilities
- Enemy waves with increasing difficulty
- Multi-level progression system
- Real-time combat with projectiles and explosions

🔊 **Sound Effects**
- Shooting sounds for towers
- Explosion effects when enemies are destroyed
- Enemy hit feedback
- Tower placement confirmation sounds
- Wave start and game state audio cues

🏆 **Multi-Level System**
- 5 different levels with increasing difficulty
- Each level introduces stronger, faster enemies
- Bonus money for completing levels
- Progressive challenge scaling

🎯 **Tower Types**
- **Basic Tower** ($50) - Balanced damage and range
- **Fast Tower** ($75) - High fire rate, moderate damage
- **Heavy Tower** ($100) - High damage, slower fire rate

👾 **Enemy Variety**
- 5 different enemy types across levels
- Health and speed increase with each level
- Visual health bars and damage feedback

✨ **Visual Effects**
- Particle explosions when enemies are destroyed
- Smooth animations and projectile tracking
- Professional UI with game statistics
- Responsive design for different screen sizes

## How to Play

1. **Start the Game**: Click "Start Game" from the main menu
2. **Select Towers**: Click on tower types in the shop to select them
3. **Place Towers**: Click on the game field to place selected towers (avoid the brown path)
4. **Start Waves**: Click "Start Wave" to begin the enemy assault
5. **Defend**: Towers automatically target and shoot enemies in range
6. **Upgrade Strategy**: Earn money by destroying enemies to buy more towers
7. **Progress**: Complete all waves in a level to advance to the next level

## Game Controls

- **Start Wave**: Begin the next wave of enemies
- **Pause/Resume**: Pause or resume the game
- **Tower Selection**: Click tower buttons to select, then click on map to place
- **Next Level**: Available after completing all waves in current level

## Technical Implementation

### Core Technologies
- **HTML5 Canvas** for 2D rendering
- **JavaScript ES6** for game logic
- **Web Audio API** for procedural sound generation
- **CSS3** for UI styling and animations

### Game Architecture
- Object-oriented design with separate classes for towers, enemies, projectiles
- Game loop with delta time for smooth animations
- Collision detection and pathfinding
- State management for different game phases

### Sound System
- Procedural sound generation using Web Audio API
- No external audio files required
- Real-time sound synthesis for all game events

## File Structure

```
towerdefense/
├── index.html          # Main HTML structure
├── styles.css          # Game styling and responsive design
├── game.js            # Complete game logic and classes
├── .gitignore         # Git ignore patterns
└── README.md          # This documentation
```

## Running the Game

### Local Development
1. Clone or download the repository
2. Start a local web server in the project directory:
   ```bash
   # Python 3
   python3 -m http.server 8080
   
   # Python 2
   python -m SimpleHTTPServer 8080
   
   # Node.js (if you have http-server installed)
   npx http-server -p 8080
   ```
3. Open your browser and navigate to `http://localhost:8080`

### Direct File Access
You can also open `index.html` directly in your browser, though some browsers may restrict certain features when not served from a web server.

## Game Mechanics

### Tower Mechanics
- **Range**: Visual indicator shows tower attack range
- **Fire Rate**: Different towers have different attack speeds
- **Targeting**: Towers automatically target the closest enemy in range
- **Damage**: Each tower type deals different damage amounts

### Enemy Mechanics
- **Pathfinding**: Enemies follow a predefined winding path
- **Health System**: Visual health bars show remaining enemy health
- **Rewards**: Earn money and score for each enemy destroyed
- **Difficulty Scaling**: Enemies become stronger with each wave and level

### Economic System
- Start with $500
- Earn money by destroying enemies
- Bonus money for completing waves and levels
- Strategic spending required for optimal tower placement

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Contributing

This is a complete, standalone tower defense game. Feel free to fork and extend with additional features such as:
- More tower types and upgrade paths
- Additional enemy varieties
- Power-ups and special abilities
- Multiplayer modes
- Level editor

## License

This project is open source and available under the MIT License.