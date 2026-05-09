import { useEffect, useRef } from 'react';

export default function StarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const stars = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function init() {
      stars.length = 0;
      for (let i = 0; i < 140; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.3 + 0.2,
          opacity: Math.random() * 0.6 + 0.2,
          dOpacity: (Math.random() - 0.5) * 0.008,
          speed: Math.random() * 0.15 + 0.03,
          drift: (Math.random() - 0.5) * 0.05,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.opacity += s.dOpacity;
        if (s.opacity > 0.8 || s.opacity < 0.1) s.dOpacity *= -1;
        s.y -= s.speed;
        s.x += s.drift;
        if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; }
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,163,184,${s.opacity})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    const handleResize = () => { resize(); init(); };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      style={{ opacity: 0.45 }}
    />
  );
}
