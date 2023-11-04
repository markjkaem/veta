import { BellIcon, EyeNoneIcon, PersonIcon } from "@radix-ui/react-icons";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Listings } from "./types/Listings";
import db from "../../drizzle/db";
import { listingsTasks } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";

const getListingTasks = async (id: string) => {
  const response = await db
    .select()
    .from(listingsTasks)
    .where(eq(listingsTasks.listingId, id));
  return response;
};

export async function SocialCart({ listings }: { listings: Listings }) {
  const listingTasks = await getListingTasks(listings.id);
  //  in here create an array to database, insta fb etc. Add what needs to be made. Maybe make a new table with TASKS?
  return (
    <Card className="md:w-4/6 w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle>Tasks</CardTitle>
        <CardDescription>
          What needs to be done in this campaign.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        {listingTasks.map((item, i) => {
          return (
            <div
              key={i}
              className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground"
            >
              <Image
                className="mt-px h-5 w-5"
                src={`/platforms/${item.platform}.png`}
                alt={item.platform as string}
                width={200}
                height={200}
              />
              <div className="space-y-1">
                <p className="text-sm capitalize font-medium leading-none">
                  {item.platform}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
