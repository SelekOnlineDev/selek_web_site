import GlobalStyles from "./styles/GlobalStyles";
import Header from "./components/organisms/Header";
import Footer from "./components/organisms/Footer";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Offers from "./pages/Offers";
import Contacts from "./pages/Contacts";

import "./i18n";

export default function App() {
  return (
    <>
      <GlobalStyles />
      <Header />

      <main style={{ paddingTop: "65px" }}>
        <section id="home"><Home /></section>
        <section id="services"><Services /></section>
        <section id="offers"><Offers /></section>
        <section id="contacts"><Contacts /></section>
      </main>

      <Footer />
    </>
  );
}
