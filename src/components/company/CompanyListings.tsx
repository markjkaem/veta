import React from "react";
import { Sidebar } from "../ui/sidebar";
import { playlists } from "@/helpers/playlists";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { PodcastEmptyPlaceholder } from "../ui/podcast-empty-placeholder";
import { MyListings } from "./MyListings";
import { CompanyListingForm } from "./CompanyListingForm";
import { Listings } from "../types/Listings";
import CompanyApplicants from "./CompanyApplicants";

interface CompanyProfile {
  id: string;
  alias: string | null;
  url: string | null;
  email: string | null;
  bio: string | null;
  categories: string | null;
  countries: string | null;
  genders: string | null;
  image: string | null;
}

function CompanyListings({
  listings,
  profile,
  role,
}: {
  listings: Listings[];
  profile: CompanyProfile;
  role: "influencer" | "company" | null;
}) {
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
                      <TabsTrigger value="applicants">Applicants</TabsTrigger>

                      {role === "company" && (
                        <TabsTrigger value="mylistings" className="relative">
                          My Listings
                        </TabsTrigger>
                      )}
                      {role === "company" && (
                        <TabsTrigger value="create">Create Listing</TabsTrigger>
                      )}
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
                          Applicants
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Here are applicants that may want to join your
                          campaign
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <CompanyApplicants />
                  </TabsContent>

                  <TabsContent
                    value="mylistings"
                    className="border-none p-0 outline-none"
                  >
                    <div className="mt-6 space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        My Listings
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Here are all the listings that you have created.
                      </p>
                    </div>
                    <Separator className="my-4" />
                    <div className="relative">
                      <ScrollArea>
                        <div className="flex space-x-4 pb-4">
                          {listings.map((listing, i) => (
                            <MyListings
                              key={i}
                              profile={profile}
                              listings={listing}
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
                    value="create"
                    className="h-full flex-col border-none p-0 data-[state=active]:flex"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Create Listing
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Create a new Campaign to attract users.
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />

                    <CompanyListingForm />
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

export default CompanyListings;
