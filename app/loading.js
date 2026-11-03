export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#05010f]">
      <div className="loader-cube" />
      <p className="font-mono text-xs tracking-[0.4em] text-cyan-300/80">CONSULTANDO GITHUB…</p>
    </div>
  );
}