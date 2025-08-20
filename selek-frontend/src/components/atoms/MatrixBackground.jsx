import { useEffect, useRef, useState } from "react";

const MatrixBackground = ({ color = "#00ff9f" }) => {
  const canvasRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      const updateHeight = () => setHeaderHeight(header.offsetHeight);
      updateHeight();

      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(header);
      return () => resizeObserver.disconnect();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight - headerHeight);

    const cols = Math.floor(width / 20) + 1;
    const ypos = Array(cols).fill(0);

    const draw = () => {
      ctx.fillStyle = "#0001";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = color;
      ctx.font = "15pt monospace";

      ypos.forEach((y, ind) => {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96);
        const x = ind * 20;
        ctx.fillText(text, x, y);
        if (y > height + Math.random() * 10000) ypos[ind] = 0;
        else ypos[ind] = y + 20;
      });
    };

    const interval = setInterval(draw, 50);
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight - headerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [color, headerHeight]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: `${headerHeight}px`,
        left: 0,
        zIndex: -10,
        pointerEvents: "none",
      }}
    />
  );
};

export default MatrixBackground;