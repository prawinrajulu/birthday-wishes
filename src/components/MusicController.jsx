import React, { useRef, useState, useEffect } from 'react';
import { CONFIG } from '../data/config';

// Uses Howler if available, falls back to HTMLAudio
export default function MusicController() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    // 🎵 CHANGE MUSIC PATH in config.js → CONFIG.musicFile
    audio.src = CONFIG.musicFile;
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'auto';
    audioRef.current = audio;

    const onCanPlay = () => setReady(true);
    audio.addEventListener('canplaythrough', onCanPlay);

    // Auto-attempt play on first user interaction
    const tryPlay = () => {
      audio.play()
        .then(() => setPlaying(true))
        .catch(() => {});
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('keydown', tryPlay);
    };
    document.addEventListener('click', tryPlay, { once: true });
    document.addEventListener('keydown', tryPlay, { once: true });

    return () => {
      audio.pause();
      audio.removeEventListener('canplaythrough', onCanPlay);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <div className="music-controller">
      <button className="music-btn" onClick={togglePlay} title={playing ? 'Pause Music' : 'Play Music'}>
        {playing ? '⏸' : '▶'}
      </button>
      <input
        type="range"
        className="volume-slider"
        min="0" max="1" step="0.01"
        value={volume}
        onChange={handleVolume}
        title="Volume"
      />
      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', userSelect: 'none' }}>
        {playing ? '🎵' : '🔇'}
      </span>
    </div>
  );
}
