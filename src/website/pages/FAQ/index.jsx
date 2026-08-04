import { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import HeroSection from "./HeroSection/HeroSection";
import FAQAccordionSection from "./FAQAccordionSection/FAQAccordionSection";
import ContactSupportSection from "./ContactSupportSection/ContactSupportSection";
import { useAdminStore } from "../../../shared/useAdminStore";
import "./FAQ.scss";

const FAQ = () => {
  const faqs = useAdminStore((state) => state.faqs);

  const dynamicFaqData = useMemo(() => {
    const activeFaqs = faqs.filter((f) => f.active);

    const categories = [
      { name: "Order And Delivery", icon: "pi-shopping-bag" },
      { name: "Product And Quality", icon: "pi-verified" },
      { name: "Payment And Refunds", icon: "pi-credit-card" },
      { name: "Purity And Quality", icon: "pi-shield" }
    ];

    return categories.map((cat) => {
      const items = activeFaqs
        .filter((f) => f.category === cat.name)
        .sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0))
        .map((f) => ({
          id: f.id,
          question: f.question,
          answer: f.answer
        }));

      return {
        category: cat.name,
        icon: cat.icon,
        items
      };
    }).filter((cat) => cat.items.length > 0);
  }, [faqs]);

  const [expandedItems, setExpandedItems] = useState({
    "Order And Delivery-0": true,
    "Product And Quality-0": true,
    "Payment And Refunds-0": true,
    "Purity And Quality-0": true
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleItem = (key) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="faq-page-root">
      <Navbar />

      <main className="faq-main-content">
        <HeroSection />

        <FAQAccordionSection
          faqData={dynamicFaqData}
          expandedItems={expandedItems}
          toggleItem={toggleItem}
        />

        <ContactSupportSection />

      </main>

      <Footer hideInstagram={true} />
    </div>
  );
};

export default FAQ;
