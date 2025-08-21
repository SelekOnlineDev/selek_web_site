import { useState } from "react";
import styled, { keyframes } from "styled-components";
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

export default function Contacts() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { t, i18n } = useTranslation();
  
  const apiUrl = import.meta.env.VITE_API_URL;

  const fontFamily =
    i18n.language === "lt"
      ? '"Audiowide", monospace'
      : '"Orbitron", monospace';

  // Form input change handler

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Handle blur (when user leaves field)

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate this specific field

    validateField(name, formData[name]);
  };

  // Validate single field

  const validateField = (fieldName, value) => {
    let error = "";
    
    switch (fieldName) {
      case "name":
        if (!value.trim()) error = t("contacts.validation.nameRequired") || "Name is required";
        break;
      case "email":
        if (!value.trim()) error = t("contacts.validation.emailRequired") || "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = t("contacts.validation.emailInvalid") || "Invalid email";
        break;
      case "subject":
        if (!value.trim()) error = t("contacts.validation.subjectRequired") || "Subject is required";
        break;
      case "message":
        if (!value.trim()) error = t("contacts.validation.messageRequired") || "Message is required";
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    
    return error === "";
  };

  // Validation function

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = t("contacts.validation.nameRequired") || "Name is required";
    if (!formData.email.trim()) newErrors.email = t("contacts.validation.emailRequired") || "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t("contacts.validation.emailInvalid") || "Invalid email";
    if (!formData.subject.trim()) newErrors.subject = t("contacts.validation.subjectRequired") || "Subject is required";
    if (!formData.message.trim()) newErrors.message = t("contacts.validation.messageRequired") || "Message is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submit handler

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched

    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true
    });
    
    // Validate form

    if (!validateForm()) {
      setStatus({ type: 'error', message: t("contacts.validation.fixErrors") || "Please fix the errors below" });
      return;
    }
    
    setIsSubmitting(true);
    setStatus({ type: 'loading', message: t("contacts.sending") || "Sending..." });

    try {
      const fullUrl = `${apiUrl}/api/messages`;
      
      const requestOptions = {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData),
      };

      console.log(import.meta.env.VITE_API_URL);

      const response = await fetch(fullUrl, requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
      }

      setStatus({ 
        type: 'success', 
        message: t("contacts.success") || "Message sent successfully!"
      });
      
      // Reset form

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      
      // Reset touched state

      setTouched({});
      
    } catch (error) {
      let userMessage = t("contacts.error") || "Error sending message";
      
      if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
        userMessage = "Network error";
      } else if (error.message.includes("HTTP error")) {
        userMessage = `Server error: ${error.message}`;
      }

      setStatus({ 
        type: 'error', 
        message: userMessage 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactsWrapper>
      <MatrixBackground />
      <Content>
        <PageTitle style={{ fontFamily }}>{t("contacts.pageTitle")}</PageTitle>

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
            <FaPhone /> +62 822 2187 7598
          </ContactItem>
          <ContactItem>
            <FaMapMarkerAlt /> {t("contacts.address")}
          </ContactItem>

          <h3>{t("contacts.followUs")}</h3>
          <SocialIcons>
            <a href="https://www.facebook.com/profile.php?id=61576021976928">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/selek_online_world/">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/company/selekonlineworld/?viewAsMember=true">
              <FaLinkedinIn />
            </a>
            <a href="https://github.com/SelekOnlineDev">
              <FaGithub />
            </a>
          </SocialIcons>
        </InfoSection>

        <FormSection style={{ fontFamily }}>
          <h3>{t("contacts.sendMessage")}</h3>
          <StyledForm onSubmit={handleSubmit}>
            <FieldRow>
              <StyledField
                type="text"
                name="name"
                placeholder={
                  errors.name && touched.name 
                    ? errors.name 
                    : t("contacts.name") || "Name"
                }
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                $error={!!(errors.name && touched.name)}
                required
              />
              <StyledField
                type="email"
                name="email"
                placeholder={
                  errors.email && touched.email 
                    ? errors.email 
                    : t("contacts.email") || "Email"
                }
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                $error={!!(errors.email && touched.email)}
                required
              />
            </FieldRow>

            <StyledField
              type="text"
              name="subject"
              placeholder={
                errors.subject && touched.subject 
                  ? errors.subject 
                  : t("contacts.subject") || "Subject"
              }
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              $error={!!(errors.subject && touched.subject)}
              required
            />

            <StyledTextarea
              name="message"
              rows="6"
              placeholder={
                errors.message && touched.message 
                  ? errors.message 
                  : t("contacts.message") || "Message"
              }
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              $error={!!(errors.message && touched.message)}
              required
            />

            <ButtonRow>
              <SubmitButton 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (t("contacts.sending") || "Sending...") : (t("contacts.transmit") || "Send")}
              </SubmitButton>

              {status.message && (
                <StatusMessage $type={status.type}>
                  {status.message}
                </StatusMessage>
              )}
            </ButtonRow>
          </StyledForm>
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
  margin-top: 1rem;

  @media (max-width: 628px) {
    margin-bottom: 1.75rem;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 5;
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

const InfoSection = styled.div`
  flex: 1;
  min-width: 280px;
  color: ${retroGreen};
  border: 2px solid ${retroGreen};
  border-radius: 12px;
  padding: 1rem;
  background: black;
  position: relative;
  z-index: 10;

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
  min-width: 280px;
  border: 2px solid ${retroGreen};
  border-radius: 12px;
  padding: 1.25rem;
  color: ${retroGreen};
  background: rgba(0, 0, 0, 0.85);
  max-width: 828px;
  min-height: 280px;
  padding-bottom: 1.5rem;
  position: relative;
  z-index: 10;
`;

const StyledForm = styled.form`
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

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const StyledField = styled.input`
  flex: 1;
  min-width: 220px;
  padding: 0.65rem;
  border: 2px solid ${(props) => (props.$error ? "white" : retroGreen)};
  background: black;
  color: ${(props) => (props.$error ? "white" : retroGreen)};
  border-radius: 6px;
  font-size: 0.95rem;

  &::placeholder {
    color: ${(props) => (props.$error ? "#8DFBA4" : retroGreen)};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 8px ${retroGreen};
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px ${retroGreen} inset !important;
    -webkit-text-fill-color: black !important;
    border: 2px solid ${retroGreen} !important;
  }

  &:-webkit-autofill:hover {
    -webkit-box-shadow: 0 0 0 1000px ${retroGreen} inset !important;
    -webkit-text-fill-color: black !important;
  }

  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px ${retroGreen} inset !important;
    -webkit-text-fill-color: black !important;
  }

  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px ${retroGreen} inset !important;
    -webkit-text-fill-color: black !important;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.65rem;
  border: 2px solid ${(props) => (props.$error ? "white" : retroGreen)};
  background: black;
  color: ${(props) => (props.$error ? "white" : retroGreen)};
  border-radius: 6px;
  font-size: 0.95rem;
  resize: vertical;
  font-family: inherit;

  &::placeholder {
    color: ${(props) => (props.$error ? "#8DFBA4" : retroGreen)};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 8px ${retroGreen};
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px ${retroGreen} inset !important;
    -webkit-text-fill-color: black !important;
    border: 2px solid ${retroGreen} !important;
  }

  &:-webkit-autofill:hover {
    -webkit-box-shadow: 0 0 0 1000px ${retroGreen} inset !important;
    -webkit-text-fill-color: black !important;
  }

  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px ${retroGreen} inset !important;
    -webkit-text-fill-color: black !important;
  }

  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px ${retroGreen} inset !important;
    -webkit-text-fill-color: black !important;
  }
`;

const SubmitButton = styled.button`
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

  &:link,
  &:visited,
  &:active {
    color: ${retroGreen};
  }

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
  margin: 0;
  color: ${props => 
    props.$type === 'success' ? '#8DFBA4' : 
    props.$type === 'error' ? '#fff' : 
    '#8DFBA4'};
  
  @media (max-width: 628px) {
    width: 100%;
    margin-top: 0.5rem;
  }
`;