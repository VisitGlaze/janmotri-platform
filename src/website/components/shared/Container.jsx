import "./shared.scss";

const Container = ({ children, className = "" }) => {
  return (
    <div className={`shared-container ${className}`}>
      {children}
    </div>
  );
};

export default Container;
