import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import InitialCompanySection from "@/components/landing/InitialCompanySection";
import Footer from "@/components/Footer";
import BenefitsBar from "@/components/BenefitsBar";
import BenefitsClue from "@/components/landing/clueBenefits";
import PasoaPaso from "@/components/landing/PasoaPaso";
import PlanesPrecios from "@/components/landing/PlanesPrecios";

const HomePublic = () => {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <BenefitsBar />
      <InitialCompanySection />
      <BenefitsClue />
      <PasoaPaso />
      <PlanesPrecios />      
      {/*<InitialCompanySection />*/}
      <Footer />
      
      
    </div>
  );
};

export default HomePublic;