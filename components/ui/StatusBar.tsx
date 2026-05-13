'use client';

export function StatusBar() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 px-7 md:px-12 py-4 flex items-center justify-between pointer-events-none border-t border-forge-oxide/15 bg-gradient-to-t from-black/70 to-transparent backdrop-blur-sm">
      <div className="terminal-text pointer-events-auto">
        <span className="live-dot" />
        SYSTEMS / ONLINE
      </div>
      <div className="terminal-text pointer-events-auto hidden sm:block" style={{ color: '#5a4a38' }}>
        MADE WITH GRIT — FOR THE CURIOUS
      </div>
      <div className="terminal-text pointer-events-auto" style={{ color: '#5a4a38' }}>
        © {new Date().getFullYear()} ADARSH RUST
      </div>
    </footer>
  );
}
