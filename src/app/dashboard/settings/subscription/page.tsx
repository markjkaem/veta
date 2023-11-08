import InfluencerSocials from "@/components/influencer/InfluencerSocials";
import { Session, getServerSession } from "next-auth";
import db from "../../../../../drizzle/db";
import { users } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getCurrentSubscription } from "@/helpers/subscription";
import { Button } from "@/components/ui/button";
import Stripe from "stripe";
import { redirect } from "next/navigation";

const getRole = async (session: Session) => {
  const role = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.email, session?.user?.email as string));
  return role[0]?.role;
};

const getSubscriptionData = async () => {
  const session = await getServerSession();
  const stripe = new Stripe(
    "sk_test_51L34nrJ0Tu9paWkW9sF0gCPGB55l3fncgRlFJmF2Lcr4xEUdCMuUtQnYang1GsxdZAmw9AaTC6vHgJHPhNMAsDDA000WqYNd73",
    {
      apiVersion: "2023-10-16",
    }
  );

  if (!session) {
    redirect(`/sign-in`);
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user?.email as string));

  if (!user[0].stripe_id?.includes("cus")) {
    return {
      url: `/sign-in`,
    };
  }
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user[0].stripe_id,
    return_url: `http://localhost:3000/dashboard/settings/subscription`,
  });

  return {
    url: portalSession.url,
  };
};

const submit = async () => {
  "use server";
  const response = await getSubscriptionData();
  redirect(response.url);
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
          {isSubscribed && (
            <div>
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                You are subscribed
              </h1>
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                "Welcome to our community! You're now part of our exclusive club
                of subscribers. Get ready to unlock a world of benefits,
                updates, and special offers. Thank you for choosing to stay
                connected with us. We can't wait to share exciting content and
                news with you."
              </p>
              <form action={submit} className="mt-4">
                {" "}
                <Button variant="outline">Manage subscriptions</Button>
              </form>
            </div>
          )}
          {!isSubscribed && "You are not subscribed"}
        </div>
      )}
      {role === "influencer" && (
        <div>This is only available for Company accounts</div>
      )}
    </div>
  );
}
