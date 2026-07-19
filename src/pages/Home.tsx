type Page = 'home' | 'about' | 'sticker-wall' | 'playlist' | 'anon-inbox';
interface Props { navigate: (page: Page) => void; }

const cards: { page: Page; title: string; desc: string; tag: string }[] = [
  { page: 'about',        title: 'Initiate.exe',   desc: 'Enter the mind of the operator. Encrypted biography, links, debug data.',                         tag: '// who.am.i' },
  { page: 'sticker-wall', title: 'Sticker Wall',   desc: 'Draw a pixel sticker and leave it on the wall. It stays forever. You have been warned.',           tag: '// draw.leave.forget' },
  { page: 'anon-inbox',   title: 'Anon Inbox',     desc: 'Transmit an anonymous message. It may or may not be acknowledged. Spammers will be remembered.', tag: '// msg.void.null' },
  { page: 'playlist',     title: 'My Playlist',    desc: 'The audio log. Loaded tracks and frequency data from the last session.',                          tag: '// audio.log' },
];

export default function Home({ navigate }: Props) {
  return (
    <div className="page-enter" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <header style={{ textAlign: 'center', paddingTop: 64, paddingBottom: 32, padding: '64px 16px 32px' }}>
        <p className="font-mono-pixel" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 10 }}>
          larpfo.rest / v1.0.0
        </p>
        <h1
          className="font-gothic"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            margin: 0,
            background: 'linear-gradient(135deg, #ff0040 0%, #ff69b4 50%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 22px rgba(255,0,64,0.55))',
          }}
        >
          LARP Forest
        </h1>
        <p className="font-mono-pixel" style={{ fontSize: '0.68rem', letterSpacing: '0.22em', color: 'var(--red)', marginTop: 14 }}>
          ━━━━ SYSTEM ONLINE ━━━━
        </p>
      </header>

      {/* grid */}
      <main style={{ flex: 1, width: '100%', maxWidth: 720, margin: '0 auto', padding: '0 20px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {cards.map((c) => (
            <button key={c.page} className="nav-card" style={{ textAlign: 'left', width: '100%' }} onClick={() => navigate(c.page)}>
              <p className="font-mono-pixel" style={{ fontSize: '0.62rem', color: 'var(--red)', opacity: 0.65, marginBottom: 6 }}>{c.tag}</p>
              <h2 className="font-gothic neon-pink" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>{c.title}</h2>
              <p className="font-mono-pixel" style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.7 }}>{c.desc}</p>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--red)', fontSize: '0.62rem', fontFamily: 'Share Tech Mono, monospace' }}>ENTER &gt;</span>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--red), transparent)' }} />
              </div>
            </button>
          ))}
        </div>

        {/* profile placeholder */}
        <div className="glass-panel" style={{ marginTop: 18, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 72, height: 72, flexShrink: 0, border: '1px solid rgba(255,0,64,0.3)', background: '#080810', position: 'relative', overflow: 'hidden' }}>
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <rect width="72" height="72" fill="#0d0d1a"/>
              <polygon points="36,8 58,28 58,52 36,72 14,52 14,28" fill="#1a0010" stroke="#ff0040" strokeWidth="0.8" opacity="0.8"/>
              <polygon points="36,20 50,34 50,52 36,64 22,52 22,34" fill="#2a0a1a" stroke="#ff1493" strokeWidth="0.8" opacity="0.5"/>
              <circle cx="36" cy="40" r="10" fill="#ff0040" opacity="0.4"/>
              <circle cx="36" cy="40" r="5"  fill="#ff69b4" opacity="0.7"/>
              <line x1="36" y1="0" x2="36" y2="72" stroke="#ff0040" strokeWidth="0.4" opacity="0.2"/>
              <line x1="0"  y1="36" x2="72" y2="36" stroke="#ff0040" strokeWidth="0.4" opacity="0.2"/>
            </svg>
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,0,64,0.06) 3px,rgba(255,0,64,0.06) 4px)' }} />
          </div>
          <div>
            <p className="font-gothic" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--pink)' }}>OPERATOR PROFILE</p>
            <p className="font-mono-pixel" style={{ fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.75, marginTop: 4 }}>
              [PLACEHOLDER — customize this block]<br />
              Status: <span style={{ color: 'var(--red)' }}>ONLINE</span> &nbsp;|&nbsp; Mode: LARP
            </p>
          </div>
        </div>
      </main>

      {/* footer */}
      <footer style={{ textAlign: 'center', padding: '28px 16px' }}>
        <p className="font-mono-pixel" style={{ fontSize: '0.65rem', color: 'var(--muted)', opacity: 0.45 }}>
          © LARP Forest — larpfo.rest — All rights reserved by the void
        </p>
        <p className="font-mono-pixel" style={{ fontSize: '0.65rem', color: 'var(--muted)', opacity: 0.3, marginTop: 4 }}>
          The author bears no responsibility for any aviation disasters caused by viewing this page.
        </p>
      </footer>
    </div>
  );
}
