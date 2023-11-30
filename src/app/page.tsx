import Companies from "@/components/companies";
import Header from "@/components/header";
import Pricing from "@/components/pricing";
import Services from "@/components/services";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center">
      <div>
        <Header />
      </div>
      <div className="h-40"></div>
      <Link
        className="bg-pink-400 text-white rounded-sm py-3 px-5 no-underline hover:bg-pink-500 transition"
        href="/sign-in"
      >
        Test signIn
      </Link>
      <Companies />
    </main>
  );
}
