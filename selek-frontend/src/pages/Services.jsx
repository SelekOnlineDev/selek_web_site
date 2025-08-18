import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  FaGlobe,
  FaLaptopCode,
  FaDatabase,
  FaMobileAlt,
  FaBolt,
  FaPalette,
} from "react-icons/fa";

/* Inlined MatrixBackground */
const MatrixBackground = ({ color = "var(--retro-green)" }) => {
  const canvasRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    const update = () => setHeaderHeight(header ? header.offsetHeight : 0);
    update();
    if (header) {
      const ro = new ResizeObserver(update);
      ro.observe(header);
      return () => ro.disconnect();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight - headerHeight);

    const cols = Math.floor(width / 20) + 1;
    const ypos = Array(cols).fill(0);

    let raf;
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = color;
      ctx.font = "15pt monospace";

      ypos.forEach((y, ind) => {
        const text = String.fromCharCode(0x30a0 + Math.random() * 96);
        const x = ind * 20;
        ctx.fillText(text, x, y);
        ypos[ind] = y > height + Math.random() * 10000 ? 0 : y + 20;
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight - headerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(raf);
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
        zIndex: -1,
        width: "100%",
        height: `calc(100% - ${headerHeight}px)`,
      }}
    />
  );
};

export default function Services() {
  const services = [
    {
      icon: <FaGlobe />,
      title: "Website Design & Development",
      desc:
        "Custom websites built with modern technologies like React, HTML, CSS, JavaScript or TypeScript. From static    websites to full-stack applications, we code with precision and performance in mind",
      stack: ["ReactJS", "NodeJS", "HTML", "CSS", "JavaScript", "TypeScript"],
    },
    {
      icon: <FaLaptopCode />,
      title: "Frontend Development & UI/UX Design",
      desc:
        "Interactive and responsive user interfaces that work seamlessly across devices, with a classic terminal feel and retro design. Perfectly pixel-perfect, designed to engage and delight your users.",
      stack: ["ReactJS", "TypeScript", "Tailwind CSS", "Responsive Design"],
    },
    {
      icon: <FaDatabase />,
      title: "Backend Development",
      desc:
        "Robust server-side solutions with database integration and API development, ensuring your data is always online. Hosting websites on paid and free servers.",
      stack: ["NodeJS", "SQL", "NoSQL", "REST APIs", "ExpressJS"],
    },
    {
      icon: <FaMobileAlt />,
      title: "Mobile-First Design",
      desc:
        "Websites optimized for mobile devices with touch-friendly interfaces, designed to look great on any screen, old or new. Responsive, fast, and mobile-friendly apps that work seamlessly on any device.",
      stack: ["Responsive Design", "PWA", "Mobile Optimization", "App Dev"],
    },
    {
      icon: <FaBolt />,
      title: "Performance Optimization",
      desc:
        "Fast-loading websites with optimized code and modern development practices, ensuring maximum efficiency.",
      stack: ["Performance Tuning", "SEO", "Code Optimization"],
    },
    {
      icon: <FaPalette />,
      title: "Logo Creation & Design",
      desc:
        "Professional logo design and brand identity creation, design development.",
      stack: ["Logo Design", "Brand Identity", "Visual Design", "AI Design"],
    },
  ];

  return (
    <ServicesWrapper id="services">
      <MatrixBackground />
      <Content>
        <Title>Services</Title>

        <Cards>
          {services.map((s, idx) => (
            <Card key={idx}>
              <Icon>{s.icon}</Icon>
              <CardTitle>{s.title}</CardTitle>
              <CardDesc>{s.desc}</CardDesc>

              <TechList>
                {s.stack.map((t, i) => (
                  <TechPill key={i}>{t}</TechPill>
                ))}
              </TechList>
            </Card>
          ))}
        </Cards>
      </Content>
    </ServicesWrapper>
  );
}

/* STYLES */
// Animation for flickering text effect
const flicker = keyframes`
  0%, 18%, 22%, 25%, 53%, 57%, 100% { text-shadow: 0 0 10px var(--retro-green); }
  20%, 24%, 55% { text-shadow: none; }
`;

const ServicesWrapper = styled.section`
  position: relative;
  min-height: 100vh;
  padding: 3.5rem 1.5rem;
  margin-top: 1rem;
  background: transparent; 
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  max-width: 978px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  font-family: "Pixelion", "Orbitron", monospace;
  color: var(--retro-green);
  text-shadow: 0 0 10px var(--retro-green);
  font-size: clamp(1.6rem, 3.5vw, 2.6rem);
  margin-bottom: 1.5rem;
  animation: ${flicker} 2s infinite;
`;

const Cards = styled.div`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const Card = styled.article`
  background: #000; 
  border-radius: 12px;
  padding: 1.25rem;
  border: 2px solid var(--retro-green);
  color: var(--retro-green);
  font-family: "Pixelion", "Orbitron", monospace;
  text-align: left;
  display: flex;
  flex-direction: column;
  min-height: 210px;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(141, 251, 164, 0.12);
  }
`;

const Icon = styled.div`
  font-size: 2.1rem;
  color: var(--retro-green);
  margin-bottom: 0.6rem;
  display: inline-flex;
  align-items: center;
`;

const CardTitle = styled.h3`
  color: var(--retro-green);
  margin: 0 0 0.45rem 0;
  font-size: 1.05rem;
`;

const CardDesc = styled.p`
  color: rgba(141, 251, 164, 0.9);
  font-size: 0.92rem;
  line-height: 1.45;
  margin: 0 0 0.9rem 0;
`;

const TechList = styled.div`
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const TechPill = styled.span`
  border: 1px solid var(--retro-green);
  color: var(--retro-green);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.78rem;
  background: rgba(0, 0, 0, 0.35);
`;
