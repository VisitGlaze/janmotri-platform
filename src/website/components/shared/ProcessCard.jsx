import { Card } from "primereact/card";
import "./shared.scss";

const ProcessCard = ({ stepNumber, title, description, image }) => {
  const header = (
    <div className="process-card-image-wrap">
      <img src={image} alt={title} className="process-card-img" />
      <span className="process-card-badge">{stepNumber}</span>
    </div>
  );

  return (
    <Card header={header} className="process-card-root">
      <h4 className="process-card-title">{title}</h4>
      <p className="process-card-desc">{description}</p>
    </Card>
  );
};

export default ProcessCard;
