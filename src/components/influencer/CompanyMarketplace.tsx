import React from "react";
import { Sidebar } from "../ui/sidebar";
import { playlists } from "@/helpers/playlists";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { CompanyMainMarketplace } from "../influencer/CompanyMainMarketplace";
import { PodcastEmptyPlaceholder } from "../ui/podcast-empty-placeholder";
import { Listings } from "../types/Listings";

function CompanyMarketplace({ items }: { items: Listings[] }) {
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
                        All Listed Campaigns
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
                        Open Listings
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Here you can find open campaigns and apply to them.
                      </p>
                    </div>
                    <Separator className="my-4" />
                    <div className="relative">
                      <ScrollArea>
                      <div className="grid md:grid-cols-3 grid-cols-1 gap-4 pb-4">
                          {items.map((company, i) => (
                            <CompanyMainMarketplace
                              key={i}
                              listings={company}
                             
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

export default CompanyMarketplace;
