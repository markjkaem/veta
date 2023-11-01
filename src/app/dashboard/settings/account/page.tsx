import { Separator } from "@/components/ui/separator";
import db from "../../../../../drizzle/db";
import { settingsaccounts } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { AccountForm } from "@/components/ui/account-form";

export default async function SettingsAccountPage() {
  const session = await getServerSession();
  // This can come from your database or API.
  const accountData = await db
    .select()
    .from(settingsaccounts)
    .where(eq(settingsaccounts.email, session?.user?.email as string));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          This is private information.
        </p>
      </div>
      <Separator />
      <AccountForm accountData={accountData} />
    </div>
  );
}
