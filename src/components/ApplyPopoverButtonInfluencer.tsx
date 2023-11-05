import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import db from "../../drizzle/db";
import { campaignMessages, campaigns } from "../../drizzle/schema";
import { revalidatePath } from "next/cache";
import { redirect, useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const onSubmit = async (formData: FormData) => {
  "use server";
  const listingId = formData.get("listingsId")?.toString();
  const companyId = formData.get("companyId")?.toString();
  const influencerId = formData.get("influencerId")?.toString();
  const message = formData.get("message")?.toString();

  const campaign = await db
    .insert(campaigns)
    .values({
      listingId: listingId,
      companyId: companyId,
      influencerId: influencerId,
    })
    .returning();

  if (!campaign) {
    throw new Error("campaign could not be created");
  }
  await db.insert(campaignMessages).values({
    campaignId: campaign[0].id,
    message: message,
    senderId: influencerId,
    receiverId: companyId,
  });
  redirect("/dashboard/marketplace");
};

export function ApplyPopoverButtonInfluencer({
  listingsId,
  companyId,
  influencerId,
}: {
  listingsId: string;
  companyId: string;
  influencerId: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Apply</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form action={onSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Write a short motivation</AlertDialogTitle>
            <AlertDialogDescription>
              <Textarea
                value={companyId}
                name="companyId"
                className="mb-4 hidden"
              />
              <Textarea
                value={listingsId}
                name="listingsId"
                className="mb-4 hidden"
              />
              <Textarea
                value={influencerId}
                name="influencerId"
                className="mb-4 hidden"
              />
              <Textarea
                name="message"
                className="mb-4 h-56"
                placeholder="I am interested to join your campaign because i love sushi..."
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <Button type="submit">Apply</Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
