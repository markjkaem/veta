import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import Link from "next/link";
import db from "../../../drizzle/db";
import {  listingsTasks } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { Listings } from "../types/Listings";

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  listings: Listings;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}


const getListingTasks = async (id: string) => {
  const response = await db
    .select()
    .from(listingsTasks)
    .where(eq(listingsTasks.listingId, id));
  return response;
};

export async function CompanyMainMarketplace({
  listings,
  className,
  ...props
}: AlbumArtworkProps) {
  const listingTasks = await getListingTasks(listings.id);
  return (
    <div className={cn("space-y-3 relative", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            {listings.banner ? (
              <Link href={`/dashboard/campaigns/listings/${listings.id}`}>
                <Image
                  src={listings?.banner as string}
                  alt={listings?.title as string}
                  width={800}
                  height={800}
                  className={cn(
                    " w-full h-40 object-cover transition-all hover:scale-105",
                    
                  )}
                />
              </Link>
            ) : (
              <Link href={`/dashboard/campaigns/listings/${listings.id}`}>
                 <Image
                  src={"/veta-template.jpg"}
                  alt={listings.title as string}
                  width={800}
                  height={800}
                  className={cn(
                    " w-full h-40 object-cover transition-all hover:scale-105",
                  )}
                />  
              </Link>
            )}
            <div className="absolute z-10 bottom-20 space-y-1 text-sm">
              <div className="flex -space-x-4">
                {listingTasks
                  .filter((__, index) => index < 3)
                  .map((item, index) => {
                    return (
                      <Image
                        key={index}
                        className="w-10 h-10 border-2 border-white bg-white p-1 rounded-full dark:border-gray-800"
                        src={`/platforms/${item.platform}.png`}
                        alt=""
                        width={200}
                        height={200}
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
