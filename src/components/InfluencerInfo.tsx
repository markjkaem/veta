import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import db from "../../drizzle/db";
import { companyProfiles, influencerProfiles } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";

const getInfluencerProfile = async (slug: string) => {
  const response = await db
    .select()
    .from(influencerProfiles)
    .where(eq(influencerProfiles.id, slug));
  return response[0];
};

export async function InfluencerInfo({ slug }: { slug: string }) {
  const influencerProfile = await getInfluencerProfile(slug);
  const selectedCategories = influencerProfile?.categories?.split(",");

  return (
    <Card className="md:w-3/6 w-full">
      <CardHeader className="grid  items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-4">
            <Image
              className="h-12 w-12 rounded-full"
              src={influencerProfile?.image as string}
              alt={influencerProfile?.alias as string}
              height={200}
              width={200}
            />
            {influencerProfile?.alias}
          </CardTitle>
          <CardDescription>
            <a
              target="_blank"
              className="hover:text-gray-500 pt-4"
              href={influencerProfile?.url as string}
            >
              {" "}
              {influencerProfile?.url}
            </a>
          </CardDescription>
          <CardDescription>{influencerProfile?.bio}</CardDescription>
          <CardDescription>
            {" "}
            <span className="md:w-4/6 w-full mt-4 grid lg:grid-cols-3 md:gap-6 grid-cols-2 gap-6">
              {selectedCategories?.map((category, index) => {
                return (
                  <span
                    key={index}
                    className="flex w-full py-2 px-1 bg-[#F472B6] rounded-sm  text-white font-bold font-inter"
                  >
                    {category}
                  </span>
                );
              })}
            </span>
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
