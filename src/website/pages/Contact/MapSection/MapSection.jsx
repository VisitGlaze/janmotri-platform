import Container from "../../../components/shared/Container";
import "./MapSection.scss";

export default function MapSection() {
  return (
    <section className="contact-map-section">
      <Container>
        <a
          href="https://maps.app.goo.gl/BacvLQVaLaRCebG26"
          target="_blank"
          rel="noopener noreferrer"
          className="map-view-frame"
          title="Open Janmotri Oil & Food Products on Google Maps"
        >
          {/* Interactive Visual Iframe Map */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3706.1621597606227!2d72.18392779999999!3d21.735238199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395f5b77c5fff2d3%3A0xee64d237728ed922!2sJANMOTRI%20OIL%20AND%20FOOD%20PRODUCTS!5e0!3m2!1sen!2sin!4v1780750893639!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0, pointerEvents: "none" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="google-iframe-map"
            title="Janmotri Location Map"
          />

          {/* Overlay visual pin and link button */}
          <div className="map-glass-overlay">
            <span className="open-map-btn">
              <span className="pi pi-map-marker mr-2"></span> Open in map
            </span>
          </div>
        </a>
      </Container>
    </section>
  );
}
