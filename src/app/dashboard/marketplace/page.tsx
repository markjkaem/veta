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
import db from "../../../../drizzle/db";
import { profiles, users } from "../../../../drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Music App",
  description: "Example music app using the components.",
};

const getInfluencers = async () => {
  const response = await db
    .select()
    .from(profiles)
    .where(eq(profiles.role, "influencer"));
  const filteredResponse = response.filter((item) => item?.alias?.length! > 2);
  return filteredResponse;
};

export default async function MusicPage() {
  const influencers = await getInfluencers();
  return (
    <>
      <DashboardHeader />

      <div className="hidden md:block">
        {/* <Menu /> */}
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar playlists={playlists} className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="music" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="music" className="relative">
                          Marketplace
                        </TabsTrigger>
                        {/* <TabsTrigger value="podcasts">My matches</TabsTrigger> */}
                      </TabsList>
                      <div className="ml-auto mr-4"></div>
                    </div>
                    <TabsContent
                      value="music"
                      className="border-none p-0 outline-none"
                    >
                      <div className="mt-6 space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          VETA influencers
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Find your perfect match. Updated daily.
                        </p>
                      </div>
                      <Separator className="my-4" />
                      <div className="relative">
                        <ScrollArea>
                          <div className="flex space-x-4 pb-4">
                            {influencers.map((influencer, i) => (
                              <InfluencerArtwork
                                key={i}
                                influencer={influencer}
                                className="w-[150px]"
                                aspectRatio="square"
                                width={150}
                                height={150}
                              />
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="podcasts"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            New Episodes
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Your favorite podcasts. Updated daily.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <PodcastEmptyPlaceholder />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
