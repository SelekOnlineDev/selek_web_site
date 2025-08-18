import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
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
  const [status, setStatus] = useState("");

  return (
    <ContactsWrapper>
      <MatrixBackground />
      <Content>
        <PageTitle>Contacts</PageTitle>
        <InfoSection>
          <Title>Contact Us</Title>
          <p>
            Ready to execute your project? Send us a message and let's compile
            your vision into a digital masterpiece.
          </p>
          <ContactItem>
            <FaEnvelope /> selek.inbox@gmail.com
          </ContactItem>
          <ContactItem>
            <FaPhone /> +370 607 92211
          </ContactItem>
          <ContactItem>
            <FaMapMarkerAlt /> Lithuania, Europe, World
          </ContactItem>

          <h3>Follow Us</h3>
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

        <FormSection>
          <h3>Send Message</h3>
          <Formik
            initialValues={{
              name: "",
              email: "",
              subject: "",
              message: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
              try {
                const res = await fetch("http://localhost:3000/api/messages", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                });

                if (!res.ok) throw new Error();

                setStatus("Message sent successfully!");
                resetForm();
              } catch {
                setStatus("Error sending message");
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <StyledForm>
                <FieldRow>
                  <StyledField
                    name="name"
                    placeholder={
                      errors.name && touched.name ? errors.name : "Your Name"
                    }
                    $error={errors.name && touched.name}
                  />
                  <StyledField
                    type="email"
                    name="email"
                    placeholder={
                      errors.email && touched.email
                        ? errors.email
                        : "Your Email"
                    }
                    $error={errors.email && touched.email}
                  />
                </FieldRow>

                <StyledField
                  name="subject"
                  placeholder={
                    errors.subject && touched.subject
                      ? errors.subject
                      : "Subject"
                  }
                  $error={errors.subject && touched.subject}
                />

                <StyledTextarea
                  as="textarea"
                  name="message"
                  rows="6"
                  placeholder={
                    errors.message && touched.message
                      ? errors.message
                      : "Your Message"
                  }
                  $error={errors.message && touched.message}
                />

                <SubmitButton type="submit" disabled={isSubmitting}>
                  TRANSMIT DATA
                </SubmitButton>
                {status && <StatusMessage>{status}</StatusMessage>}
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
  font-family: "Pixelion", "Orbitron", monospace;
  color: ${retroGreen};
  text-shadow: 0 0 10px ${retroGreen};
  font-size: clamp(1.6rem, 3.5vw, 2.6rem);
  animation: ${flicker} 2s infinite;
  margin-bottom: 1rem;
`;

const InfoSection = styled.div`
  flex: 1;
  min-width: 300px;
  color: ${retroGreen};
  font-family: "Pixelion", "Orbitron", monospace;
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
  font-family: "Pixelion", "Orbitron", monospace;
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
  font-family: "Pixelion", "Orbitron", monospace;
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
  border: 2px solid
    ${(props) => (props.$error ? "white" : retroGreen)};
  background: black;
  color: ${(props) => (props.$error ? "white" : retroGreen)};
  border-radius: 6px;
  font-family: "Pixelion", "Orbitron", monospace;
  font-size: 0.95rem;

  &::placeholder {
    color: ${(props) => (props.$error ? "#8DFBA4" : retroGreen)};
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
  font-family: "Orbitron", monospace;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  outline: none;

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

const StatusMessage = styled.p`
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;
