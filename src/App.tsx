export default function App() {
  return (
    <main className="min-h-screen bg-[var(--brand-obsidian)] text-[var(--brand-pure-white)] flex flex-col items-center justify-center p-6 antialiased">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--brand-pure-white)]">
          HASH<span className="text-[var(--brand-neon-green)]">.</span>DEVS
        </h1>
        <p className="text-sm tracking-wide uppercase text-white/60">
          Build with purpose. Grow with clarity.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">
          <span className="w-2 h-2 rounded-full bg-[var(--brand-neon-green)] animate-pulse"></span>
          <span>Stage 01 Foundation Ready</span>
        </div>
      </div>
    </main>
  );
}
