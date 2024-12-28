const express = require("express");
const cors = require('cors');
const app = express();
const PORT = 5000;

// Songs array
const songs = [
    {
      id: 1,
      name: "Song One",
      previewUrl:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        coverUrl:'https://wallpapercave.com/wp/wp2836127.jpg'
    },
    {
      id: 2,
      name: "Song Two",
      previewUrl:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        coverUrl:'https://tse4.mm.bing.net/th?id=OIP.iau-5ckARTa23AR3n35AogHaEB&pid=Api&P=0&h=220'
    },
    {
      id: 3,
      name: "Song Three",
      previewUrl:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        coverUrl:'https://storage.needpix.com/rsynced_images/musical-background-2842924_1280.jpg'
    },
    {
      id: 4,
      name: "Song Four",
      previewUrl:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        coverUrl:'https://tse2.mm.bing.net/th?id=OIP.dxRJSrs7-_kjv_pZg8EK9gHaEo&pid=Api&P=0&h=220'
    },
  ];
  


app.use(express.json());
app.use(cors());
// Debugging Middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Route to get all songs
app.get("/api/songs", (req, res) => {
  console.log("GET /api/songs route called");
  res.json(songs); // Return the songs array directly
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

