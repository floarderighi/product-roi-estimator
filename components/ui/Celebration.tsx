'use client';

import { useEffect, useState } from 'react';

/**
 * Composant d'animation de célébration simple avec des confettis CSS
 */

export function Celebration() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Masquer après 3 secondes
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  const confettiColors = [
    '#3b82f6', // blue
    '#a855f7', // purple
    '#ec4899', // pink
    '#10b981', // green
    '#f59e0b', // yellow
    '#ef4444', // red
  ];

  const confetti = Array.from({ length: 50 }, (_, i) => {
    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    const left = Math.random() * 100;
    const animationDelay = Math.random() * 2;
    const animationDuration = 2 + Math.random() * 2;

    return (
      <div
        key={i}
        className="confetti"
        style={{
          left: `${left}%`,
          backgroundColor: color,
          animationDelay: `${animationDelay}s`,
          animationDuration: `${animationDuration}s`,
        }}
      />
    );
  });

  return (
    <>
      <div className="celebration-container">
        {confetti}
      </div>
      <style jsx>{`
        .celebration-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: fall linear forwards;
        }

        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
