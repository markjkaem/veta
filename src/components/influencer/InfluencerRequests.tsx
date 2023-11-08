import { eq } from "drizzle-orm";
import db from "../../../drizzle/db";
import {
  campaignMessages,
  campaigns,
  companyProfiles,
  influencerProfiles,
  listings,
} from "../../../drizzle/schema";
import { getServerSession } from "next-auth";
import { Application, columns } from "./InfluencerCollumn";
import { InfluencerDataTable } from "./InfluencerDataTable";

async function getData(): Promise<Application[]> {
  const session = await getServerSession();
  const sender = await db
    .select({
      senderId: influencerProfiles.id,
      image: influencerProfiles.image,
    })
    .from(influencerProfiles)
    .where(eq(influencerProfiles.email, session?.user?.email as string));
  if (!sender[0]) {
    return [];
  }
  const response = await db
    .select({
      id: campaignMessages.id,
      senderId: campaignMessages.senderId,
      receiverId: campaignMessages.receiverId,
      message: campaignMessages.message,
      campaignId: campaignMessages.campaignId,
    })
    .from(campaignMessages)
    .where(eq(campaignMessages?.senderId, sender[0]?.senderId));

  let detailedData = [];
  for (let i = 0; i < response.length; i++) {
    const row = await db
      .select({
        alias: companyProfiles.alias,
        image: companyProfiles.image,
      })
      .from(companyProfiles)
      .where(eq(companyProfiles.id, response[i]?.receiverId as string));

    const listingRow = await db
      .select({ listingId: campaigns.listingId })
      .from(campaigns)
      .where(eq(campaigns.id, response[i].campaignId as string));

    const listing = await db
      .select({ title: listings.title, description: listings.description })
      .from(listings)
      .where(eq(listings.id, listingRow[0]?.listingId as string));

    detailedData.push({
      ...response[i],
      listingId: listingRow[0].listingId,
      listingDescription: listing[0]?.description,
      listingTitle: listing[0]?.title,
      alias: row[0].alias,
      image: row[0].image,
      senderImage: sender[0].image,
    });
  }

  return detailedData;
}

async function InfluencerRequests() {
  const data = await getData();

  return (
    <div className=" w-screen md:w-full mx-auto py-2">
      {data && <InfluencerDataTable columns={columns} data={data} />}
    </div>
  );
}

export default InfluencerRequests;
