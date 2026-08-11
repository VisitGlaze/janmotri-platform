import { useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import HeroSection from "./HeroSection/HeroSection";
import StorySection from "./StorySection/StorySection";
import JourneySection from "./JourneySection/JourneySection";
import ProcessSection from "./ProcessSection/ProcessSection";
import PromiseSection from "./PromiseSection/PromiseSection";
import VisionMissionSection from "./VisionMissionSection/VisionMissionSection";
import CTASection from "./CTASection/CTASection";
import GallerySection from "./GallerySection/GallerySection";
import "./About.scss";

const About = () => {
  // Ensure we start at the top of the page when navigating to About Us
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page-root">
      <Navbar />
      <main className="about-main-content">
        <HeroSection />
        <StorySection />
        <JourneySection />
        <ProcessSection />
        <PromiseSection />
        <VisionMissionSection />
        <CTASection />
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
