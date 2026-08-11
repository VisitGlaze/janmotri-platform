import { useLanguage } from "../../../../../shared/LanguageContext";
import HeroEnglish from "./HeroEnglish";
import HeroGujarati from "./HeroGujarati";
import HeroHindi from "./HeroHindi";

const HeroSection = () => {
  const { language } = useLanguage();

  if (language === "gu") {
    return <HeroGujarati />;
  }

  if (language === "hi") {
    return <HeroHindi />;
  }

  return <HeroEnglish />;
};

export default HeroSection;
