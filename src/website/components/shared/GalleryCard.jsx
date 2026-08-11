import { Image } from "primereact/image";
import "./shared.scss";

const GalleryCard = ({ image, title }) => {
  return (
    <div className="gallery-card-root">
      <div className="gallery-image-wrap">
        <Image src={image} alt={title} preview className="gallery-img-element" />
        <div className="gallery-card-overlay">
          <h4 className="gallery-card-title">{title}</h4>
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;
