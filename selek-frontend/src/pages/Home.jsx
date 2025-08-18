import { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const letters = "アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤャユュヨョラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(
      ""
    );
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = retroGreen;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <HomeWrapper>
      <MatrixCanvas ref={canvasRef} />
      <HeroContent>
        <h1>Crafting Digital Excellence</h1>
        <p>
          Your main terminal for professional web development services. We build pixel-perfect solutions in a retro style.
          From command-line interfaces to full applications - we turn your vision into reality.
        </p>
        <QuoteButton href="#contacts">Contact Us</QuoteButton>
      </HeroContent>
    </HomeWrapper>
  );
}

const retroGreen = "#8dfba4";

// Animation for flickering text effect
const flicker = keyframes`
  0%, 18%, 22%, 25%, 53%, 57%, 100% { text-shadow: 0 0 10px ${retroGreen}; }
  20%, 24%, 55% { text-shadow: none; }
`;

const HomeWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MatrixCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  color: ${retroGreen};
  font-family: 'Pixelion', 'Orbitron', monospace;
  text-align: center;
  padding: 3.5rem 1.5rem;
  min-width: 300px;
  max-width: 1024px;

  h1 {
    font-size: clamp(1.6rem, 5vw, 3rem);
    text-shadow: 0 0 10px ${retroGreen};
    animation: ${flicker} 2s infinite;
    margin-bottom: 2rem;
  }

  p {
    border: 2px solid ${retroGreen};
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.92);
    padding: 1rem;
    font-size: clamp(0.95rem, 2vw, 1.2rem);
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  a {
    display: none;
  }

  @media (max-width: 658px) {
    a {
      display: inline-block;
    }
  }
`;

const QuoteButton = styled.a`
  margin-top: auto;
  align-self: flex-start;
  background: black;
  border: 2px solid ${retroGreen};
  border-radius: 8px;
  color: ${retroGreen};
  padding: 10px 15px;
  font-weight: bold;
  font-family: "Orbitron", monospace;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:link,
  &:visited,
  &:active {
    color: ${retroGreen};
  }

  &:hover {
    background: rgba(141, 251, 164, 0.2);
    color: ${retroGreen};
    border-color: ${retroGreen}; 
    box-shadow: 0 0 5px ${retroGreen}, 0 0 5px ${retroGreen};
  } 
  &:focus {
    outline: none;
    border-color: ${retroGreen}; 
    box-shadow: 0 0 5px ${retroGreen}, 0 0 5px ${retroGreen};
  }
`;
