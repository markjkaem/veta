import { Separator } from "@/components/ui/separator";
import { SocialsCart } from "@/components/socials-cart";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import InfluencerSocials from "@/components/influencer/InfluencerSocials";
import { getServerSession } from "next-auth";
import db from "../../../../../drizzle/db";
import { users } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";

const getRole = async () => {
  const session = await getServerSession();
  const role = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.email, session?.user?.email as string));
  return role[0]?.role;
};

export default async function SettingsSocialsPage() {
  const role = await getRole();
  return (
    <div>
      {role === "company" && (
        <div>
          Influencers only can connect social accounts with their account.
        </div>
      )}
      {role === "influencer" && <InfluencerSocials />}
    </div>
  );
}
