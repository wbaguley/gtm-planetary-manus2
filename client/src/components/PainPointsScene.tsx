import { useEffect, useRef, useState } from "react";

interface PainPointsSceneProps {
  scrollProgress: number;
  className?: string;
}

/**
 * Premium CSS 3D morphing object for the pain points section.
 * Red/orange theme representing friction and chaos, morphing
 * into green/teal as solutions are revealed.
 */
export function PainPointsScene({ scrollProgress, className = "" }: PainPointsSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const phase = scrollProgress;

  // Color transition: red (chaos) → green (resolved)
  const redAmount = Math.max(0, 1 - phase * 0.4);
  const greenAmount = Math.min(1, phase * 0.35);
  const hue1 = 0 + phase * 40; // red → orange → yellow
  const hue2 = 15 + phase * 50; // shifts toward green
  const saturation = 75 + Math.sin(phase) * 10;

  // Shape morph: jagged/angular (chaos) → smooth (resolved)
  const chaos = Math.max(0, 1 - phase * 0.3);
  const br1 = 30 + chaos * 20 + Math.sin(phase * 3) * 10;
  const br2 = 50 - chaos * 25 + Math.cos(phase * 2) * 8;
  const br3 = 40 + chaos * 15 - Math.sin(phase * 2.5) * 12;
  const br4 = 45 - chaos * 20 + Math.cos(phase * 3.5) * 6;
  const borderRadius = `${br1}% ${100 - br1}% ${br2}% ${100 - br2}% / ${br3}% ${br4}% ${100 - br4}% ${100 - br3}%`;

  const rotation = phase * 60;
  const scale = 0.95 + Math.sin(phase * 1.2) * 0.08;
  const glowIntensity = 0.25 + Math.sin(phase * 2) * 0.12;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center ${className}`}
    >
      {/* Deep glow */}
      <div
        className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full blur-[80px] transition-all duration-700"
        style={{
          background: `radial-gradient(circle, hsla(${hue1}, ${saturation}%, 50%, ${glowIntensity * 0.5}) 0%, hsla(${hue2}, 60%, 35%, 0.06) 50%, transparent 70%)`,
          transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
        }}
      />

      {/* Main morphing object */}
      <div
        className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 transition-all duration-500 ease-out"
        style={{
          borderRadius,
          transform: `
            perspective(800px)
            rotateX(${mousePos.y * 10 + phase * 10}deg)
            rotateY(${mousePos.x * 10 + rotation}deg)
            rotateZ(${phase * 12 + Math.sin(phase * 2) * 8}deg)
            scale(${scale})
          `,
        }}
      >
        {/* Glass surface */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            borderRadius: "inherit",
            background: `linear-gradient(${120 + phase * 60}deg, hsla(${hue1}, ${saturation}%, 50%, 0.16) 0%, hsla(${hue2}, 65%, 40%, 0.06) 40%, hsla(${hue1 + 20}, 55%, 30%, 0.1) 70%, hsla(${hue2 + 15}, 75%, 45%, 0.08) 100%)`,
            backdropFilter: "blur(30px)",
            border: `1px solid hsla(${hue1}, 70%, 55%, 0.15)`,
            boxShadow: `
              inset 0 0 60px hsla(${hue1}, 80%, 55%, 0.05),
              inset 0 0 120px hsla(${hue2}, 65%, 40%, 0.03),
              0 0 40px hsla(${hue1}, 80%, 55%, ${glowIntensity * 0.35}),
              0 0 80px hsla(${hue2}, 65%, 40%, ${glowIntensity * 0.18}),
              0 20px 60px rgba(0,0,0,0.2)
            `,
          }}
        />

        {/* Inner gradient */}
        <div
          className="absolute inset-3 transition-all duration-500"
          style={{
            borderRadius: "inherit",
            background: `radial-gradient(ellipse at ${35 + mousePos.x * 15}% ${35 + mousePos.y * 15}%, hsla(${hue1}, 85%, 65%, 0.18) 0%, hsla(${hue2}, 70%, 45%, 0.06) 45%, transparent 70%)`,
          }}
        />

        {/* Specular highlight */}
        <div
          className="absolute top-3 left-3 w-1/2 h-1/3 transition-all duration-400"
          style={{
            borderRadius: "inherit",
            background: "linear-gradient(135deg, hsla(0,0%,100%,0.08) 0%, transparent 55%)",
            transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)`,
          }}
        />

        {/* Animated rings */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            borderRadius: "inherit",
            border: `1px solid hsla(${hue1}, 75%, 55%, ${0.06 + Math.sin(phase * 3) * 0.05})`,
            transform: `scale(${1.1 + Math.sin(phase * 2) * 0.04})`,
          }}
        />
      </div>

      {/* Orbiting particles - more erratic for chaos theme */}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2 + phase * 0.7;
        const wobble = Math.sin(phase * 3 + i * 1.2) * 15 * chaos;
        const radius = 120 + Math.sin(phase * 2 + i) * 20 + wobble;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.75;
        const size = 1.5 + Math.sin(phase + i * 0.6) * 1;
        const opacity = 0.15 + Math.sin(phase + i * 0.9) * 0.12;
        return (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: `hsla(${hue1 + i * 10}, 80%, 65%, ${opacity})`,
              boxShadow: `0 0 ${size * 3}px hsla(${hue1 + i * 10}, 80%, 55%, ${opacity * 0.5})`,
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
              transition: "all 0.25s ease-out",
            }}
          />
        );
      })}
    </div>
  );
}
