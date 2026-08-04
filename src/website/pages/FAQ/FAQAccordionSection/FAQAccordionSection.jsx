import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../../shared/LanguageContext";
import Container from "../../../components/shared/Container";
import "./FAQAccordionSection.scss";

const FAQItem = ({ question, answer, isExpanded, onToggle }) => {
  return (
    <div className={`faq-accordion-item ${isExpanded ? "expanded" : ""}`}>
      <button className="faq-question-button" onClick={onToggle} aria-expanded={isExpanded}>
        <span className="faq-question-text">{question}</span>
        <span className={`faq-toggle-icon pi ${isExpanded ? "pi-chevron-up" : "pi-chevron-down"}`} />
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="faq-answer-container"
          >
            <div className="faq-answer-content">
              {typeof answer === "string" ? (
                answer.split("\n").map((line, pIdx) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;
                  if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("●")) {
                    return (
                      <div key={pIdx} className="faq-bullet-line">
                        <span className="bullet-dot">•</span>
                        <span>{trimmed.replace(/^[•\-●]\s*/, "")}</span>
                      </div>
                    );
                  }
                  if (trimmed.startsWith("Email:") || trimmed.startsWith("Phone:") || trimmed.startsWith("ઇમેઇલ:") || trimmed.startsWith("ફોન:") || trimmed.startsWith("ईमेल:") || trimmed.startsWith("फोन:")) {
                    return (
                      <p key={pIdx} className="faq-contact-line">
                        <strong>{line}</strong>
                      </p>
                    );
                  }
                  return <p key={pIdx}>{line}</p>;
                })
              ) : (
                <p>{answer}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQAccordionSection({ faqData, expandedItems, toggleItem }) {
  const { t } = useLanguage();

  const getCategoryTranslation = (category) => {
    if (category === "Order And Delivery") return t("faqPage.categories.order", category);
    if (category === "Product And Quality") return t("faqPage.categories.product", category);
    if (category === "Payment And Refunds") return t("faqPage.categories.payment", category);
    if (category === "Purity And Quality") return t("faqPage.categories.purity", category);
    return category;
  };

  return (
    <section className="faq-accordions-section">
      <Container>
        <div className="faq-categories-list">
          {faqData.map((cat, catIdx) => (
            <motion.div 
              key={cat.category}
              className="faq-category-block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: catIdx * 0.1 }}
            >
              {/* Category Header */}
              <div className="faq-category-header">
                <span className={`category-icon pi ${cat.icon}`}></span>
                <h2 className="category-title">{getCategoryTranslation(cat.category)}</h2>
              </div>

              {/* Category Items */}
              <div className="faq-category-items">
                {cat.items.map((item, itemIdx) => {
                  const itemKey = `${cat.category}-${itemIdx}`;
                  const faqNum = item.id ? item.id.replace("FAQ-", "") : (itemIdx + 1);
                  const questionText = t(`faqPage.items.q${faqNum}`, item.question);
                  const answerText = t(`faqPage.items.a${faqNum}`, item.answer);

                  return (
                    <FAQItem
                      key={itemIdx}
                      question={questionText}
                      answer={answerText}
                      isExpanded={!!expandedItems[itemKey]}
                      onToggle={() => toggleItem(itemKey)}
                    />
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
