import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import "./shared.scss";

const FeatureCard = ({ icon, tagLabel, tagSeverity = "warning", title, description }) => {
  return (
    <Card className="feature-card-root">
      <div className="feature-card-header">
        <div className="feature-card-icon">{icon}</div>
        <Tag value={tagLabel} severity={tagSeverity} className="feature-card-tag" />
      </div>
      <h4 className="feature-card-title">{title}</h4>
      <p className="feature-card-desc">{description}</p>
    </Card>
  );
};

export default FeatureCard;
