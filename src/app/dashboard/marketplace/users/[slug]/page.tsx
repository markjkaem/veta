import { Metadata } from "next";
import Image from "next/image";
import { PlusCircledIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { InfluencerArtwork } from "@/components/ui/album-artwork";
import { Menu } from "@/components/ui/menu";
import { PodcastEmptyPlaceholder } from "@/components/ui/podcast-empty-placeholder";
import { Sidebar } from "@/components/ui/sidebar";
import { listenNowAlbums, madeForYouAlbums } from "@/helpers/albums";
import { playlists } from "@/helpers/playlists";
import DashboardHeader from "@/components/dashboard-header";
import Link from "next/link";
import db from "../../../../../../drizzle/db";
import { profiles, users } from "../../../../../../drizzle/schema";
import { and, desc, eq } from "drizzle-orm";

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
  const influencers = await getInfluencer(params.slug);
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
