import "./shared.scss";

const SectionTitle = ({ subtitle, title, centered = false }) => {
  return (
    <div className={`shared-section-header ${centered ? "text-center" : ""}`}>
      {/* {subtitle && <span className="shared-subtitle">{subtitle}</span>} */}
      <h2 className="shared-title">{title}</h2>
      <div className="shared-heading-line"></div>
    </div>
  );
};

export default SectionTitle;
