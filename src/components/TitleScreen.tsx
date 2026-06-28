import { useEffect, useState } from 'react';

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    setFading(true);
    setTimeout(() => onStart(), 1200);
  };

  return (
    <div
      className={`title-screen ${visible ? 'visible' : ''} ${fading ? 'fading' : ''}`}
      onClick={handleStart}
    >
      {/* Falling petals background */}
      <div className="petals-bg">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="petal"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
              opacity: 0.3 + Math.random() * 0.4,
              fontSize: `${12 + Math.random() * 16}px`,
            }}
          >
            🌸
          </div>
        ))}
      </div>

      {/* Title content */}
      <div className="title-content">
        <div className="title-flower">🌸</div>
        <h1 className="title-text">A Garden For You</h1>
        <p className="title-subtitle">A Birthday Story</p>
        <div className="title-divider">✿ ✿ ✿</div>
        <button className="title-start" onClick={handleStart}>
          Begin Your Journey
        </button>
        <p className="title-hint">Click anywhere to start</p>
      </div>

      {/* Bottom decoration */}
      <div className="title-bottom-flowers">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="bottom-flower"
            style={{
              animationDelay: `${i * 0.15}s`,
            }}
          >
            {['🌷', '🌹', '🌻', '🌼', '💐', '🌺'][i % 6]}
          </span>
        ))}
      </div>
    </div>
  );
}
