import { useCallback, useEffect, useRef, useState } from 'react';
import BackButton from '../components/BackButton';

type Page = 'home' | 'about' | 'sticker-wall' | 'playlist' | 'anon-inbox';
interface Props { navigate: (page: Page) => void; }

interface Track {
  id: string;
  name: string;
  note: string;
  duration: string;
  url?: string;
}

const STORAGE_KEY = 'larpforest_playlist_meta';

function loadMeta(): Track[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export default function Playlist({ navigate }: Props) {
  const [tracks, setTracks]       = useState<Track[]>(loadMeta);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [volume, setVolume]       = useState(0.8);
  const [adminMode, setAdminMode] = useState(false);
  const [trackName, setTrackName] = useState('');
  const [trackNote, setTrackNote] = useState('');
  const audioRef   = useRef<HTMLAudioElement>(null);
  const objectUrls = useRef<Map<string, string>>(new Map());

  // Ctrl+Shift+A
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') setAdminMode((v) => !v);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const currentTrack = tracks.find((t) => t.id === currentId) ?? null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    const url = objectUrls.current.get(currentTrack.id);
    if (!url) return;
    audio.src = url;
    audio.volume = volume;
    if (isPlaying) audio.play().catch(() => {});
  }, [currentId]); // eslint-disable-line

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const onTimeUpdate = useCallback(() => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    setProgress(a.currentTime / a.duration);
  }, []);

  const onEnded = useCallback(() => {
    const idx = tracks.findIndex((t) => t.id === currentId);
    if (idx >= 0 && idx < tracks.length - 1) {
      setCurrentId(tracks[idx + 1].id);
    } else {
      setIsPlaying(false);
    }
  }, [tracks, currentId]);

  function seekTo(val: number) {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    a.currentTime = val * a.duration;
    setProgress(val);
  }

  function fmt(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const id  = crypto.randomUUID();
    objectUrls.current.set(id, url);
    const name = trackName.trim() || file.name.replace(/\.[^/.]+$/, '');
    const note = trackNote.trim() || 'uploaded track';
    const newTrack: Track = { id, name, note, duration: '—:—' };

    const tmp = new Audio(url);
    tmp.addEventListener('loadedmetadata', () => {
      const dur = fmt(tmp.duration);
      setTracks((prev) => {
        const updated = prev.map((t) => t.id === id ? { ...t, duration: dur } : t);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.map(({ url: _, ...rest }) => rest))); } catch {}
        return updated;
      });
    }, { once: true });

    setTracks((prev) => {
      const updated = [...prev, newTrack];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.map(({ url: _, ...rest }) => rest))); } catch {}
      return updated;
    });
    setTrackName(''); setTrackNote('');
    e.target.value = '';
  }

  function removeTrack(id: string) {
    const url = objectUrls.current.get(id);
    if (url) URL.revokeObjectURL(url);
    objectUrls.current.delete(id);
    setTracks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
    if (currentId === id) { setCurrentId(null); setIsPlaying(false); }
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh' }}>
      <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={onEnded} />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 16px 16px' }}>
        <p className="font-mono-pixel" style={{ fontSize: '0.65rem', color: 'var(--red)', opacity: 0.65, marginBottom: 6 }}>
          // audio.log — session tracks
        </p>
        <h1 className="font-gothic neon-pink" style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 24 }}>My Playlist</h1>

        {/* now playing */}
        {currentTrack && (
          <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: 20 }}>
            <p className="font-mono-pixel" style={{ fontSize: '0.62rem', color: 'var(--red)', marginBottom: 4 }}>NOW PLAYING</p>
            <h2 className="font-gothic neon-pink" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>{currentTrack.name}</h2>
            <p className="font-mono-pixel" style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 12 }}>{currentTrack.note}</p>
            <input type="range" min={0} max={1} step={0.001} value={progress}
              onChange={(e) => seekTo(+e.target.value)} className="track-slider" style={{ marginBottom: 12 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn-glitch" style={{ padding: '6px 18px' }} onClick={() => setIsPlaying((p) => !p)}>
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <div className="font-mono-pixel" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: 'var(--muted)' }}>
                VOL
                <input type="range" min={0} max={1} step={0.01} value={volume}
                  onChange={(e) => setVolume(+e.target.value)} className="track-slider" style={{ width: 80 }} />
                <span style={{ color: 'var(--red)' }}>{Math.round(volume * 100)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* track list */}
        {tracks.length === 0 ? (
          <p className="font-mono-pixel" style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', padding: '60px 0' }}>
            No tracks loaded. Press <span style={{ color: 'var(--red)' }}>Ctrl+Shift+A</span> to enter admin mode and upload audio.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {tracks.map((track, i) => (
              <div
                key={track.id}
                className="glass-panel"
                style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderColor: currentId === track.id ? 'rgba(255,20,147,0.55)' : undefined }}
              >
                <button
                  className="btn-glitch"
                  style={{ padding: '4px 12px', minWidth: 56, fontSize: '0.75rem' }}
                  onClick={() => {
                    if (currentId === track.id) setIsPlaying((p) => !p);
                    else { setCurrentId(track.id); setIsPlaying(true); }
                  }}
                >
                  {currentId === track.id && isPlaying ? '⏸' : '▶'}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="font-gothic" style={{ fontSize: '0.9rem', fontWeight: 700, color: currentId === track.id ? 'var(--pink)' : 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                    {i + 1}. {track.name}
                  </p>
                  <p className="font-mono-pixel" style={{ fontSize: '0.68rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                    {track.note}
                  </p>
                </div>
                <span className="font-mono-pixel" style={{ fontSize: '0.7rem', color: 'var(--muted)', flexShrink: 0 }}>{track.duration}</span>
                {adminMode && (
                  <button className="btn-glitch" style={{ padding: '2px 8px', fontSize: '0.7rem' }} onClick={() => removeTrack(track.id)}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* admin zone */}
        {adminMode && (
          <div className="admin-zone">
            <p className="font-mono-pixel neon-pink" style={{ fontSize: '0.7rem', marginBottom: 12 }}>— ADMIN MODE ACTIVE —</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              <input className="glitch-input" placeholder="Track name (optional)" value={trackName} onChange={(e) => setTrackName(e.target.value)} />
              <input className="glitch-input" placeholder="Short note / description" value={trackNote} onChange={(e) => setTrackNote(e.target.value)} />
            </div>
            <label className="btn-glitch btn-pink" style={{ display: 'inline-block', cursor: 'pointer' }}>
              Upload .mp3 / .wav
              <input type="file" accept=".mp3,.wav,audio/*" style={{ display: 'none' }} onChange={handleUpload} />
            </label>
            <p className="font-mono-pixel" style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: 8 }}>
              Tracks are stored in your browser session only.
            </p>
          </div>
        )}
      </div>

      <BackButton onClick={() => navigate('home')} />
    </div>
  );
}
