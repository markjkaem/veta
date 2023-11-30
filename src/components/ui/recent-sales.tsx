import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { StringDecoder } from "string_decoder";
import { Button } from "./button";

interface Applicants {
  id: string | null;
  alias: string | null;
  email: string | null;
  image: string | null;
  campaignId?: string | null;
}

export function RecentSales({
  users,
  link,
}: {
  users: Applicants[];
  link: string;
}) {
  return (
    <div className="space-y-8">
      {users?.map((item, i) => {
        return (
          <div key={i} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarImage src={item?.image as string} alt="Avatar" />
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{item?.alias}</p>
              <p className="text-sm text-muted-foreground">{item?.email}</p>
            </div>
            <div className="ml-auto font-medium">
              <Link href={`${link}${item?.campaignId}`}>
                <Button variant={"outline"}>View</Button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
