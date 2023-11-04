import React from "react";
import { Sidebar } from "../ui/sidebar";
import { playlists } from "@/helpers/playlists";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { InfluencerMainMarketplace } from "./InfluencerMainMarketplace";
import { PodcastEmptyPlaceholder } from "../ui/podcast-empty-placeholder";

interface Item {
  id: string;
  email: string | null;
  image: string | null;
  alias: string | null;
  url: string | null;
  bio: string | null;
  categories: string | null;
}

function InfluencerMarketplace({ items }: { items: Item[] }) {
  return (
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
                          {items.map((influencer, i) => (
                            <InfluencerMainMarketplace
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
  );
}

export default InfluencerMarketplace;
