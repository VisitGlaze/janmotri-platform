import "./shared.scss";

const InstagramCard = ({ image, link = "https://www.instagram.com/janmotri_oil/?hl=en" }) => {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="instagram-card-root"
    >
      <div className="instagram-image-wrap">
        <img src={image} alt="Instagram Post" className="instagram-img" />
        <div className="instagram-card-overlay">
          <i className="pi pi-instagram instagram-icon"></i>
        </div>
      </div>
    </a>
  );
};

export default InstagramCard;
