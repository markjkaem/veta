import Companies from "@/components/companies";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Pricing from "@/components/pricing";
import Services from "@/components/services";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center">
      <div>
        <Header />
      </div>
      <Hero />
      <div className="container-center container-spacing-xl container">
        <Services />
      </div>
      <Pricing />
      <Companies />
    </main>
  );
}
