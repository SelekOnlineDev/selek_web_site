import styled from "styled-components";

export default function Footer() {
  return (
    <FooterWrapper>
      <FooterContent>
        <p>© {new Date().getFullYear()} Digital Excellence. All rights reserved.</p>
      </FooterContent>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.4); 
  border-top: 2px solid #8dfba4;
  backdrop-filter: blur(3px); 
  z-index: 100;
`;

const FooterContent = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  padding: 1rem;
  height: 55px;
  color: #8dfba4;
  text-align: center;
  font-family: 'Pixelion', 'Orbitron', monospace;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.8rem;
  }
`;
