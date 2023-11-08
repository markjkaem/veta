import Stripe from "stripe";
import db from "../../drizzle/db";
import { JWT } from "next-auth/jwt";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { Session } from "next-auth";

export const SUBSCRIPTION_PLAN_ID = "price_1OA0FlJ0Tu9paWkWv8iNbHFT"


export const getCurrentSubscription = async (email: string) => {
   
   

  

    const user = await db
      .select({ stripe_id: users.stripe_id })
      .from(users)
      .where(eq(users.email, email ));
  
    if (!user[0]?.stripe_id) {
      return false;
    }
  
    const stripe = new Stripe(
      "sk_test_51L34nrJ0Tu9paWkW9sF0gCPGB55l3fncgRlFJmF2Lcr4xEUdCMuUtQnYang1GsxdZAmw9AaTC6vHgJHPhNMAsDDA000WqYNd73",
      {
        apiVersion: "2023-10-16",
      }
    );
  
    const subscription = await stripe.subscriptions.list({
      customer: user[0].stripe_id as string,
    });
  
  
    const activeSubscriptions = subscription?.data?.filter(
      (item: any) => item.status === "active"
    );
  
    const activeSubscriptionIds = activeSubscriptions?.map(
      (item: any) => item.plan.id
    );
    const isPlan = activeSubscriptionIds.filter(
      (id: any) => id === SUBSCRIPTION_PLAN_ID
    );
  
    if (isPlan.length > 0) {
      return true;
    }
    else{
      return false
    }
  };