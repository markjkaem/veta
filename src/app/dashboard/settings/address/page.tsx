import { Separator } from "@/components/ui/separator";
import db from "../../../../../drizzle/db";
import { settingsaddress } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { AddressForm } from "@/components/ui/address-form";

export default async function SettingsAddresssPage() {
  const session = await getServerSession();
  // This can come from your database or API.
  const addressData = await db
    .select()
    .from(settingsaddress)
    .where(eq(settingsaddress.email, session?.user?.email as string));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Address</h3>
        <p className="text-sm text-muted-foreground">
          This is private information.
        </p>
      </div>
      <Separator />
      <AddressForm addressData={addressData} />
    </div>
  );
}
