import "./shared.scss";

const PrimaryButton = ({ label, onClick, icon = "→", className = "", type = "button" }) => {
  return (
    <button 
      type={type}
      className={`primary-btn ${className}`} 
      onClick={onClick}
    >
      <span className="btn-label">{label}</span>
      {icon && (
        <div className="btn-arrow-circle">
          {icon}
        </div>
      )}
    </button>
  );
};

export default PrimaryButton;
