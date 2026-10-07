import React from "react";

export default function ComingSoon() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050A09] px-6 text-center">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[#0A2E24]/40 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-[#073B3A]/30 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A2E24] text-[#00D1C1] ring-1 ring-[#00D1C1]/30">
          <span className="font-heading text-2xl font-bold">A</span>
        </div>
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-[#22E37A]">
          Divine Tech AI
        </p>
        <h1 className="max-w-2xl font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
          The website is under construction and will launch soon.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-[#7FE3D9]/70">
          Stay tuned — something remarkable is on its way.
        </p>
      </div>
    </div>
  );
}