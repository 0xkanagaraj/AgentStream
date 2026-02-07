const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const { generateStreamContent } = require('./services/openai');
const { createStream, getStreamStatus } = require('./services/livepeer');

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: [process.env.CLIENT_URL || "http://localhost:3000", "http://localhost:8080"]
}));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL || "http://localhost:3000", "http://localhost:8080"],
    methods: ["GET", "POST"]
  }
});

// Store active streams and their intervals
const activeStreams = new Map();

// Mock Data (Initial)
let streams = [
  {
    id: "1",
    title: "Crypto Daily Analysis",
    agentName: "Crypto Oracle",
    thumbnail: "https://placehold.co/600x400/10b981/ffffff?text=Crypto+Analysis",
    viewerCount: 124,
    isLive: true,
    playbackId: "mock-playback-id-1" // Add playbackId for player
  }
  // ... other mock streams can stay or be removed
];

// Routes
app.get('/', (req, res) => {
  res.send('AgentStream API is running');
});

app.get('/api/streams', (req, res) => {
  res.json(streams);
});

app.get('/api/streams/:id', (req, res) => {
  const stream = streams.find(s => s.id === req.params.id);
  if (stream) {
    res.json(stream);
  } else {
    res.status(404).json({ message: 'Stream not found' });
  }
});

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_stream', (streamId) => {
    socket.join(streamId);
    console.log(`User ${socket.id} joined stream ${streamId}`);
  });

  // Start Stream Event (Triggered by Agent/User)
  socket.on('start_stream', async (data) => {
    try {
      console.log("Starting stream:", data);
      const { title, agentName, personality, apiKey } = data; // content apiKey
      
      // 1. Create Livepeer Stream
      let streamData;
      try {
          streamData = await createStream(title);
      } catch (e) {
          console.log("Livepeer creation failed, using mock data");
          streamData = { id: `stream-${Date.now()}`, playbackId: `mock-playback-${Date.now()}` };
      }

      const newStream = {
        id: streamData.id,
        title,
        agentName,
        thumbnail: "https://placehold.co/600x400/10b981/ffffff?text=Live+Stream",
        viewerCount: 0,
        isLive: true,
        playbackId: streamData.playbackId,
        operatorSocketId: socket.id // Track who started it
      };
      
      streams.push(newStream);
      io.emit('stream_started', newStream); // Notify all clients

      // 2. Start AI Content Generation Loop
      const intervalId = setInterval(async () => {
        const result = await generateStreamContent(title, personality || "enthusiastic tech enthusiast", apiKey);
        
        // Emit "Thought" ONLY to the operator (security/privacy) or specific channel if we want public transparency later
        // For now, let's emit to the stream room "agent_thought" but frontend will only display it if authorized? 
        // Or simpler: Emit to the socket that started the stream?
        // Let's emit to the stream room, assuming it's a feature.
        io.to(newStream.id).emit('agent_thought', {
            timestamp: new Date(),
            thought: result.thought,
            agentName: agentName
        });

        io.to(newStream.id).emit('agent_commentary', {
          timestamp: new Date(),
          message: result.message,
          agentName: agentName
        });
        
        // Also send as chat message
        io.to(newStream.id).emit('receive_message', {
             id: Date.now().toString(),
             user: agentName,
             message: result.message,
             isAgent: true,
             timestamp: new Date().toISOString()
        });

      }, 10000); // Generate every 10 seconds

      activeStreams.set(newStream.id, intervalId);
      socket.emit('stream_created', newStream);

    } catch (error) {
      console.error("Error starting stream:", error);
      socket.emit('error', { message: "Failed to start stream" });
    }
  });

  socket.on('stop_stream', (streamId) => {
    if (activeStreams.has(streamId)) {
      clearInterval(activeStreams.get(streamId));
      activeStreams.delete(streamId);
      
      const streamIndex = streams.findIndex(s => s.id === streamId);
      if (streamIndex !== -1) {
        streams[streamIndex].isLive = false;
        io.emit('stream_ended', { streamId });
      }
    }
  });

  socket.on('send_message', (data) => {
    io.to(data.streamId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
