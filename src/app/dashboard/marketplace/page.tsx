import { Metadata } from "next";
import DashboardHeader from "@/components/dashboard-header";
import db from "../../../../drizzle/db";
import {
  influencerProfiles,
  companyProfiles,
  users,
  listings,
} from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import CompanyMarketplace from "@/components/influencer/CompanyMarketplace";
import InfluencerMarketplace from "@/components/company/InfluencerMarketplace";

export const metadata: Metadata = {
  title: "Music App",
  description: "Example music app using the components.",
};

const getInfluencers = async () => {
  const response = await db.select().from(influencerProfiles);
  const filteredResponse = response.filter((item) => item?.alias?.length! > 2);
  return filteredResponse;
};

const getCompanyListings = async () => {
  const response = await db.select().from(listings);
  return response;
};

const checkRole = async () => {
  const session = await getServerSession();
  const response = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.email, session?.user?.email as string));

  return response[0].role;
};

export default async function MusicPage() {
  const influencers = await getInfluencers();
  const listings = await getCompanyListings();
  const role = await checkRole();
  return (
    <>
      <DashboardHeader />
      {role === "influencer" && <CompanyMarketplace items={listings} />}
      {role === "company" && <InfluencerMarketplace items={influencers} />}
    </>
  );
}
