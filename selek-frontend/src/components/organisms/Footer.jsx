import styled from "styled-components";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <FooterWrapper>
      <FooterContent>
        <p>
          © {new Date().getFullYear()} {t("footer.company")}. {t("footer.rights")}
        </p>
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
  font-family: inherit;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.8rem;
  }
`;
