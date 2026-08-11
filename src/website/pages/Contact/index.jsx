import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Container from "../../components/shared/Container";
import HeroSection from "./HeroSection/HeroSection";
import ContactInfoSection from "./ContactInfoSection/ContactInfoSection";
import ContactFormSection from "./ContactFormSection/ContactFormSection";
import MapSection from "./MapSection/MapSection";
import SocialSection from "./SocialSection/SocialSection";
import { useAdminStore } from "../../../shared/useAdminStore";
import "./Contact.scss";

const Contact = () => {
  const addMessage = useAdminStore((state) => state.addMessage);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Form Validation
    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Please enter your phone number.");
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMessage("Please enter the subject of inquiry.");
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage("Please enter your message.");
      return;
    }

    // Success Submission: Add to admin store
    addMessage({
      customerName: formData.name.trim(),
      mobile: formData.phone.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim()
    });

    setSubmitSuccess(true);
    setFormData({
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: ""
    });

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 4500);
  };

  return (
    <div className="contact-page-root">
      <Navbar />

      <main className="contact-main-content">
        <HeroSection />

        <section className="contact-details-form-section">
          <Container>
            <div className="contact-grid">
              <ContactInfoSection />
              <ContactFormSection 
                formData={formData}
                handleInputChange={handleInputChange}
                handleFormSubmit={handleFormSubmit}
                errorMessage={errorMessage}
                submitSuccess={submitSuccess}
              />
            </div>
          </Container>
        </section>

        <MapSection />

        <SocialSection />

      </main>

      <Footer />
    </div>
  );
};

export default Contact;
