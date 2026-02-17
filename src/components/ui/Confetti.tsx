"use client";

import { useState, useEffect } from "react";

const COLORS = [
  "#f59e0b", "#22c55e", "#8b5cf6", "#ec4899", "#06b6d4",
  "#eab308", "#14b8a6", "#f97316",
];

interface Particle {
  id: number;
  tx: number;
  ty: number;
  color: string;
  size: number;
  delay: number;
  x: number;
  y: number;
}

function makeParticles(seed: number): Particle[] {
  const out: Particle[] = [];
  const rnd = (max: number) => {
    const x = Math.sin(seed * 999 + out.length * 123) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };
  for (let i = 0; i < 55; i++) {
    const angle = (i / 55) * Math.PI * 2 + (rnd(100) / 100) * 0.5;
    const dist = 150 + rnd(200);
    out.push({
      id: i,
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist - 80,
      color: COLORS[rnd(COLORS.length)],
      size: 6 + rnd(6),
      delay: rnd(80) * 0.01,
      x: (rnd(20) - 10),
      y: (rnd(20) - 10),
    });
  }
  return out;
}

interface ConfettiProps {
  /** Increment to trigger a new burst */
  trigger: number;
}

export function Confetti({ trigger }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger < 1) return;
    setParticles(makeParticles(trigger));
    const t = setTimeout(() => setParticles([]), 2000);
    return () => clearTimeout(t);
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center" aria-hidden>
      {particles.map((p) => (
        <div
          key={`${trigger}-${p.id}`}
          className="absolute w-2 h-2 rounded-sm animate-confetti"
          style={{
            left: "50%",
            top: "50%",
            marginLeft: p.x,
            marginTop: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            ["--tx" as string]: `${p.tx}px`,
            ["--ty" as string]: `${p.ty}px`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
