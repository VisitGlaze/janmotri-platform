import { useLanguage } from "../../../../../shared/LanguageContext";
import "./QuoteSection.scss";

const QuoteSection = () => {
  const { t } = useLanguage();

  return (
    <section className="quote-section">
      <div className="quote-container">

        <div className="quote-icon">❞</div>

        <h2>
          {t("home.quote.text", "Our mission is to bring purity, health, and trust to every home.")}
        </h2>

        <p>{t("home.quote.author", "— FOUNDER OF JANMOTRI FOODS")}</p>

      </div>
    </section>
  );
};

export default QuoteSection;