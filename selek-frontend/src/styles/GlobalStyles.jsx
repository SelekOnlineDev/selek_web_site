import { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`
  :root {
    --retro-green: #8DFBA4;
    --header-height: 65px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root { height: 100%; background: #000; }

  body {
    color: var(--retro-green);
    font-family: 'Orbitron', monospace, system-ui;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - var(--header-height));
    padding-top: var(--header-height);
  }

  a { color: var(--retro-green); text-decoration: none; }

  button, input, select {
    font-family: inherit;
    border-radius: 8px;
  }
`;

export default Global;
