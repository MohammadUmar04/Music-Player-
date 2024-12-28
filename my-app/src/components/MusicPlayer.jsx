'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Slider,
  Typography,
  LinearProgress,
  IconButton,
  Container,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeOff,
} from '@mui/icons-material';

const MusicPlayer = () => {
  const [tracks, setTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(
    parseFloat(localStorage.getItem('volume')) || 0.5
  );
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/songs');
        const data = await response.json();
        const formattedTracks = data.map((song) => ({
          title: song.name,
          src: song.previewUrl,
          cover: song.coverUrl || 'default-cover.jpg',
        }));
        setTracks(formattedTracks);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  useEffect(() => {
    localStorage.setItem('volume', volume);
  }, [volume]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    setIsPlaying(true);
    audioRef.current.currentTime = 0;
  }, [tracks.length]);

  const handlePrevious = useCallback(() => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    );
    setIsPlaying(true);
    audioRef.current.currentTime = 0;
  }, [tracks.length]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    }
  }, [currentTrackIndex, isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setProgress((currentTime / duration) * 100);
  }, []);

  const handleVolumeChange = useCallback((e, newValue) => {
    setVolume(newValue);
    audioRef.current.volume = newValue;
    setMuted(newValue === 0);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const newMuted = !prev;
      audioRef.current.muted = newMuted;
      return newMuted;
    });
  }, []);

  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading tracks...</Typography>
      </Container>
    );
  }

  if (tracks.length === 0) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography>No tracks available.</Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xs"
      sx={{
        bgcolor: 'linear-gradient(145deg, #f3f4f6, #e0e0e0)',
        p: 3,
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <img
          src={tracks[currentTrackIndex]?.cover}
          alt="Track Cover"
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '12px',
            objectFit: 'cover',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.3s ease',
          }}
        />
      </Box>
      <Typography variant="h6" sx={{ mb: 1, color: '#333' }}>
        {tracks[currentTrackIndex]?.title}
      </Typography>
      <audio
        ref={audioRef}
        src={tracks[currentTrackIndex]?.src}
        onEnded={handleNext}
        onTimeUpdate={handleTimeUpdate}
      />
      <Box sx={{ width: '100%', my: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 2,
            backgroundColor: '#ddd',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#4caf50',
              transition: 'width 0.5s ease',
            },
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
        <IconButton onClick={handlePrevious} color="primary">
          <SkipPrevious fontSize="large" />
        </IconButton>
        <IconButton
          onClick={handlePlayPause}
          color="primary"
          sx={{
            backgroundColor: '#4caf50',
            color: '#fff',
            borderRadius: '50%',
            padding: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#388e3c',
            },
          }}
        >
          {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
        </IconButton>
        <IconButton onClick={handleNext} color="primary">
          <SkipNext fontSize="large" />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, width: '100%' }}>
        <IconButton onClick={toggleMute} color="secondary">
          {muted ? <VolumeOff fontSize="large" /> : <VolumeUp fontSize="large" />}
        </IconButton>
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          min={0}
          max={1}
          step={0.01}
          sx={{ ml: 2, flexGrow: 1, color: '#4caf50' }}
        />
      </Box>
    </Container>
  );
};

export default MusicPlayer;
