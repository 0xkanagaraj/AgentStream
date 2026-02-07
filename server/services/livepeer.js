async function createStream(name) {
  try {
    if (!process.env.LIVEPEER_API_KEY) {
        throw new Error("LIVEPEER_API_KEY is missing. Real streaming requires a valid API key.");
    }

    const response = await axios.post(`${LIVEPEER_API_URL}/stream`, {
      name: name,
      profiles: [
        {
          name: "720p",
          bitrate: 2000000,
          fps: 30,
          width: 1280,
          height: 720
        },
        {
          name: "480p",
          bitrate: 1000000,
          fps: 30,
          width: 854,
          height: 480
        },
        {
          name: "360p",
          bitrate: 500000,
          fps: 30,
          width: 640,
          height: 360
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.LIVEPEER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("Livepeer Stream Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating stream:", error.response ? error.response.data : error.message);
    throw error; // Propagate error to stop stream creation if Livepeer fails
  }
}

async function getStreamStatus(streamId) {
  try {
    const response = await axios.get(`${LIVEPEER_API_URL}/stream/${streamId}`, {
        headers: {
            'Authorization': `Bearer ${process.env.LIVEPEER_API_KEY}`
        }
    });
    return response.data;
  } catch (error) {
    console.error("Error getting stream status:", error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { createStream, getStreamStatus };
