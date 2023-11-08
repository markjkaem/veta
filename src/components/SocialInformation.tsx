import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getSocialAccountMain } from "@/helpers/phyllo";
import db from "../../drizzle/db";
import { influencerProfiles } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const getInfluencerEmail = async (slug: string) => {
  const response = await db
    .select({ email: influencerProfiles.email })
    .from(influencerProfiles)
    .where(eq(influencerProfiles.id, slug));
  return response[0].email;
};
export async function SocialInformation({ slug }: { slug: string }) {
  const email = await getInfluencerEmail(slug);
  const socialAccountData = await getSocialAccountMain(email as string);
  return (
    <Card className="md:w-3/6 w-full ">
      <CardHeader className="pb-3">
        <CardTitle>Socials</CardTitle>
        <CardDescription>Take a look at my socials</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {socialAccountData?.map((platform: any, i: number) => {
          return (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={platform?.profile_pic_url} />
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {platform.work_platform.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {platform.platform_username}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
