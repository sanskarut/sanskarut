import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Process } from "@/components/process";
import { Portfolio } from "@/components/portfolio";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Team } from "@/components/team";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import { FAQ_ITEMS } from "@/lib/faq-data";
import { Contact } from "@/components/contact";
import { CtaSection } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <Process />
        {/* <Portfolio /> */}
        <WhyChooseUs />
        <Team />
        {/* <Testimonials /> */}
        <FAQ />
        <Contact />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
