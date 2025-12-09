const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.use(express.json());
app.use(express.static(__dirname));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id SERIAL PRIMARY KEY,
        player_name VARCHAR(50) NOT NULL,
        score INTEGER NOT NULL,
        kills INTEGER DEFAULT 0,
        map_name VARCHAR(50),
        soldier_class VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Leaderboard table ready');
  } catch (err) {
    console.error('Database init error:', err);
  }
}

initDatabase();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT player_name, score, kills, map_name, soldier_class, created_at FROM leaderboard ORDER BY score DESC LIMIT 20'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Leaderboard fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

app.post('/api/leaderboard', async (req, res) => {
  const { playerName, score, kills, mapName, soldierClass } = req.body;
  
  if (!playerName || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid data' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO leaderboard (player_name, score, kills, map_name, soldier_class) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [playerName.slice(0, 50), score, kills || 0, mapName || 'unknown', soldierClass || 'assault']
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Leaderboard submit error:', err);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

// =============================================================================
// ROOM MANAGEMENT
// =============================================================================

const rooms = new Map();
const players = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function createRoom(hostId, hostName) {
  let code = generateRoomCode();
  while (rooms.has(code)) {
    code = generateRoomCode();
  }

  const room = {
    id: generateId(),
    code: code,
    hostId: hostId,
    players: [{
      id: hostId,
      name: hostName,
      isHost: true
    }],
    gameStarted: false,
    gameState: null
  };

  rooms.set(code, room);
  return room;
}

function joinRoom(code, playerId, playerName) {
  const room = rooms.get(code);
  if (!room) return null;
  if (room.players.length >= 4) return null;
  if (room.gameStarted) return null;

  room.players.push({
    id: playerId,
    name: playerName,
    isHost: false
  });

  return room;
}

function leaveRoom(playerId) {
  for (const [code, room] of rooms) {
    const playerIndex = room.players.findIndex(p => p.id === playerId);
    if (playerIndex !== -1) {
      room.players.splice(playerIndex, 1);

      if (room.players.length === 0) {
        rooms.delete(code);
        return { room: null, deleted: true };
      }

      // Transfer host if needed
      if (room.hostId === playerId && room.players.length > 0) {
        room.hostId = room.players[0].id;
        room.players[0].isHost = true;
      }

      return { room, deleted: false };
    }
  }
  return null;
}

function getRoomByPlayerId(playerId) {
  for (const room of rooms.values()) {
    if (room.players.some(p => p.id === playerId)) {
      return room;
    }
  }
  return null;
}

function broadcastToRoom(room, message, excludeId = null) {
  for (const player of room.players) {
    if (player.id !== excludeId) {
      const ws = players.get(player.id);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    }
  }
}

// =============================================================================
// WEBSOCKET HANDLING
// =============================================================================

wss.on('connection', (ws) => {
  const playerId = generateId();
  players.set(playerId, ws);

  console.log(`Player connected: ${playerId}`);

  // Send connection confirmation
  ws.send(JSON.stringify({
    type: 'connected',
    playerId: playerId
  }));

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      handleMessage(playerId, ws, message);
    } catch (e) {
      console.error('Invalid message:', e);
    }
  });

  ws.on('close', () => {
    console.log(`Player disconnected: ${playerId}`);

    const result = leaveRoom(playerId);
    if (result && result.room && !result.deleted) {
      broadcastToRoom(result.room, {
        type: 'player_left',
        players: result.room.players,
        newHostId: result.room.hostId
      });
    }

    players.delete(playerId);
  });
});

function handleMessage(playerId, ws, message) {
  switch (message.type) {
    case 'create_room': {
      const room = createRoom(playerId, message.playerName);
      ws.send(JSON.stringify({
        type: 'room_created',
        roomId: room.id,
        roomCode: room.code,
        isHost: true,
        players: room.players
      }));
      break;
    }

    case 'join_room': {
      const room = joinRoom(message.roomCode, playerId, message.playerName);
      if (room) {
        ws.send(JSON.stringify({
          type: 'room_joined',
          roomId: room.id,
          roomCode: room.code,
          isHost: false,
          players: room.players
        }));

        broadcastToRoom(room, {
          type: 'player_joined',
          players: room.players
        }, playerId);
      } else {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Room not found or full'
        }));
      }
      break;
    }

    case 'leave_room': {
      const result = leaveRoom(playerId);
      ws.send(JSON.stringify({ type: 'room_left' }));

      if (result && result.room && !result.deleted) {
        broadcastToRoom(result.room, {
          type: 'player_left',
          players: result.room.players,
          newHostId: result.room.hostId
        });
      }
      break;
    }

    case 'start_game': {
      const room = getRoomByPlayerId(playerId);
      if (room && room.hostId === playerId) {
        room.gameStarted = true;
        room.mapType = message.mapType || 'compound';

        const gameData = {
          type: 'game_start',
          players: room.players,
          aiCount: message.aiCount || Math.max(0, 4 - room.players.length),
          mapType: room.mapType
        };

        broadcastToRoom(room, gameData);
        ws.send(JSON.stringify(gameData));
      }
      break;
    }

    case 'game_update': {
      const room = getRoomByPlayerId(playerId);
      if (room) {
        broadcastToRoom(room, {
          type: 'game_update',
          senderId: playerId,
          data: message.data
        }, playerId);
      }
      break;
    }

    case 'chat': {
      const room = getRoomByPlayerId(playerId);
      if (room) {
        broadcastToRoom(room, {
          type: 'chat',
          senderId: playerId,
          message: message.text
        });
      }
      break;
    }
  }
}

// =============================================================================
// START SERVER
// =============================================================================

server.listen(PORT, HOST, () => {
  console.log(`Close Quarter Combat server running at http://${HOST}:${PORT}`);
  console.log(`WebSocket server ready for multiplayer connections`);
});
