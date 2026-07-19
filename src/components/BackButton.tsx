interface Props { onClick: () => void; }

export default function BackButton({ onClick }: Props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 16px' }}>
      <button className="back-btn" onClick={onClick}>
        &lt;- Back to Forest Root
      </button>
    </div>
  );
}
