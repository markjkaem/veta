import {
  ChevronDownIcon,
  CircleIcon,
  PlusIcon,
  StarIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Listings } from "./types/Listings";
import db from "../../drizzle/db";
import {
  companyProfiles,
  listings,
  influencerProfiles,
  users,
} from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { ApplyPopoverButtonInfluencer } from "./ApplyPopoverButtonInfluencer";
import { ApplyPopoverButtonCompany } from "./ApplyPopoverButtonCompany";

const getCompanyProfile = async (email: string) => {
  const response = await db
    .select()
    .from(companyProfiles)
    .where(eq(companyProfiles.email, email));
  return response[0];
};

const getInfluencerProfile = async () => {
  const session = await getServerSession();
  const response = await db
    .select({
      influencerId: influencerProfiles.id,
    })
    .from(influencerProfiles)
    .where(eq(influencerProfiles.email, session?.user?.email as string));
  if (!response[0]?.influencerId) {
    return { influencerId: "", senderName: "" };
  }
  return {
    influencerId: response[0]?.influencerId,
  };
};

const getRole = async () => {
  const session = await getServerSession();
  const role = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.email, session?.user?.email as string));
  return role[0].role;
};

export async function CompanyListingCompanyInfo({
  listings,
}: {
  listings: Listings;
}) {
  const role = await getRole();
  const companyProfile = await getCompanyProfile(listings.email as string);
  const influencerProfile = await getInfluencerProfile();
  const selectedCategories = companyProfile?.categories?.split(",");

  return (
    <Card className="w-full">
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-4">
            <Image
              className="h-12 w-12 rounded-full"
              src={companyProfile?.image as string}
              alt={companyProfile?.alias as string}
              height={200}
              width={200}
            />
            {companyProfile?.alias}
          </CardTitle>
          <CardDescription className="font-bold">
            {companyProfile?.url}
          </CardDescription>
          <CardDescription>{companyProfile?.bio}</CardDescription>
          <CardDescription>
            {" "}
            <span className="w-80 mt-4 grid lg:grid-cols-3 md:gap-6 grid-cols-2 gap-6">
              {selectedCategories?.map((category, index) => {
                return (
                  <span key={index}>
                    <span className="py-2 px-1 bg-[#F472B6] rounded-sm  text-white font-bold font-inter">
                      {category}
                    </span>
                  </span>
                );
              })}
            </span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {role === "influencer" && (
          <ApplyPopoverButtonInfluencer
            listingsId={listings.id}
            companyId={companyProfile.id}
            influencerId={influencerProfile.influencerId}
          />
        )}
      </CardContent>
    </Card>
  );
}
