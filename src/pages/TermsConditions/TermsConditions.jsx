import { useEffect, useState } from "react";
import Navbar from "../../website/components/Navbar/Navbar";
import Footer from "../../website/components/Footer/Footer";
import Container from "../../website/components/shared/Container";
import { useLanguage } from "../../shared/LanguageContext";
import { termsConditionsData } from "./termsConditionsData";
import "./TermsConditions.scss";

const TermsConditions = () => {
  const [activeSection, setActiveSection] = useState("");
  const { language } = useLanguage();

  // Selected language data with English fallback
  const currentData = termsConditionsData[language] || termsConditionsData.en;

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
  }, [language]);

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
    <div className="legal-page-root terms-conditions-page">
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
              <h1 className="hero-title">{currentData.heroTitle}</h1>
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
                  <h4 className="toc-title">{currentData.tocTitle}</h4>
                  <ul className="toc-list">
                    {currentData.sections.map((sec) => (
                      <li key={sec.id} className="toc-item">
                        <button
                          onClick={() => handleScrollTo(sec.id)}
                          className={`toc-link ${activeSection === sec.id ? "active" : ""}`}
                        >
                          {sec.heading}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              {/* Main Content Card */}
              <article className="legal-content-card">
                {/* Welcome / Introduction Card */}
                <section className="legal-welcome-block">
                  <h2 className="welcome-heading">{currentData.welcome}</h2>
                  <p className="welcome-text">{currentData.introP1}</p>
                  {currentData.introP2 && (
                    <p className="welcome-text mt-2">{currentData.introP2}</p>
                  )}
                </section>

                <hr className="section-divider" />

                {/* Terms PDF Sections */}
                {currentData.sections.map((sec, index) => (
                  <div key={sec.id}>
                    <section id={sec.id} className="legal-content-section">
                      <h2>{sec.heading}</h2>

                      {/* Section Paragraphs */}
                      {sec.paragraphs && sec.paragraphs.map((pText, pIndex) => (
                        <p key={pIndex}>{pText}</p>
                      ))}

                      {/* Section Bullets */}
                      {sec.bullets && sec.bullets.length > 0 && (
                        <ul className="terms-bullets-list">
                          {sec.bullets.map((bText, bIdx) => (
                            <li key={bIdx}>{bText}</li>
                          ))}
                        </ul>
                      )}

                      {/* Footer Paragraphs */}
                      {sec.footerParagraphs && sec.footerParagraphs.map((fpText, fpIndex) => (
                        <p key={fpIndex}>{fpText}</p>
                      ))}
                    </section>

                    {index < currentData.sections.length - 1 && (
                      <hr className="section-divider" />
                    )}
                  </div>
                ))}
              </article>
            </div>
          </Container>
        </section>
      </main>

      <Footer hideInstagram={true} />
    </div>
  );
};

export default TermsConditions;
