import { motion } from "framer-motion";
import Container from "../../../components/shared/Container";
// Decoupled image imports
import { useLanguage } from "../../../../shared/LanguageContext";
import "./ProductSpecsSection.scss";

export default function ProductSpecsSection({ product }) {
  const { t, getImage } = useLanguage();

  const desc = t(`productsPage.productsList.p${product.id}.desc`);
  const descriptionList = Array.isArray(desc) ? desc : product.description;

  return (
    <section className="product-specs-section">
      <Container>
        {/* Two parallel cards: Product Details & Supplier Details */}
        <div className="specs-cards-grid">

          {/* Card 1: Product details */}
          <motion.div
            className="spec-card-container details-box-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="spec-card-header">
              <span className="spec-icon-symbol pi pi-file-edit" />
              <h2 className="spec-card-title">{t("productDetail.tabDescription", "Product details")}</h2>
            </div>

            <ul className="spec-details-bullets-list">
              {descriptionList.map((bullet, index) => (
                <li key={index} className="bullet-item">
                  <span className="bullet-dot" />
                  <p className="bullet-text-content">{bullet}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Card 2: Supplier details */}
          <motion.div
            className="spec-card-container supplier-box-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="spec-card-header">
              <span className="spec-icon-symbol pi pi-home" />
              <h2 className="spec-card-title">{t("productDetail.supplierInfo", "Supplier details")}</h2>
            </div>

            {/* Supplier entity block */}
            <div className="supplier-brand-card">
              <div className="supplier-logo-wrap">
                <img src={getImage("logo")} alt="Supplier Logo" className="supplier-logo" />
              </div>
              <div className="supplier-name-wrap">
                <span className="supplier-sublabel">{t("productDetail.supplierName", "Name of the supplier")}</span>
                <h4 className="supplier-brand-title">{t("productDetail.brandLabel", product.supplier.name)}</h4>
              </div>
            </div>

            {/* Quality parameters grid */}
            <div className="quality-rows-layout">
              <div className="quality-row">
                <span className="row-label">{t("productDetail.supplierSource", "Source")}</span>
                <span className="row-value-bold">
                  {t("productsPage.productsList.p" + product.id + ".source", product.supplier.source)}
                </span>
              </div>

              <div className="quality-row">
                <span className="row-label">{t("productDetail.supplierQC", "Quality check")}</span>
                <span className="row-value-bold highlight-green">
                  {t("productsPage.productsList.p" + product.id + ".qc", product.supplier.qualityCheck)}
                </span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Date box blocks (MFG and EXP) */}
        <div className="mfg-exp-dates-layout">

          {/* MFG Date */}
          {/* <motion.div
            className="date-block mfg-date-block"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="date-label">{t("productDetail.mfgDate", "Date of manufacture")}</span>
            <span className="date-value-bold">{product.mfgDate}</span>
          </motion.div> */}

          {/* EXP Date */}
          {/* <motion.div
            className="date-block exp-date-block"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="date-label text-red">{t("productDetail.expDate", "Expiration Date")}</span>
            <span className="date-value-bold text-red">{product.expDate}</span>
          </motion.div> */}

        </div>
      </Container>
    </section>
  );
}
