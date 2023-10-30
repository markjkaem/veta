import Companies from "@/components/companies";
import Hero from "@/components/hero";
import Pricing from "@/components/pricing";
import Services from "@/components/services";

export default function Home() {
  return (
    <main className="flex flex-col justify-center bg-[#010023] items-center">
      <div role="presentation" className="ellipsis"></div>
      <div role="presentation" className="ellipsis ellipsis-purple"></div>
      <Hero />
      <div className="container-center container-spacing-xl container">
        <Services />
      </div>
      <Pricing />
      <Companies />
    </main>
  );
}
