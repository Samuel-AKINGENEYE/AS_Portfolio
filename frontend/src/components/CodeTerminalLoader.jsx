import { useEffect, useState } from 'react';

const LOADING_LINES = [
  '$ npm run build',
  '→ Compiling assets...',
  '→ Bundling modules...',
  '→ Optimizing images...',
  '→ Loading profile data...',
  '→ Fetching projects...',
  '→ Rendering components...',
  '✓ Build complete in 234ms',
];

const LOAD_DELAY = 45; // ms per line - ultra-fast! (360ms total for 8 lines)

export default function CodeTerminalLoader() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const isComplete = visibleLines >= LOADING_LINES.length;

  // Animate lines with sub-100ms transitions for snappy feel
  useEffect(() => {
    if (isComplete) {
      setShowCursor(false);
      return;
    }
    const timer = setTimeout(() => setVisibleLines(v => v + 1), LOAD_DELAY);
    return () => clearTimeout(timer);
  }, [visibleLines, isComplete]);

  // Blinking cursor (fast pulse)
  useEffect(() => {
    if (!isComplete) {
      const timer = setInterval(() => setShowCursor(s => !s), 400);
      return () => clearInterval(timer);
    }
  }, [isComplete]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 animate-fade-in">
      {/* Animated background - optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl will-change-transform" style={{ animation: 'pulse 4s ease-in-out infinite' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl will-change-transform" style={{ animation: 'pulse 4s ease-in-out 1s infinite' }} />
      </div>

      {/* Terminal window */}
      <div className="relative w-full max-w-2xl">
        <div className="rounded-lg overflow-hidden border border-slate-700/50 shadow-2xl bg-[#0d1117]">
          {/* Title bar - static, not animated */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-slate-700/50 flex-shrink-0">
            <div className="flex gap-1.5">
              <button className="w-3 h-3 rounded-full bg-red-400 hover:opacity-80 transition-opacity" disabled />
              <button className="w-3 h-3 rounded-full bg-yellow-400 hover:opacity-80 transition-opacity" disabled />
              <button className="w-3 h-3 rounded-full bg-green-400 hover:opacity-80 transition-opacity" disabled />
            </div>
            <div className="ml-3 font-mono text-xs text-slate-400 whitespace-nowrap">portfolio.sh</div>
          </div>

          {/* Content - optimized rendering */}
          <div className="p-6 font-mono text-sm space-y-0 min-h-80 flex flex-col justify-center">
            {LOADING_LINES.map((line, idx) => {
              const isVisible = idx < visibleLines;
              return (
                <div
                  key={idx}
                  className={`transition-all duration-75 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-1'
                  }`}
                  style={{ willChange: isVisible ? 'auto' : 'opacity, transform' }}
                >
                  <span className="text-slate-400">
                    {line.startsWith('$') ? (
                      <>
                        <span className="text-green-400">$</span>
                        <span className="text-slate-300">{line.slice(1)}</span>
                      </>
                    ) : line.startsWith('✓') ? (
                      <>
                        <span className="text-green-400">✓</span>
                        <span className="text-green-300">{line.slice(1)}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-blue-400">{line.slice(0, 2)}</span>
                        <span className="text-slate-300">{line.slice(2)}</span>
                      </>
                    )}
                  </span>
                </div>
              );
            })}

            {/* Blinking cursor - performance optimized */}
            {!isComplete && (
              <div className="mt-1">
                <span className="text-slate-400">
                  <span className="text-green-400">$</span>
                  <span 
                    className={`inline-block ml-1 w-2 h-4 bg-green-400 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
                    style={{ willChange: 'opacity' }}
                  />
                </span>
              </div>
            )}

            {/* Completion message - appears when done */}
            {isComplete && (
              <div className="mt-2 pt-2 border-t border-slate-700/30 animate-fade-in">
                <p className="text-green-400 text-xs font-semibold">
                  → Ready to explore!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom status dots - low-cost animation */}
        <div className="mt-4 text-center">
          <p className="text-slate-500 text-xs font-mono tracking-widest uppercase">
            Loading your portfolio
          </p>
          <div className="flex gap-1 justify-center mt-2">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-accent"
                style={{
                  animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  animationDelay: `${i * 0.3}s`,
                  willChange: 'opacity',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
