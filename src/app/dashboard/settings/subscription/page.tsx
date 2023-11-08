import InfluencerSocials from "@/components/influencer/InfluencerSocials";
import { Session, getServerSession } from "next-auth";
import db from "../../../../../drizzle/db";
import { users } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getCurrentSubscription } from "@/helpers/subscription";

const getRole = async (session: Session) => {
  const role = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.email, session?.user?.email as string));
  return role[0]?.role;
};

export default async function SettingsSocialsPage() {
  const session = await getServerSession();
  const role = await getRole(session as Session);
  const isSubscribed = await getCurrentSubscription(
    session?.user?.email as string
  );

  return (
    <div>
      {role === "company" && (
        <div>
          {isSubscribed && "You are subscribed"}
          {!isSubscribed && "You are not subscribed"}
        </div>
      )}
      {role === "influencer" && (
        <div>This is only available for Company accounts</div>
      )}
    </div>
  );
}
