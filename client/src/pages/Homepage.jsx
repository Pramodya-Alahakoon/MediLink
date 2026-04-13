import Hero from "@/section/Home/Hero";
import Stats from "@/section/Home/Stats";
import Services from "@/section/Home/Services";
import SymptomAnalysis from "@/section/Home/SymptomAnalysis";
import Specialists from "@/section/Home/Specialists";
import PathToWellness from "@/section/Home/PathToWellness";
import WhyMediLink from "@/section/Home/WhyMediLink";
import Testimonials from "@/section/Home/Testimonials";

const Home = () => {
  return (
    <main className="w-full overflow-x-hidden bg-[#F8FAFB]">
      <Hero />
      <Stats />
      <Services />
      <SymptomAnalysis />
      <Specialists />
      <PathToWellness />
      <WhyMediLink />
      <Testimonials />
    </main>
  );
};

export default Home;
