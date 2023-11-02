import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard-header";
import db from "../../../../../../drizzle/db";
import { profiles, users } from "../../../../../../drizzle/schema";
import { and, desc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Music App",
  description: "Example music app using the components.",
};

const getInfluencer = async (slug: string) => {
  const response = await db
    .select()
    .from(profiles)
    .where(and(eq(profiles.role, "influencer"), eq(profiles.id, slug)));

  return response[0];
};

const onSubmit = async () => {
  "use server";
  console.log("server action requested");
};

export default async function MusicPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerSession();

  const influencers = await getInfluencer(params.slug);

  if (influencers.email === (session?.user?.email as string)) {
    redirect("/dashboard/settings/profile");
  }
  return (
    <>
      <DashboardHeader />

      <div className="hidden md:block">
        {/* <Menu /> */}
        <div className="border-t">
          {influencers?.alias}
          <form action={onSubmit}>
            <Button type="submit">Connect</Button>
          </form>
        </div>
      </div>
    </>
  );
}
