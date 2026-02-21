import { useEffect, useRef, useState } from "react";

interface Scene3DProps {
  scrollProgress: number;
  className?: string;
}

/**
 * Premium CSS 3D morphing orb with glassmorphism, glow effects,
 * and floating particles. Responds to scroll progress and mouse position.
 */
export function Scene3D({ scrollProgress, className = "" }: Scene3DProps) {
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

  // Morph border-radius: sphere → squircle → diamond → back
  const borderRadius =
    phase < 0.5
      ? "50%"
      : phase < 1.5
      ? `${50 - (phase - 0.5) * 30}%`
      : phase < 2.5
      ? `${20 + Math.sin((phase - 1.5) * Math.PI) * 15}%`
      : "50%";

  const rotation = phase * 90;
  const scale = 1 + Math.sin(phase * 0.8) * 0.08;
  const hue1 = 270 + phase * 30;
  const hue2 = 300 + phase * 20;
  const glowIntensity = 0.3 + Math.sin(phase * 2) * 0.15;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center ${className}`}
    >
      {/* Deep background glow */}
      <div
        className="absolute w-72 h-72 md:w-[28rem] md:h-[28rem] rounded-full blur-[80px] transition-all duration-700"
        style={{
          background: `radial-gradient(circle, hsla(${hue1}, 80%, 55%, ${glowIntensity * 0.6}) 0%, hsla(${hue2}, 70%, 35%, 0.08) 50%, transparent 70%)`,
          transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
        }}
      />

      {/* Secondary ambient glow */}
      <div
        className="absolute w-48 h-48 md:w-72 md:h-72 rounded-full blur-[60px] opacity-25 transition-all duration-500"
        style={{
          background: `radial-gradient(circle, hsla(${hue2}, 90%, 65%, 0.5) 0%, transparent 60%)`,
          transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -18}px)`,
        }}
      />

      {/* Main morphing orb */}
      <div
        className="relative w-52 h-52 md:w-72 md:h-72 lg:w-80 lg:h-80 transition-all duration-700 ease-out"
        style={{
          borderRadius,
          transform: `
            perspective(800px)
            rotateX(${mousePos.y * 8 + phase * 12}deg)
            rotateY(${mousePos.x * 8 + rotation}deg)
            rotateZ(${phase * 15}deg)
            scale(${scale})
          `,
        }}
      >
        {/* Glass surface */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            borderRadius: "inherit",
            background: `linear-gradient(${135 + phase * 45}deg, hsla(${hue1}, 80%, 50%, 0.18) 0%, hsla(${hue2}, 70%, 40%, 0.06) 40%, hsla(${hue1 + 30}, 60%, 30%, 0.12) 70%, hsla(${hue2 + 20}, 80%, 50%, 0.1) 100%)`,
            backdropFilter: "blur(40px)",
            border: `1px solid hsla(${hue1}, 70%, 60%, 0.18)`,
            boxShadow: `
              inset 0 0 80px hsla(${hue1}, 80%, 60%, 0.06),
              inset 0 0 160px hsla(${hue2}, 70%, 40%, 0.03),
              0 0 50px hsla(${hue1}, 80%, 60%, ${glowIntensity * 0.4}),
              0 0 100px hsla(${hue2}, 70%, 40%, ${glowIntensity * 0.2}),
              0 25px 80px rgba(0,0,0,0.25)
            `,
          }}
        />

        {/* Inner radial gradient */}
        <div
          className="absolute inset-3 transition-all duration-700"
          style={{
            borderRadius: "inherit",
            background: `radial-gradient(ellipse at ${30 + mousePos.x * 20}% ${30 + mousePos.y * 20}%, hsla(${hue1}, 90%, 70%, 0.2) 0%, hsla(${hue2}, 80%, 50%, 0.08) 40%, transparent 70%)`,
          }}
        />

        {/* Specular highlight */}
        <div
          className="absolute top-3 left-3 w-1/2 h-1/3 transition-all duration-500"
          style={{
            borderRadius: "inherit",
            background: "linear-gradient(135deg, hsla(0,0%,100%,0.1) 0%, transparent 60%)",
            transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)`,
          }}
        />

        {/* Animated inner ring */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            borderRadius: "inherit",
            border: `1px solid hsla(${hue1}, 80%, 60%, ${0.08 + Math.sin(phase * 3) * 0.06})`,
            transform: `scale(${1.12 + Math.sin(phase * 2) * 0.04})`,
          }}
        />

        {/* Outer pulse ring */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            borderRadius: "inherit",
            border: `1px solid hsla(${hue2}, 70%, 50%, 0.04)`,
            transform: `scale(${1.25 + Math.sin(phase * 1.5) * 0.06})`,
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
      </div>

      {/* Orbiting particles */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 + phase * 0.5;
        const radius = 140 + Math.sin(phase * 2 + i) * 25;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.7; // elliptical orbit
        const size = 2 + Math.sin(phase + i * 0.5) * 1;
        const opacity = 0.2 + Math.sin(phase + i * 0.8) * 0.15;
        return (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: `hsla(${hue1 + i * 12}, 80%, 70%, ${opacity})`,
              boxShadow: `0 0 ${size * 4}px hsla(${hue1 + i * 12}, 80%, 60%, ${opacity * 0.6})`,
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
              transition: "all 0.3s ease-out",
            }}
          />
        );
      })}
    </div>
  );
}
