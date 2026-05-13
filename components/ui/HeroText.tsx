'use client';

export function HeroText() {
  return (
    <div className="fixed top-[34%] left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center w-full px-6">
      <div className="hero-sub mb-5">BUILD &nbsp; · &nbsp; FORGE &nbsp; · &nbsp; SHIP</div>
      <h1 className="hero-title">ADARSHRUST</h1>
      <p className="mt-8 max-w-xl mx-auto text-[12.5px] leading-[1.85] text-forge-bone/55 font-sans tracking-wide">
        A workshop of <span className="text-forge-glow/85">Rust projects, tools, and machinery</span>.
        <br />
        Built by an independent systems engineer.
      </p>
    </div>
  );
}
