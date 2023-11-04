import CompanyListings from "@/components/company/CompanyListings";
import DashboardHeader from "@/components/dashboard-header";
import db from "../../../../drizzle/db";
import { companyProfiles, listings, users } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

const getListings = async () => {
  const session = await getServerSession();
  const response = await db
    .select()
    .from(listings)
    .where(eq(listings.email, session?.user?.email as string));
  return response;
};

const getProfile = async () => {
  const session = await getServerSession();
  const response = await db
    .select()
    .from(companyProfiles)
    .where(eq(companyProfiles.email, session?.user?.email as string));
  return response[0];
};

const checkRole = async () => {
  const session = await getServerSession();
  const response = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.email, session?.user?.email as string));

  return response[0].role;
};

export default async function Page() {
  const role = await checkRole();
  if (role !== "company") {
    console.log("not a company");
  }
  const listings = await getListings();
  const profile = await getProfile();
  return (
    <>
      <DashboardHeader />
      <CompanyListings listings={listings} profile={profile} role={role} />
    </>
  );
}
