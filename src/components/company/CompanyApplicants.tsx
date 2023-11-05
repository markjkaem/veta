import { eq } from "drizzle-orm";
import db from "../../../drizzle/db";
import { campaignMessages, companyProfiles } from "../../../drizzle/schema";
import { Payment, columns } from "../company/CompanyCollumn";
import { DataTable } from "../ui/datatable";
import { getServerSession } from "next-auth";

async function getData(): Promise<Payment[]> {
  const session = await getServerSession();
  const receiverId = await db
    .select({ receiverId: companyProfiles.id })
    .from(companyProfiles)
    .where(eq(companyProfiles.email, session?.user?.email as string));
  if (!receiverId[0]) {
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
    .where(eq(campaignMessages?.receiverId, receiverId[0]?.receiverId));
  return response;
}

async function CompanyApplicants() {
  const data = await getData();

  return (
    <div className=" w-screen md:w-full mx-auto py-2">
      {data && <DataTable columns={columns} data={data} />}
    </div>
  );
}

export default CompanyApplicants;
