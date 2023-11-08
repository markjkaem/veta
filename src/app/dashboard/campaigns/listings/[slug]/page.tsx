import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard-header";
import db from "../../../../../../drizzle/db";
import {
  influencerProfiles,
  listings,
  listingsTasks,
} from "../../../../../../drizzle/schema";
import { and, desc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SocialsCart } from "@/components/socials-cart";
import { SocialCart } from "@/components/SocialCart";
import { CompanyListingInfo } from "@/components/CompanyListingInfo";
import { CompanyListingCompanyInfo } from "@/components/CompanyListingCompanyInfo";

export const metadata: Metadata = {
  title: "Music App",
  description: "Example music app using the components.",
};

const getListing = async (slug: string) => {
  const response = await db
    .select()
    .from(listings)
    .where(eq(listings.id, slug));

  return response[0];
};

export default async function MusicPage({
  params,
}: {
  params: { slug: string };
}) {
  const listings = await getListing(params.slug);

  return (
    <>
      <DashboardHeader />

      <div className=" md:block">
        {/* <Menu /> */}
        <div className="border-t">
          <div className="p-4 grid md:flex w-max-screen gap-4 grid-cols-1">
            <CompanyListingInfo listings={listings} />
            <div className="flex flex-col gap-4">
              <CompanyListingCompanyInfo listings={listings} />
              <SocialCart listings={listings} />
            </div>{" "}
          </div>
        </div>
      </div>
    </>
  );
}
