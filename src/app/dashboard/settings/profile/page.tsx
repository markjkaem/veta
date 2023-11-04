import { Separator } from "@/components/ui/separator";
import db from "../../../../../drizzle/db";
import {
  companyProfiles,
  influencerProfiles,
  users,
} from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { CompanyProfileForm } from "@/components/company/CompanyProfileForm";
import { InfluencerProfileForm } from "@/components/influencer/InfluencerProfileForm";

const checkRole = async () => {
  const session = await getServerSession();
  const response = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.email, session?.user?.email as string));

  return response[0].role;
};

export default async function SettingsAddresssPage() {
  const session = await getServerSession();
  const role = await checkRole();
  // This can come from your database or API.
  const influencerData = await db
    .select()
    .from(influencerProfiles)
    .where(eq(influencerProfiles.email, session?.user?.email as string));

  const companyData = await db
    .select()
    .from(companyProfiles)
    .where(eq(companyProfiles.email, session?.user?.email as string));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is information that can be seen by other users.
        </p>
      </div>
      <Separator />
      {role === "company" && <CompanyProfileForm companyData={companyData} />}
      {role === "influencer" && (
        <InfluencerProfileForm profileData={influencerData} />
      )}
    </div>
  );
}
