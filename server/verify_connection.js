const io = require("socket.io-client");
const http = require("http");

// 1. Test API
const apiReq = http.get("http://localhost:3001/api/streams", (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log("API /streams response status:", res.statusCode);
    console.log("API /streams data length:", data.length);
    if (res.statusCode === 200) {
      console.log("API Verification PASSED");
    } else {
      console.error("API Verification FAILED");
      process.exit(1);
    }
  });
});

apiReq.on("error", (e) => {
  console.error(`API Request error: ${e.message}`);
  process.exit(1);
});

// 2. Test Socket
const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);

  const streamData = {
    title: "Test Stream Verification",
    agentName: "Verifier",
    personality: "Tester",
    apiKey: "test-key"
  };

  console.log("Emitting start_stream...");
  socket.emit("start_stream", streamData);
});

socket.on("stream_created", (data) => {
  console.log("Received stream_created event:", data);
  if (data.title === "Test Stream Verification") {
    console.log("Socket Verification PASSED");
    socket.disconnect();
    process.exit(0);
  } else {
    console.error("Socket Verification FAILED: mismatch title");
    process.exit(1);
  }
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
  process.exit(1);
});

// Timeout
setTimeout(() => {
  console.error("Verification Timed Out");
  process.exit(1);
}, 10000);
