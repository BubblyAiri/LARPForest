import { useEffect, useState } from 'react';
import { supabase, type InboxMessage } from '../lib/supabase';
import BackButton from '../components/BackButton';

type Page = 'home' | 'about' | 'sticker-wall' | 'playlist' | 'anon-inbox';
interface Props { navigate: (page: Page) => void; }

export default function AnonInbox({ navigate }: Props) {
  const [messages, setMessages]   = useState<InboxMessage[]>([]);
  const [pending, setPending]     = useState<InboxMessage[]>([]);
  const [draft, setDraft]         = useState('');
  const [sending, setSending]     = useState(false);
  const [sent, setSent]           = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setAdminMode((v) => {
          if (!v) loadPending();
          return !v;
        });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => { loadApproved(); }, []);

  async function loadApproved() {
    setLoading(true);
    const { data } = await supabase
      .from('inbox_messages').select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    if (data) setMessages(data as InboxMessage[]);
    setLoading(false);
  }

  async function loadPending() {
    const { data } = await supabase
      .from('inbox_messages').select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (data) setPending(data as InboxMessage[]);
  }

  async function sendMessage() {
    if (!draft.trim()) return;
    setSending(true);
    await supabase.from('inbox_messages').insert({ content: draft.trim(), status: 'pending' });
    setDraft('');
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  async function approveMessage(msg: InboxMessage) {
    const resp = responses[msg.id]?.trim() || null;
    await supabase
      .from('inbox_messages')
      .update({ status: 'approved', response: resp })
      .eq('id', msg.id);
    setPending((prev) => prev.filter((m) => m.id !== msg.id));
    const { data } = await supabase
      .from('inbox_messages').select('*').eq('id', msg.id).maybeSingle();
    if (data) setMessages((prev) => [data as InboxMessage, ...prev]);
  }

  async function deleteMessage(id: string) {
    await supabase.from('inbox_messages').delete().eq('id', id);
    setPending((prev) => prev.filter((m) => m.id !== id));
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 16px 16px' }}>
        <p className="font-mono-pixel" style={{ fontSize: '0.65rem', color: 'var(--red)', opacity: 0.65, marginBottom: 6 }}>
          // msg.void.null — anonymous transmissions
        </p>
        <h1 className="font-gothic neon-pink" style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 6 }}>Anon Inbox</h1>
        <p className="font-mono-pixel" style={{ fontSize: '0.74rem', color: 'var(--muted)', marginBottom: 28, lineHeight: 1.6 }}>
          Transmit a message into the void. No raiders. No spammers. Void reserves the right to not respond.
        </p>

        {/* send form */}
        <div className="glass-panel" style={{ padding: '18px 20px', marginBottom: 28 }}>
          <p className="font-mono-pixel" style={{ fontSize: '0.65rem', color: 'var(--red)', marginBottom: 10 }}>
            &gt; COMPOSE TRANSMISSION
          </p>
          <textarea
            className="glitch-input"
            rows={4}
            placeholder="Type your anonymous message here..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={sending}
            maxLength={1000}
            style={{ marginBottom: 10 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn-glitch" onClick={sendMessage} disabled={sending || !draft.trim()}>
              {sending ? 'Transmitting...' : 'Send'}
            </button>
            {sent && (
              <span className="font-mono-pixel neon-pink" style={{ fontSize: '0.72rem' }}>
                Signal received. Awaiting moderation.
              </span>
            )}
            <span className="font-mono-pixel" style={{ fontSize: '0.65rem', color: 'var(--muted)', marginLeft: 'auto' }}>
              {draft.length}/1000
            </span>
          </div>
        </div>

        {/* admin: pending queue */}
        {adminMode && (
          <div className="admin-zone" style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <p className="font-mono-pixel neon-pink" style={{ fontSize: '0.7rem', margin: 0 }}>— ADMIN MODE — PENDING QUEUE —</p>
              <button className="btn-glitch" style={{ padding: '4px 12px', fontSize: '0.68rem' }} onClick={loadPending}>Refresh</button>
            </div>
            {pending.length === 0 ? (
              <p className="font-mono-pixel" style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>No pending messages.</p>
            ) : pending.map((msg) => (
              <div key={msg.id} className="msg-card" style={{ marginBottom: 14 }}>
                <p className="font-mono-pixel" style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 6 }}>{fmtDate(msg.created_at)}</p>
                <p className="font-mono-pixel" style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.7, marginBottom: 10 }}>{msg.content}</p>
                <textarea
                  className="glitch-input"
                  rows={2}
                  placeholder="Your response (optional)..."
                  value={responses[msg.id] ?? ''}
                  onChange={(e) => setResponses((prev) => ({ ...prev, [msg.id]: e.target.value }))}
                  style={{ marginBottom: 8 }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-glitch btn-pink" style={{ padding: '5px 14px', fontSize: '0.7rem' }} onClick={() => approveMessage(msg)}>
                    Approve &amp; Publish
                  </button>
                  <button className="btn-glitch" style={{ padding: '5px 14px', fontSize: '0.7rem' }} onClick={() => deleteMessage(msg.id)}>
                    Discard
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* approved messages */}
        <p className="font-mono-pixel" style={{ fontSize: '0.65rem', color: 'var(--red)', marginBottom: 14 }}>
          &gt; MESSAGE HISTORY
        </p>

        {loading ? (
          <p className="font-mono-pixel" style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Loading...</p>
        ) : messages.length === 0 ? (
          <p className="font-mono-pixel" style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
            No messages published yet. Be the first.
          </p>
        ) : messages.map((msg) => (
          <div key={msg.id} className="msg-card approved">
            <p className="font-mono-pixel" style={{ fontSize: '0.63rem', color: 'var(--muted)', marginBottom: 6 }}>
              ANON — {fmtDate(msg.created_at)}
            </p>
            <p className="font-mono-pixel" style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.7 }}>{msg.content}</p>
            {msg.response && (
              <div style={{ borderTop: '1px solid rgba(255,20,147,0.2)', marginTop: 10, paddingTop: 10 }}>
                <p className="font-mono-pixel" style={{ fontSize: '0.63rem', color: 'var(--pink)', marginBottom: 4 }}>OPERATOR RESPONSE:</p>
                <p className="font-mono-pixel" style={{ fontSize: '0.78rem', color: 'var(--text)', lineHeight: 1.7 }}>{msg.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <BackButton onClick={() => navigate('home')} />
    </div>
  );
}
