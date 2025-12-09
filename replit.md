# VISCERA: Tactical Breach

## Overview

VISCERA: Tactical Breach is a browser-based tactical top-down shooter game with realistic ballistics and room-clearing mechanics. The game features both single-player and multiplayer modes, with AI teammates, multiple map options, and team formation systems. Players engage in close-quarter combat scenarios with tactical movement options (standing, crouching, prone).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Pure vanilla JavaScript** - No frameworks or build tools; the game runs directly in the browser
- **HTML5 Canvas** - Used for rendering the game with a 1000x700 viewport displaying a larger 3000x2100 map
- **Single-file game logic** - All game mechanics contained in `game.js` including player physics, formations, weapons, and AI behavior

### Backend Architecture
- **Node.js with Express** - Lightweight HTTP server serving static files
- **WebSocket (ws library)** - Real-time multiplayer communication
- **Room-based multiplayer** - Players create/join rooms using 4-character codes
- **No database** - All game state is held in memory (Maps for rooms and players)

### Game Design Patterns
- **Configuration object** - Central `CONFIG` object stores all game constants (speeds, sizes, formations)
- **Formation system** - Predefined teammate positions relative to player using angle offsets and distances
- **Stance-based movement** - Three movement speeds based on player stance (stand/crouch/prone)

### Deployment
- **Railway deployment** - Configured via `railway.json` using Nixpacks builder
- **Single entry point** - `server.js` handles both static file serving and WebSocket connections
- **Port configuration** - Uses `PORT` environment variable with fallback to 5000

## External Dependencies

### Runtime Dependencies
| Package | Purpose |
|---------|---------|
| express | HTTP server for serving static game files |
| ws | WebSocket library for real-time multiplayer communication |

### Hosting & Infrastructure
- **Railway** - Cloud deployment platform (configured in `railway.json`)
- **No database required** - Game state is ephemeral and stored in-memory

### Requirements
- Node.js >= 18.0.0