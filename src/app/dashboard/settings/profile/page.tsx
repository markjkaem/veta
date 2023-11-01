import { Separator } from "@/components/ui/separator";
import db from "../../../../../drizzle/db";
import { profiles } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { ProfileForm } from "@/components/ui/profile-form";

export default async function SettingsAddresssPage() {
  const session = await getServerSession();
  // This can come from your database or API.
  const profileData = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, session?.user?.email as string));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is information that can be seen by other users.
        </p>
      </div>
      <Separator />
      <ProfileForm profileData={profileData} />
    </div>
  );
}
