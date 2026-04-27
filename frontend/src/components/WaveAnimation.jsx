import React, { useEffect, useRef } from 'react';

export default function WaveAnimation() {
  const canvasRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    let mouse = { x: -1000, y: -1000 };
    let tick = 0;
    let animationId;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    resize();

    // Wave layers
    const waves = [
      { y: 0.35, length: 0.003, amplitude: 80, speed: 0.015, color: 'rgba(0, 180, 255, 0.08)', lineWidth: 1 },
      { y: 0.42, length: 0.004, amplitude: 65, speed: 0.012, color: 'rgba(0, 160, 230, 0.12)', lineWidth: 1.5 },
      { y: 0.50, length: 0.005, amplitude: 50, speed: 0.018, color: 'rgba(0, 140, 210, 0.16)', lineWidth: 2 },
      { y: 0.58, length: 0.006, amplitude: 40, speed: 0.014, color: 'rgba(0, 120, 190, 0.20)', lineWidth: 2.5 },
      { y: 0.66, length: 0.007, amplitude: 30, speed: 0.020, color: 'rgba(0, 100, 170, 0.24)', lineWidth: 3 },
    ];

    // Particles
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2 + 0.5,
      speedY: Math.random() * -0.8 - 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    function draw() {
      ctx.fillStyle = '#000d1a';
      ctx.fillRect(0, 0, w, h);

      // Draw particles
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) { p.y = h; p.x = Math.random() * w; }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 180, 255, ${p.opacity})`;
        ctx.fill();
      });

      // Draw waves
      waves.forEach((wave, i) => {
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 5) {
          const dy = Math.sin(x * wave.length + tick * wave.speed + i) * wave.amplitude;
          const dy2 = Math.sin(x * wave.length * 0.5 + tick * wave.speed * 1.3 + i * 2) * wave.amplitude * 0.5;
          const baseY = h * wave.y + dy + dy2;
          ctx.lineTo(x, baseY);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();

        // Stroke line
        ctx.beginPath();
        for (let x = 0; x <= w; x += 5) {
          const dy = Math.sin(x * wave.length + tick * wave.speed + i) * wave.amplitude;
          const dy2 = Math.sin(x * wave.length * 0.5 + tick * wave.speed * 1.3 + i * 2) * wave.amplitude * 0.5;
          const baseY = h * wave.y + dy + dy2;
          if (x === 0) ctx.moveTo(x, baseY);
          else ctx.lineTo(x, baseY);
        }
        ctx.strokeStyle = wave.color.replace(/[\d.]+\)$/, '0.4)');
        ctx.lineWidth = wave.lineWidth;
        ctx.stroke();
      });

      // Mouse interaction glow
      if (mouse.x > -100) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 250);
        gradient.addColorStop(0, 'rgba(0, 180, 255, 0.12)');
        gradient.addColorStop(0.5, 'rgba(0, 140, 210, 0.04)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      tick++;
      animationId = requestAnimationFrame(draw);
    }

    draw();

    // Logo fade-in
    if (logoRef.current) {
      setTimeout(() => {
        logoRef.current.style.opacity = '1';
        logoRef.current.style.transform = 'translateX(-50%) translateY(0)';
      }, 800);
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      {/* Center Logo */}
      <div
        ref={logoRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '10%',
          transform: 'translateX(-50%) translateY(-40px)',
          zIndex: 20,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 2s ease, transform 2s ease',
          textAlign: 'center',
        }}
      >
        <img
          src="/logo.jpeg"
          alt="Sukumar Industries"
          style={{
            width: 160,
            height: 'auto',
            borderRadius: 16,
            boxShadow: '0 0 60px rgba(0,180,255,0.6), 0 0 120px rgba(0,100,255,0.3)',
            display: 'block',
            margin: '0 auto',
          }}
        />
      </div>
    </div>
  );
}

