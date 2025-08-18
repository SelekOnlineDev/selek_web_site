import React from "react";
import styled, { keyframes } from "styled-components";
import MatrixBackground from "../components/atoms/MatrixBackground";

const retroGreen = "#8dfba4";

export default function Offers() {
  return (
    <ServicesWrapper>
      <MatrixBackground />
      <Content>
        <Title>Offers</Title>
        <Cards>
          {offersData.map((offer, index) => (
            <Card key={index}>
              <CardTitle>{offer.title}</CardTitle>
              <Price>{offer.price}</Price>
              <CardDesc>{offer.description}</CardDesc>
              <ul>
                {offer.features.map((feature, idx) => (
                  <li key={idx}> {feature}</li>
                ))}
              </ul>
              <QuoteButton href="#contacts">REQUEST QUOTE</QuoteButton>
            </Card>
          ))}
        </Cards>
      </Content>
    </ServicesWrapper>
  );
}

const offersData = [
  {
    title: "Basic Website Package",
    price: " ",
    description: 
      "Essential web presence for startups and personal projects in retro style and modern functionality.",
    features: [
      "5-10 pages website",
      "Responsive design",
      "Basic SEO optimization",
      "Contact form integration",
      "1-2 month post-launch support",
      "Retro design elements",
    ],
  },
  {
    title: "Business Website Solution",
    price: " ",
    description:
      "Comprehensive solution for growing personal or businesses needing dynamic content.",
    features: [
      "10-20 pages website",
      "Advanced SEO strategies",
      "Social media integration",
      "3 months dedicated support",
      "Analytics and reporting setup",
      "Retro design for free",
    ],
  },
  {
    title: "E-commerce Platform",
    price: " ",
    description:
      "Full-featured online store with secure payment processing.",
    features: [
      "Product catalog management",
      "Shopping cart functionality",
      "Payment gateway integration",
      "Order and inventory management",
      "Customer account system",
      "3-6 months priority support",
    ],
  },
  {
    title: "Custom Web Application",
    price: " ",
    description:
      "Tailored software development for unique business requirements.",
    features: [
      "Bespoke functionality",
      "Complex database architecture",
      "Secure user authentication",
      "Intuitive admin panel",
      "API development and integration",
      "Ongoing maintenance and updates",
    ],
  },
];

// Animation for flickering text effect
const flicker = keyframes`
  0%, 18%, 22%, 25%, 53%, 57%, 100% { text-shadow: 0 0 10px ${retroGreen}; }
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
  text-shadow: 0 0 10px ${retroGreen};
  font-size: clamp(1.6rem, 3.5vw, 2.6rem);
  margin-bottom: 1.5rem;
  animation: ${flicker} 2s infinite;
`;

const Cards = styled.div`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(2, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  background: #000;
  border-radius: 12px;
  padding: 1.25rem;
  border: 2px solid ${retroGreen};
  color: var(--retro-green);
  font-family: "Pixelion", "Orbitron", monospace;
  text-align: left;
  display: flex;
  flex-direction: column;
  min-height: 280px;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(141, 251, 164, 0.12);
  }

  ul {
    padding-left: 15px;
    margin: 0 0 1rem 0;
  }

  li {
    font-size: 0.9rem;
    margin-bottom: 5px;
  }
`;

const CardTitle = styled.h3`
  margin: 0 0 0.45rem 0;
  font-size: 1.05rem;
`;

const Price = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  text-shadow: 0 0 6px ${retroGreen};
  margin-bottom: 10px;
`;

const CardDesc = styled.p`
  color: rgba(141, 251, 164, 0.9);
  font-size: 0.92rem;
  line-height: 1.45;
  margin: 0 0 0.9rem 0;
`;

const QuoteButton = styled.a`
  margin-top: auto;
  align-self: flex-start; 
  background: transparent;
  border: 2px solid ${retroGreen};
  border-radius: 8px; 
  color: var(--retro-green);
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


