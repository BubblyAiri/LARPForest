import BackButton from '../components/BackButton';

type Page = 'home' | 'about' | 'sticker-wall' | 'playlist' | 'anon-inbox';
interface Props { navigate: (page: Page) => void; }

const socials = [
  { label: 'Discord', icon: '◈' },
  { label: 'YouTube', icon: '▶' },
  { label: 'GitHub',  icon: '◉' },
  { label: 'Steam',   icon: '◆' },
];

const stats = [
  { key: 'Status',      val: 'ONLINE' },
  { key: 'Location',   val: 'The Forest' },
  { key: 'Affiliation', val: 'Unknown Faction' },
  { key: 'Build',      val: 'v0.0.1-alpha' },
  { key: 'Alignment',  val: 'Chaotic Posting' },
];

export default function About({ navigate }: Props) {
  return (
    <div className="page-enter" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '56px 20px 16px' }}>
        <p className="font-mono-pixel" style={{ fontSize: '0.68rem', color: 'var(--red)', opacity: 0.65, marginBottom: 24 }}>
          // initiate.exe — operator profile
        </p>

        {/* hero card */}
        <div className="glass-panel" style={{ padding: '28px 28px 24px', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* avatar placeholder */}
            <div style={{ width: 110, height: 110, flexShrink: 0, border: '2px solid rgba(255,0,64,0.38)', background: '#080810', position: 'relative', overflow: 'hidden' }}>
              <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
                <rect width="110" height="110" fill="#0d0d1a"/>
                <polygon points="55,12 88,36 88,78 55,100 22,78 22,36" fill="#1a0010" stroke="#ff0040" strokeWidth="1" opacity="0.85"/>
                <polygon points="55,28 74,46 74,70 55,88 36,70 36,46" fill="#2a0a1a" stroke="#ff1493" strokeWidth="1" opacity="0.55"/>
                <circle cx="55" cy="58" r="13" fill="#ff0040" opacity="0.42"/>
                <circle cx="55" cy="58" r="6"  fill="#ff69b4" opacity="0.75"/>
                <line x1="55" y1="0" x2="55" y2="110" stroke="#ff0040" strokeWidth="0.5" opacity="0.18"/>
                <line x1="0" y1="55" x2="110" y2="55" stroke="#ff0040" strokeWidth="0.5" opacity="0.18"/>
                <rect x="0" y="0" width="110" height="110" fill="none" stroke="rgba(255,20,147,0.2)" strokeWidth="1"/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,0,64,0.05) 3px,rgba(255,0,64,0.05) 4px)' }} />
              <p className="font-mono-pixel" style={{ position: 'absolute', bottom: 3, left: 0, right: 0, textAlign: 'center', fontSize: '0.45rem', color: 'var(--red)', opacity: 0.6 }}>
                [AVATAR]
              </p>
            </div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <h1 className="font-gothic" style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--pink)', filter: 'drop-shadow(0 0 10px rgba(255,20,147,0.45))', margin: '0 0 4px' }}>
                OPERATOR_01
              </h1>
              <p className="font-mono-pixel" style={{ fontSize: '0.68rem', color: 'var(--red)', marginBottom: 12 }}>
                [ Replace with your handle ]
              </p>
              <p className="font-mono-pixel" style={{ fontSize: '0.8rem', color: 'var(--text)', lineHeight: 1.75, opacity: 0.82 }}>
                [BIOGRAPHY PLACEHOLDER] — This space is reserved for your bio.
                Describe your vibe, your interests, your enemies. The void is listening.
                Maybe talk about what you LARP as. Maybe don't. Mystery is content.
              </p>
            </div>
          </div>

          {/* divider */}
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--red),transparent)', margin: '22px 0', opacity: 0.35 }} />

          {/* stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stats.map((s) => (
              <div key={s.key} className="font-mono-pixel" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.74rem' }}>
                <span style={{ color: 'var(--red)', minWidth: 95 }}>{s.key}</span>
                <span style={{ color: 'var(--muted)' }}>──</span>
                <span style={{ color: 'var(--text)' }}>{s.val}</span>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--red),transparent)', margin: '22px 0', opacity: 0.35 }} />

          {/* socials */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {socials.map((s) => (
              <button key={s.label} className="btn-glitch">
                <span style={{ marginRight: 6 }}>{s.icon}</span>{s.label}
              </button>
            ))}
          </div>
        </div>

        {/* extended bio */}
        <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: 16 }}>
          <h2 className="font-gothic neon-red" style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 10 }}>Transmission Log</h2>
          <p className="font-mono-pixel" style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.75 }}>
            [PLACEHOLDER] Add extended notes, links, or whatever you want here.
            Interests, projects, lore, or just the word "BEAN" repeated 400 times.
          </p>
          <p className="font-mono-pixel" style={{ fontSize: '0.72rem', color: 'var(--red)', opacity: 0.45, marginTop: 14 }}>
            &gt;&gt; SIGNAL_END &gt;&gt;
          </p>
        </div>
      </div>

      <BackButton onClick={() => navigate('home')} />
    </div>
  );
}
