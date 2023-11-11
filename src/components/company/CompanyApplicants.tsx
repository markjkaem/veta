import { eq } from "drizzle-orm";
import db from "../../../drizzle/db";
import {
  campaignMessages,
  campaigns,
  companyProfiles,
  influencerProfiles,
  listings,
} from "../../../drizzle/schema";
import { Applicant, columns } from "../company/CompanyCollumn";
import { CompanyDataTable } from "./CompanyDatatable";
import { getServerSession } from "next-auth";

async function getData(): Promise<Applicant[]> {
  const session = await getServerSession();
  const receiver = await db
    .select({ receiverId: companyProfiles.id, image: companyProfiles.image })
    .from(companyProfiles)
    .where(eq(companyProfiles.email, session?.user?.email as string));
  if (!receiver[0]) {
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
    .where(eq(campaignMessages?.receiverId, receiver[0]?.receiverId));

  let detailedData = [];
  for (let i = 0; i < response.length; i++) {
    const row = await db
      .select({
        alias: influencerProfiles.alias,
        image: influencerProfiles.image,
      })
      .from(influencerProfiles)
      .where(eq(influencerProfiles.id, response[i]?.senderId as string));
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
      receiverImage: receiver[0].image,
    });
  }

  return detailedData;
}

async function CompanyApplicants() {
  const data = await getData();

  return (
    <div className=" w-screen md:w-full mx-auto py-2">
      {data && <CompanyDataTable columns={columns} data={data} />}
    </div>
  );
}

export default CompanyApplicants;
