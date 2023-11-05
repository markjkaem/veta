import React from "react";
import { Sidebar } from "../ui/sidebar";
import { playlists } from "@/helpers/playlists";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { PodcastEmptyPlaceholder } from "../ui/podcast-empty-placeholder";
import { Listings } from "../types/Listings";
import InfluencerRequests from "./InfluencerRequests";

interface InfluencerProfile {
  id: string;
  alias: string | null;
  url: string | null;
  email: string | null;
  bio: string | null;
  categories: string | null;
  image: string | null;
}

function InfluencerListings({ profile }: { profile: InfluencerProfile }) {
  return (
    <div className=" md:block">
      {/* <Menu /> */}
      <div className="border-t">
        <div className="bg-background">
          <div className="grid lg:grid-cols-2">
            <div className="col-span-3 lg:col-span-4 lg:border-l">
              <div className="h-full px-4 py-6 lg:px-8">
                <Tabs defaultValue="applicants" className="h-full space-y-6">
                  <div className="space-between flex items-center">
                    <TabsList>
                      <TabsTrigger value="applicants">Requests</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto mr-4"></div>
                  </div>
                  <TabsContent
                    value="applicants"
                    className="h-full flex-col border-none p-0 data-[state=active]:flex"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Requests
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Your campaign requests list
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <InfluencerRequests />
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

export default InfluencerListings;
