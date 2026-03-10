import { useEffect, useRef } from "react";
import styles from "./SakuraCanvas.module.scss";

interface Petal {
  x: number; y: number; size: number;
  speedX: number; speedY: number;
  rotation: number; rotationSpeed: number;
  opacity: number;
  sway: number; swaySpeed: number; swayOffset: number;
}

function createPetal(canvasWidth: number): Petal {
  return {
    x: Math.random() * canvasWidth,
    y: -20 - Math.random() * 100,
    size: 6 + Math.random() * 10,
    speedX: -0.5 + Math.random() * 1,
    speedY: 0.8 + Math.random() * 1.2,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.04,
    opacity: 0.5 + Math.random() * 0.5,
    sway: 0,
    swaySpeed: 0.01 + Math.random() * 0.02,
    swayOffset: Math.random() * Math.PI * 2,
  };
}

function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal) {
  ctx.save();
  ctx.translate(petal.x, petal.y);
  ctx.rotate(petal.rotation);
  ctx.globalAlpha = petal.opacity;

  const s = petal.size;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.6, -s * 0.6, s * 0.8, s * 0.2, 0, s);
  ctx.bezierCurveTo(-s * 0.8, s * 0.2, -s * 0.6, -s * 0.6, 0, -s);
  ctx.fillStyle = "#f03f52";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, -s * 0.8);
  ctx.lineTo(0, s * 0.8);
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  ctx.restore();
}

export default function SakuraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    petalsRef.current = Array.from({ length: 35 }, () => {
      const p = createPetal(canvas.width);
      p.y = Math.random() * canvas.height;
      return p;
    });

    const animate = (time: number) => {
      timeRef.current = time;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petalsRef.current.forEach((p) => {
        p.sway = Math.sin(time * p.swaySpeed + p.swayOffset) * 1.5;
        p.x += p.speedX + p.sway * 0.05;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height + 30) Object.assign(p, createPetal(canvas.width));
        drawPetal(ctx, p);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}