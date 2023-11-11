import { NextResponse } from "next/server"
import db from "../../../../../drizzle/db"
import { campaignMessages, campaigns, listings, listingsTasks } from "../../../../../drizzle/schema"
import { eq } from "drizzle-orm"
import { revalidatePath, unstable_noStore } from "next/cache"
import { redirect } from "next/navigation"

export async function POST(request: Request) {
   
   const id = await request.json()
   await db.delete(listings).where(eq(listings.id, id))
   await db.delete(campaigns).where(eq(campaigns.listingId, id))
   await db.delete(listingsTasks).where(eq(listingsTasks.listingId, id))
   await db.delete(campaignMessages).where(eq(campaignMessages.campaignId, id))

   revalidatePath("/dashboard/campaigns")
   redirect("/dashboard/campaigns")
   // return NextResponse.json({id: id})
  }