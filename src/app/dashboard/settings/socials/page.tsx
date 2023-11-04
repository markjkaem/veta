import { Separator } from "@/components/ui/separator";
import { SocialsCart } from "@/components/socials-cart";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsSocialsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Socials</h3>
        <p className="text-sm text-muted-foreground">
          Add some socials to your profile, to attract more companies to your
          account.
        </p>
      </div>
      <Separator />
      <Suspense
        fallback={
          <div className="flex flex-col gap-2">
            <Skeleton className="w-[500px] h-[40px] rounded-md" />
            <Skeleton className="w-[500px] h-[40px] rounded-md" />
            <Skeleton className="w-[500px] h-[40px] rounded-md" />
            <Skeleton className="w-[500px] h-[20px] rounded-md" />
            <Skeleton className="w-[500px] h-[20px] rounded-md" />
          </div>
        }
      >
        <SocialsCart />
      </Suspense>
    </div>
  );
}
