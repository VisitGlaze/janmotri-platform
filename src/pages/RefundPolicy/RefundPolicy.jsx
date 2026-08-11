import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../website/components/Navbar/Navbar";
import Footer from "../../website/components/Footer/Footer";
import Container from "../../website/components/shared/Container";
import { useLanguage } from "../../shared/LanguageContext";
import "./RefundPolicy.scss";

const RefundPolicy = () => {
  const [activeSection, setActiveSection] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);

    // Setup intersection observer for TOC highlighting
    const sections = document.querySelectorAll(".legal-content-section");
    const options = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const sectionsList = [
    { id: "introduction", title: t("legal.refund.introTitle", "1. Introduction") },
    { id: "eligibility", title: t("legal.refund.eligibilityTitle", "2. Eligibility for Refund") },
    { id: "damaged-incorrect", title: t("legal.refund.damagedTitle", "3. Damaged/Incorrect Items") },
    { id: "refund-process", title: t("legal.refund.processTitle", "4. Refund Process") },
    { id: "replacement", title: t("legal.refund.replacementTitle", "5. Replacement Policy") },
    { id: "timeline", title: t("legal.refund.timelineTitle", "6. Refund Timeline") },
    { id: "non-refundable", title: t("legal.refund.nonRefundableTitle", "7. Non-Refundable Items") },
    { id: "contact-support", title: t("legal.refund.supportTitle", "8. Contact Support") }
  ];

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 140; // Height of navbar plus margin
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="legal-page-root refund-policy-page">
      <Navbar />

      <main className="legal-main">
        {/* Hero Section */}
        <section className="legal-hero">
          <div className="hero-leaf-vector vector-left">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 80 C 40 100, 70 80, 100 120 C 120 140, 150 120, 180 150" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="3" strokeLinecap="round" />
              <path d="M40 90 C 20 60, 60 40, 70 80 C 80 120, 50 140, 40 90 Z" fill="rgba(212, 175, 55, 0.08)" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="2" />
              <path d="M100 120 C 80 90, 110 70, 130 100 C 150 130, 120 150, 100 120 Z" fill="rgba(212, 175, 55, 0.08)" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="2" />
              <path d="M140 130 C 130 110, 160 90, 170 120 C 180 140, 150 150, 140 130 Z" fill="rgba(212, 175, 55, 0.05)" stroke="rgba(212, 175, 55, 0.1)" strokeWidth="1.5" />
            </svg>
          </div>

          <Container>
            <div className="hero-content">

              <h1 className="hero-title">{t("legal.refund.heroTitle", "Refund Policy")}</h1>

            </div>
          </Container>
        </section>

        {/* Content Layout */}
        <section className="legal-body-section">
          <Container>
            <div className="legal-layout">
              {/* Sticky TOC (Desktop only) */}
              <aside className="legal-sidebar">
                <div className="toc-card">
                  <h4 className="toc-title">{t("legal.tocTitle", "Table of Contents")}</h4>
                  <ul className="toc-list">
                    {sectionsList.map((sec) => (
                      <li key={sec.id} className="toc-item">
                        <button
                          onClick={() => handleScrollTo(sec.id)}
                          className={`toc-link ${activeSection === sec.id ? "active" : ""}`}
                        >
                          {sec.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              {/* Main Content Card */}
              <article className="legal-content-card">
                <section id="introduction" className="legal-content-section">
                  <h2>{t("legal.refund.introTitle", "1. Introduction")}</h2>
                  <p>{t("legal.refund.introP1", "At Janmotri Oil & Food Products, we strive to deliver the highest quality cold-pressed groundnut oil. We are dedicated to ensuring your complete satisfaction with every purchase. If for any reason you are not satisfied with your order, we invite you to review our policy on cancellations, returns, and refunds.")}</p>
                  <p>{t("legal.refund.introP2", "Please read this policy carefully to understand your rights and the guidelines regarding returns, replacements, and refunds.")}</p>
                </section>

                <hr className="section-divider" />

                <section id="eligibility" className="legal-content-section">
                  <h2>{t("legal.refund.eligibilityTitle", "2. Eligibility for Refund")}</h2>
                  <p>{t("legal.refund.eligibilityP1", "Due to the consumable nature of our food products (groundnut oil), we have specific eligibility requirements for returns and refunds:")}</p>
                  <ul>
                    <li>{t("legal.refund.eligibilityLi1", "The refund request must be initiated within 7 days of delivery of the product.")}</li>
                    <li>{t("legal.refund.eligibilityLi2", "The item must be in its original packaging, unopened, unused, and with the protective seal intact. Opened bottles or containers cannot be returned due to hygiene and food safety regulations.")}</li>
                    <li>{t("legal.refund.eligibilityLi3", "You must provide a valid proof of purchase (such as your invoice, order confirmation number, or billing receipt).")}</li>
                  </ul>
                </section>

                <hr className="section-divider" />

                <section id="damaged-incorrect" className="legal-content-section">
                  <h2>{t("legal.refund.damagedTitle", "3. Damaged or Incorrect Products")}</h2>
                  <p>{t("legal.refund.damagedP1", "If you receive a product that is damaged, leaking, or different from what you ordered, we will resolve the issue immediately at no extra cost to you.")}</p>
                  <div className="important-note alert-warning">
                    <strong>{t("legal.pleaseNote", "Please Note:")}</strong> {t("legal.refund.damagedNote", "In case of damage during transit, leakage, or receipt of an incorrect product, you must report it within 48 hours of delivery. You must submit photographic or video proof of the damaged or incorrect item to our customer support team to facilitate the verification process.")}
                  </div>
                </section>

                <hr className="section-divider" />

                <section id="refund-process" className="legal-content-section">
                  <h2>{t("legal.refund.processTitle", "4. Refund Process")}</h2>
                  <p>{t("legal.refund.processP1", "To initiate a return or request a refund, please follow these steps:")}</p>
                  <ol>
                    <li>{t("legal.refund.processLi1", "Contact Customer Support: Email us at janmotrioilandfoodproducts@gmail.com with your order number, details of the item you wish to return, and the reason for the return.")}</li>
                    <li>{t("legal.refund.processLi2", "Return Approval: Our support team will review your request. If approved, we will provide you with return instructions.")}</li>
                    <li>{t("legal.refund.processLi3", "Ship the Product: Pack the product securely in its original packaging and ship it to our designated warehouse address. You will be responsible for paying your own shipping costs for returning non-damaged items. Shipping costs are non-refundable.")}</li>
                  </ol>
                </section>

                <hr className="section-divider" />

                <section id="replacement" className="legal-content-section">
                  <h2>{t("legal.refund.replacementTitle", "5. Replacement Policy")}</h2>
                  <p>{t("legal.refund.replacementP1", "In addition to refunds, we offer free product replacements for items that are damaged, defective, or incorrect. If you prefer a replacement instead of a refund:")}</p>
                  <p>{t("legal.refund.replacementP2", "We will arrange for a reverse pickup of the incorrect/damaged item (if applicable) and dispatch the new replacement bottle or tin of groundnut oil to you at no additional shipping charge.")}</p>
                </section>

                <hr className="section-divider" />

                <section id="timeline" className="legal-content-section">
                  <h2>{t("legal.refund.timelineTitle", "6. Refund Timeline")}</h2>
                  <p>{t("legal.refund.timelineP1", "Once your return is received and inspected by our quality assurance team, we will send you an email to notify you that we have received your returned item and whether your refund request has been approved or rejected based on the product condition.")}</p>
                  <p>{t("legal.refund.timelineP2", "If approved, your refund will be processed and automatically credited back to your original payment method (bank account, credit/debit card, or UPI wallet) within 7 to 10 business days. Please note that processing times may vary depending on your bank or credit card provider.")}</p>
                </section>

                <hr className="section-divider" />

                <section id="non-refundable" className="legal-content-section">
                  <h2>{t("legal.refund.nonRefundableTitle", "7. Non-Refundable Items")}</h2>
                  <p>{t("legal.refund.nonRefundableP1", "The following items are strictly non-refundable and non-returnable:")}</p>
                  <ul>
                    <li>{t("legal.refund.nonRefundableLi1", "Any bottle or container of oil where the original seal is broken, torn, or tempered with.")}</li>
                    <li>{t("legal.refund.nonRefundableLi2", "Products returned more than 7 days after the delivery date.")}</li>
                    <li>{t("legal.refund.nonRefundableLi3", "Products purchased during clearance, flash sales, or promotional campaigns marked as \"Non-Returnable\".")}</li>
                    <li>{t("legal.refund.nonRefundableLi4", "Gift cards or complimentary promotional packages.")}</li>
                  </ul>
                </section>

                <hr className="section-divider" />

                <section id="contact-support" className="legal-content-section">
                  <h2>{t("legal.refund.supportTitle", "8. Contact Support")}</h2>
                  <p>{t("legal.refund.supportP1", "For any support queries, order cancellations, or refund requests, please reach out to our dedicated support channels:")}</p>
                  <div className="contact-details-box">
                    <strong>{t("legal.refund.support.companyName", "Janmotri Customer Support")}</strong>
                    <br />
                    {t("footer.address", "Address:")} {t("legal.refund.support.address", "93 Plot No: 1 Radhamani Park, Near Matridham Mandir, Akwada, Bhavnagar")}
                    <br />
                    {t("footer.callUs", "Call Us:")} {t("legal.refund.support.phone", "+91 90999 08309")}
                    <br />
                    {t("footer.email", "Email:")} <a href={`mailto:${t("legal.refund.support.email", "janmotrioilandfoodproducts@gmail.com")}`}>{t("legal.refund.support.email", "janmotrioilandfoodproducts@gmail.com")}</a>
                  </div>
                </section>
              </article>
            </div>
          </Container>
        </section>
      </main>

      <Footer hideInstagram={true} />
    </div>
  );
};

export default RefundPolicy;
