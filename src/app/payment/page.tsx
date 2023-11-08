import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import Stripe from "stripe";
import { users } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../../../drizzle/db";

const createPayment = async (id: string) => {
  const session = await getServerSession();
  const stripe = new Stripe(
    "sk_test_51L34nrJ0Tu9paWkW9sF0gCPGB55l3fncgRlFJmF2Lcr4xEUdCMuUtQnYang1GsxdZAmw9AaTC6vHgJHPhNMAsDDA000WqYNd73",
    {
      apiVersion: "2023-10-16",
    }
  );

  if (!id) {
    redirect("/pricing");
  }

  if (!session) {
    redirect("/sign-in");
  }

  const email = session?.user?.email;
  const price = await stripe.prices.retrieve(`${id}`);

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email as string));

  let customer;

  if (!user[0].stripe_id?.includes("cus")) {
    customer = await stripe.customers.create({
      email: email as string | undefined,
    });
    await db
      .update(users)
      .set({ stripe_id: customer.id })
      .where(eq(users.email, email as string));
  } else {
    customer = { id: user[0].stripe_id };
  }

  const payoutSession = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `http://localhost:3000/payment/success/?sessionid={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3000/payment/cancel`,
    customer: customer.id,
  });
  redirect(`${payoutSession.url}`);
};

async function Page({ searchParams }: { searchParams: { id: string } }) {
  await createPayment(searchParams.id);

  return <div>Creating payment...</div>;
}

export default Page;
