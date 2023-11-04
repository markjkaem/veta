import Image from "next/image";
import { PlusCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { playlists } from "@/helpers/playlists";
import Link from "next/link";
import db from "../../../drizzle/db";
import { companyProfiles, listingsTasks } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { Listings } from "../types/Listings";

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  listings: Listings;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

const getCompany = async (email: string) => {
  const response = await db
    .select()
    .from(companyProfiles)
    .where(eq(companyProfiles.email, email));
  return response[0];
};

const getListingTasks = async (id: string) => {
  const response = await db
    .select()
    .from(listingsTasks)
    .where(eq(listingsTasks.listingId, id));
  return response;
};

export async function CompanyMainMarketplace({
  listings,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: AlbumArtworkProps) {
  const company = await getCompany(listings.email as string);
  const listingTasks = await getListingTasks(listings.id);
  return (
    <div className={cn("space-y-3 relative", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            {company.image ? (
              <Link href={`/dashboard/campaigns/listings/${listings.id}`}>
                <Image
                  src={company?.image as string}
                  alt={company?.alias as string}
                  width={width}
                  height={height}
                  className={cn(
                    "h-auto w-auto object-cover transition-all hover:scale-105",
                    aspectRatio === "portrait"
                      ? "aspect-[3/4]"
                      : "aspect-square"
                  )}
                />
              </Link>
            ) : (
              <Link href={`/dashboard/campaigns/listings/${listings.id}`}>
                <Image
                  src={"/veta-template.jpg"}
                  alt={company?.alias as string}
                  width={width}
                  height={height}
                  className={cn(
                    "h-auto w-auto object-cover transition-all hover:scale-105",
                    aspectRatio === "portrait"
                      ? "aspect-[3/4]"
                      : "aspect-square"
                  )}
                />
              </Link>
            )}
            <div className="absolute z-10 bottom-20 space-y-1 text-sm">
              <div className="flex -space-x-4">
                {listingTasks
                  .filter((item, index) => index < 3)
                  .map((item, index) => {
                    return (
                      <img
                        key={index}
                        className="w-10 h-10 border-2 border-white bg-white p-1 rounded-full dark:border-gray-800"
                        src={`/platforms/${item.platform}.png`}
                        alt=""
                      />
                    );
                  })}

                <a
                  className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                  href="#"
                >
                  {listingTasks.length >= 3 && (
                    <span>+{listingTasks.length - 3}</span>
                  )}
                  {listingTasks.length == 2 && (
                    <span>+{listingTasks.length - 2}</span>
                  )}

                  {listingTasks.length == 1 && (
                    <span>+{listingTasks.length - 1}</span>
                  )}
                  {listingTasks.length == 0 && (
                    <span>+{listingTasks.length}</span>
                  )}
                </a>
              </div>
            </div>
          </div>
          <h3 className="font-medium mt-8 leading-none">{listings?.title}</h3>
          <p className="text-xs text-muted-foreground capitalize">Campaign</p>
        </ContextMenuTrigger>
      </ContextMenu>
    </div>
  );
}
