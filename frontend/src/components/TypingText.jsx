import { useState, useEffect } from 'react';

export default function TypingText({ texts = [], speed = 75, eraseSpeed = 40, pause = 2200 }) {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState('typing');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (!texts.length) return;
    const current = texts[textIdx];

    if (phase === 'typing') {
      if (charIdx < current.length) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx(i => i + 1);
        }, speed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase('erasing'), pause);
      return () => clearTimeout(t);
    }

    if (phase === 'erasing') {
      if (charIdx > 0) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx(i => i - 1);
        }, eraseSpeed);
        return () => clearTimeout(t);
      }
      setTextIdx(i => (i + 1) % texts.length);
      setPhase('typing');
    }
  }, [phase, charIdx, textIdx, texts, speed, eraseSpeed, pause]);

  return (
    <span>
      {displayed}
      <span className="inline-block w-0.5 h-[1em] bg-blue-400 ml-0.5 align-middle animate-blink" />
    </span>
  );
}
