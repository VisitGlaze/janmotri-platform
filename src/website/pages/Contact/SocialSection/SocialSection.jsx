import Container from "../../../components/shared/Container";
import { useLanguage } from "../../../../shared/LanguageContext";
import "./SocialSection.scss";

export default function SocialSection() {
  const { t } = useLanguage();

  return (
    <section className="stay-connected-section">
      <Container>
        <div className="stay-connected-wrap">
          <h2 className="connected-title">{t("contactPage.socialTitle", "Stay Connected")}</h2>
          <p className="connected-desc">
            {t("contactPage.socialSubtitle", "A confluence of traditional purity and modern quality is Janmotri on social media. Join us and get latest updates.")}
          </p>

          {/* Social Icons list */}
          <div className="social-links-grid">
            <a href="https://in.linkedin.com/in/janmotri-oil-and-food-products-74769b384" target="_blank" rel="noreferrer" className="social-btn linkedin" aria-label="LinkedIn">
              <span className="pi pi-linkedin"></span>
            </a>
            <a href="https://www.facebook.com/janmotrioil" target="_blank" rel="noreferrer" className="social-btn facebook" aria-label="Facebook">
              <span className="pi pi-facebook"></span>
            </a>
            {/* <a href="#" className="social-btn twitter" aria-label="Twitter">
              <span className="pi pi-twitter"></span>
            </a> */}
            <a href="https://www.instagram.com/janmotri_oil/?hl=en" target="_blank" rel="noreferrer" className="social-btn instagram" aria-label="Instagram">
              <span className="pi pi-instagram"></span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
