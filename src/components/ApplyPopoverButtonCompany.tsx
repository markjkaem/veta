import { Button } from "@/components/ui/button";
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

export function ApplyPopoverButtonCompany() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Apply</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 ml-8"></PopoverContent>
    </Popover>
  );
}
