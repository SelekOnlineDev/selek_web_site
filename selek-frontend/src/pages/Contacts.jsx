import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import MatrixBackground from "../components/atoms/MatrixBackground";

const retroGreen = "#8DFBA4";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().required("Message is required"),
});

export default function Contacts() {
  const [status, setStatus] = useState({ type: '', message: '' });
  const { t, i18n } = useTranslation();
  
  // Fiksuotas API URL, nes .env kintamieji gali neveikti
  const apiUrl = "http://localhost:5500";
  
  console.log("API URL:", apiUrl);

  // parinkti šriftą pagal kalbą
  const fontFamily =
    i18n.language === "lt"
      ? '"Audiowide", monospace'
      : '"Pixelion", "Orbitron", monospace';

  // Paprastas testas ryšiui
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("Testing connection to backend...");
        const response = await fetch(`${apiUrl}/api/test`);
        const data = await response.json();
        console.log("Backend connection test:", data);
      } catch (error) {
        console.error("Backend connection failed:", error);
      }
    };
    
    testConnection();
  }, [apiUrl]);

  return (
    <ContactsWrapper>
      <MatrixBackground />
      <Content>
        <PageTitle style={{ fontFamily }}>{t("contacts.pageTitle")}</PageTitle>
        
        {/* Debug info */}
        <DebugSection>
          <h4>🔧 Debug Information:</h4>
          <p>API URL: {apiUrl}</p>
          <p>Frontend: {window.location.href}</p>
        </DebugSection>

        <InfoSection style={{ fontFamily }}>
          <Title style={{ fontFamily }}>{t("contacts.contactUs")}</Title>
          <p>{t("contacts.intro")}</p>
          <ContactItem>
            <FaEnvelope /> info@selek.site
          </ContactItem>
          <ContactItem>
            <FaPhone /> +370 607 92211
          </ContactItem>
          <ContactItem>
            <FaMapMarkerAlt /> {t("contacts.address")}
          </ContactItem>

          <h3>{t("contacts.followUs")}</h3>
          <SocialIcons>
            <a href="https://www.facebook.com/profile.php?id=61576021976928" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/selek_online_world/" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/company/selekonlineworld/?viewAsMember=true" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn />
            </a>
            <a href="https://github.com/SelekOnlineDev" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
          </SocialIcons>
        </InfoSection>

        <FormSection style={{ fontFamily }}>
          <h3>{t("contacts.sendMessage")}</h3>
          <Formik
            initialValues={{
              name: "",
              email: "",
              subject: "",
              message: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
              console.log("Form submission started:", values);
              setStatus({ type: 'loading', message: "Siunčiama..." });
              
              try {
                // Naudojame XMLHttpRequest vietoj fetch - dažnai veikia geriau
                const xhr = new XMLHttpRequest();
                xhr.open("POST", `${apiUrl}/api/messages`);
                xhr.setRequestHeader("Content-Type", "application/json");
                
                xhr.onload = function() {
                  if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                      const data = JSON.parse(xhr.responseText);
                      console.log("Success:", data);
                      setStatus({ type: 'success', message: "Žinutė išsiųsta sėkmingai!" });
                      resetForm();
                    } catch (e) {
                      console.error("JSON parse error:", e);
                      setStatus({ type: 'error', message: "Klaida apdorojant atsakymą" });
                    }
                  } else {
                    console.error("HTTP error:", xhr.status, xhr.statusText);
                    setStatus({ type: 'error', message: `Serverio klaida: ${xhr.status}` });
                  }
                };
                
                xhr.onerror = function() {
                  console.error("Network error");
                  setStatus({ type: 'error', message: "Tinklo klaida. Patikrinkite backendą." });
                };
                
                xhr.timeout = 10000; // 10 sekundžių timeout
                xhr.ontimeout = function() {
                  console.error("Request timeout");
                  setStatus({ type: 'error', message: "Užklausa per ilgai neužsibaigė" });
                };
                
                xhr.send(JSON.stringify(values));
                
              } catch (error) {
                console.error("Unexpected error:", error);
                setStatus({ type: 'error', message: "Netikėta klaida" });
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <StyledForm>
                <FieldRow>
                  <StyledField
                    name="name"
                    placeholder={t("contacts.name") || "Vardas"}
                    $error={errors.name && touched.name}
                  />
                  <StyledField
                    type="email"
                    name="email"
                    placeholder={t("contacts.email") || "El. paštas"}
                    $error={errors.email && touched.email}
                  />
                </FieldRow>

                <StyledField
                  name="subject"
                  placeholder={t("contacts.subject") || "Tema"}
                  $error={errors.subject && touched.subject}
                />

                <StyledTextarea
                  as="textarea"
                  name="message"
                  rows="6"
                  placeholder={t("contacts.message") || "Žinutė"}
                  $error={errors.message && touched.message}
                />

                <SubmitButton 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Siunčiama..." : (t("contacts.transmit") || "Siųsti")}
                </SubmitButton>

                {status.message && (
                  <StatusMessage $type={status.type}>
                    {status.message}
                  </StatusMessage>
                )}
              </StyledForm>
            )}
          </Formik>
        </FormSection>
      </Content>
    </ContactsWrapper>
  );
}

// Animation for flickering text effect
const flicker = keyframes`
  0%, 18%, 22%, 25%, 53%, 57%, 100% { text-shadow: 0 0 10px ${retroGreen}; }
  20%, 24%, 55% { text-shadow: none; }
`;

const ContactsWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 3.5rem 1.5rem;
  margin-top: 1.25rem;

  @media (max-width: 628px) {
    margin-bottom: 1.75rem;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  max-width: 978px;
  gap: 1.25rem;
  width: 100%;
`;

const PageTitle = styled.h1`
  width: 100%;
  text-align: center;
  color: ${retroGreen};
  text-shadow: 0 0 10px ${retroGreen};
  font-size: clamp(1.6rem, 3.5vw, 2.6rem);
  animation: ${flicker} 2s infinite;
  margin-bottom: 1rem;
`;

const DebugSection = styled.div`
  width: 100%;
  color: ${retroGreen};
  border: 1px solid ${retroGreen};
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(0, 0, 0, 0.8);
  font-size: 0.9rem;
  
  h4 {
    margin: 0 0 0.5rem 0;
    color: ${retroGreen};
  }
`;

const InfoSection = styled.div`
  flex: 1;
  min-width: 300px;
  color: ${retroGreen};
  border: 2px solid ${retroGreen};
  border-radius: 12px;
  padding: 1rem;
  background: black;

  h3 {
    margin-top: 1.5rem;
    font-size: 1.1rem;
    text-shadow: 0 0 8px ${retroGreen};
  }

  p {
    margin-bottom: 1rem;
  }
`;

const ContactItem = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;

  a {
    color: ${retroGreen};
    font-size: 1.4rem;
    border: 2px solid ${retroGreen};
    padding: 6px;
    border-radius: 6px;
    transition: background 0.2s ease-in-out;

    &:hover {
      background: rgba(141, 251, 164, 0.2);
      box-shadow: 0 0 5px ${retroGreen}, 0 0 5px ${retroGreen};
    }
  }
`;

const Title = styled.h2`
  color: ${retroGreen};
  text-shadow: 0 0 10px ${retroGreen};
  font-size: clamp(1.5rem, 3.5vw, 2.5rem);
  margin-bottom: 1rem;
`;

const FormSection = styled.div`
  flex: 1;
  min-width: 300px;
  border: 2px solid ${retroGreen};
  border-radius: 12px;
  padding: 1.25rem;
  color: ${retroGreen};
  background: rgba(0, 0, 0, 0.85);
  max-width: 828px;
  min-height: 280px;
  padding-bottom: 1.5rem;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-top: 0.75rem;
`;

const FieldRow = styled.div`
  display: flex;
  gap: 0.9rem;
  flex-wrap: wrap;
`;

const StyledField = styled(Field)`
  flex: 1;
  padding: 0.65rem;
  border: 2px solid ${(props) => (props.$error ? "white" : retroGreen)};
  background: black;
  color: ${(props) => (props.$error ? "white" : retroGreen)};
  border-radius: 6px;
  font-size: 0.95rem;

  &::placeholder {
    color: ${retroGreen};
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 8px ${retroGreen};
  }
`;

const StyledTextarea = styled(StyledField)`
  resize: vertical;
`;

const SubmitButton = styled.button`
  margin-top: auto;
  align-self: flex-start;
  background: transparent;
  border: 2px solid ${retroGreen};
  border-radius: 8px;
  color: ${retroGreen};
  padding: 10px 15px;
  font-weight: bold;
  font-family: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  outline: none;

  &:hover:not(:disabled) {
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
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.p`
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: ${props => 
    props.$type === 'success' ? '#8DFBA4' : 
    props.$type === 'error' ? '#ff5555' : 
    '#8DFBA4'};
`;