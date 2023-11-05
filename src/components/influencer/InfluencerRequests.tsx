import { eq } from "drizzle-orm";
import db from "../../../drizzle/db";
import { campaignMessages, influencerProfiles } from "../../../drizzle/schema";
import { getServerSession } from "next-auth";
import { DataTable } from "../ui/datatable";
import { Payment, columns } from "./InfluencerCollumn";

async function getData(): Promise<Payment[]> {
  const session = await getServerSession();
  const senderId = await db
    .select({ senderId: influencerProfiles.id })
    .from(influencerProfiles)
    .where(eq(influencerProfiles.email, session?.user?.email as string));
  if (!senderId[0]) {
    return [];
  }
  const response = await db
    .select({
      id: campaignMessages.id,
      sender: campaignMessages.senderId,
      receiver: campaignMessages.receiverId,
      message: campaignMessages.message,
      campaignId: campaignMessages.campaignId,
    })
    .from(campaignMessages)
    .where(eq(campaignMessages?.senderId, senderId[0]?.senderId));

  return response;
}

async function InfluencerRequests() {
  const data = await getData();

  return (
    <div className=" w-screen md:w-full mx-auto py-2">
      {data && <DataTable columns={columns} data={data} />}
    </div>
  );
}

export default InfluencerRequests;
