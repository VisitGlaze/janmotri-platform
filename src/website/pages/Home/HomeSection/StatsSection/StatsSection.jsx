import LocationSelectorCard from "./LocationSelectorCard";
import { useLanguage } from "../../../../../shared/LanguageContext";
import "./StatsSection.scss";

const StatsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="stats-section">
      <div className="stats-container">

        <div className="stats-top">

          <div className="main-card">
            <i className="pi pi-wallet stats-icon"></i>

            <h5>{t("home.stats.totalSales", "TOTAL SALES")}</h5>

            <h2>1,00,000+</h2>

            <p>
              {t("home.stats.totalSalesDesc", "Total transactions completed by our trusted customers worldwide.")}
            </p>
          </div>

          <div className="side-cards">

            <div className="small-card">
              <h5>{t("home.stats.delivery", "DELIVERY")}</h5>
              <h3>52,000+</h3>
              <p>{t("home.stats.deliveryDesc", "Orders are Delivered.")}</p>
            </div>

            <div className="small-card">
              <h5>{t("home.stats.happyCust", "HAPPY CUSTOMERS")}</h5>
              <h3>48,000+</h3>
              {/* <p>{t("home.stats.happyCustDesc", "Happy customers who love our products.")}</p> */}
            </div>

          </div>

        </div>

        <div className="stats-bottom">

          {/* Interactive Premium Location Selector Card */}
          <LocationSelectorCard />

          <div className="info-card">
            <div className="circle-icon">
              <i className="pi pi-map-marker"></i>
            </div>

            <div>
              <h4>{t("home.stats.serviceAreasVal", "200+ Locations")}</h4>
              <span>{t("home.stats.serviceAreas", "SERVICE AREAS")}</span>
            </div>
          </div>

          <div className="info-card">
            <div className="circle-icon">
              <i className="pi pi-users"></i>
            </div>

            <div>
              <h4>{t("home.stats.communityVal", "50,000+ Customers")}</h4>
              <span>{t("home.stats.community", "GROWING COMMUNITY")}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default StatsSection;