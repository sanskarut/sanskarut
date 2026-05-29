import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Process } from "@/components/process";
import { Portfolio } from "@/components/portfolio";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Team } from "@/components/team";
import { Testimonials } from "@/components/testimonials";
import { Contact } from "@/components/contact";
import { CtaSection } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <Process />
        <Portfolio />
        <WhyChooseUs />
        <Team />
        <Testimonials />
        <Contact />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
