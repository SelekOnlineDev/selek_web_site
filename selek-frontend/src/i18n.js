import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import lt from "./locales/lt/translation.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      lt: { translation: lt },
    },
    lng: "en",            // default kalba
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

// iškart nustatome lang pagal pradinę kalbą
document.documentElement.setAttribute("lang", i18n.language);

// atnaujiname kai vartotojas keičia kalbą
i18n.on("languageChanged", (lng) => {
  document.documentElement.setAttribute("lang", lng);
});

export default i18n;
