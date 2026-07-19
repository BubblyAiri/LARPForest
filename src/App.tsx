import { useCallback, useState } from 'react';
import Background from './components/Background';
import CursorTrail from './components/CursorTrail';
import Home from './pages/Home';
import About from './pages/About';
import StickerWall from './pages/StickerWall';
import Playlist from './pages/Playlist';
import AnonInbox from './pages/AnonInbox';

type Page = 'home' | 'about' | 'sticker-wall' | 'playlist' | 'anon-inbox';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [transitioning, setTransitioning] = useState(false);
  const [nextPage, setNextPage] = useState<Page | null>(null);

  const navigate = useCallback((target: Page) => {
    if (transitioning || target === page) return;
    setTransitioning(true);
    setNextPage(target);

    // wait for the glitch flash, then switch
    setTimeout(() => {
      setPage(target);
      setTransitioning(false);
      setNextPage(null);
      window.scrollTo(0, 0);
    }, 180);
  }, [page, transitioning]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Background />
      <CursorTrail />

      {/* glitch transition overlay */}
      {transitioning && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 8000,
            background: 'var(--red)',
            animation: 'glitchFlash 0.18s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      )}

      <style>{`
        @keyframes glitchFlash {
          0%   { opacity: 0.7; clip-path: inset(0 0 100% 0); }
          30%  { opacity: 0.5; clip-path: inset(30% 0 30% 0); transform: translateX(-4px); }
          60%  { opacity: 0.3; clip-path: inset(70% 0 0% 0); transform: translateX(4px); }
          100% { opacity: 0; clip-path: inset(0 0 0 0); transform: translateX(0); }
        }
      `}</style>

      {/* ── page content ── */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {page === 'home'         && <Home navigate={navigate} />}
        {page === 'about'        && <About navigate={navigate} />}
        {page === 'sticker-wall' && <StickerWall navigate={navigate} />}
        {page === 'playlist'     && <Playlist navigate={navigate} />}
        {page === 'anon-inbox'   && <AnonInbox navigate={navigate} />}
      </div>
    </div>
  );
}
