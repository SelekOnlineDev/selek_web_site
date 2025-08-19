import styled from "styled-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const HeaderWrapper = styled.header`
  position: fixed; 
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 2px solid #8dfba4;
  backdrop-filter: blur(3px);
  z-index: 100;
`;

const Nav = styled.nav`
  max-width: 1024px; 
  margin: 0 auto;    
  width: 100%;
  height: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.5rem;
  font-family: inherit;

  h1 { 
    font-size: 1.5rem; 
    color: #8dfba4; 
    cursor: pointer; 
    user-select: none;
  }

  ul {
    display: flex;
    list-style: none;
    gap: 1rem;

    @media (max-width: 758px) {
      flex-direction: column;
      position: fixed;
      top: 90px;
      right: 0;
      background: rgba(0, 0, 0, 0.9);
      padding: 1.25rem;
      width: 200px;
      border-left: 2px solid #8dfba4;
      transform: translateX(100%) scale(1.15);
      opacity: 0;
      transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    }
    &.open { 
      transform: translateX(0) scale(1.15);
      opacity: 1; }
  }

  li a { 
    color: #8dfba4; 
    text-decoration: none; 
    cursor: pointer; 
    transition: color 0.2s ease-in-out;
  }
  li a:hover { 
    color: white; 
  }

  .lang-btns {
    display: flex; 
    gap: 0.5rem;
    button {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid #8dfba4;
      color: #8dfba4;
      font-family: inherit;
      padding: 0.3rem 0.6rem;
      cursor: pointer;
      transition: background 0.2s ease-in-out;
    }
    button:hover {
      background: rgba(141, 251, 164, 0.2);
    }
  }

  .desktop-only { 
    @media (max-width: 758px) { display: none; } 
  }

  .mobile-container {
    display: none; 
    align-items: center; 
    gap: 0.5rem;
    @media (max-width: 758px) { display: flex; }
  }

  .menu-icon {
    display: none; 
    color: #8dfba4; 
    font-size: 2rem;
    cursor: pointer;
    @media (max-width: 758px) { display: block; }
  }
`;

export default function Header() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const changeLang = (lng) => i18n.changeLanguage(lng);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <HeaderWrapper>
      <Nav>
        <h1 onClick={() => scrollToSection("home")}>Selek</h1>

        <ul className={menuOpen ? "open" : ""}>
          <li><a onClick={() => scrollToSection("home")}>{t("nav.home")}</a></li>
          <li><a onClick={() => scrollToSection("services")}>{t("nav.services")}</a></li>
          <li><a onClick={() => scrollToSection("offers")}>{t("nav.offers")}</a></li>
          <li>
            <a 
              href="https://github.com/SelekOnlineDev/" 
              target="_blank" 
              rel="noopener noreferrer">
              {t("nav.projects")}
            </a>
          </li>
          <li><a onClick={() => scrollToSection("contacts")}>{t("nav.contacts")}</a></li>
        </ul>

        <div className="lang-btns desktop-only">
          <button onClick={() => changeLang("en")}>EN</button>
          <button onClick={() => changeLang("lt")}>LT</button>
        </div>

        <div className="mobile-container">
          <div className="lang-btns">
            <button onClick={() => changeLang("en")}>EN</button>
            <button onClick={() => changeLang("lt")}>LT</button>
          </div>
          <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </div>
        </div>
      </Nav>
    </HeaderWrapper>
  );
}
