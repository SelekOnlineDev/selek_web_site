import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";
import i18n from "i18next";

i18n.on("languageChanged", (lng) => {
  document.body.classList.remove("lang-en", "lang-lt");
  document.body.classList.add(`lang-${lng}`);
});

document.body.classList.add(`lang-${i18n.language}`);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
