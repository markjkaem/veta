import { Separator } from "@/components/ui/separator";
import { AppearanceForm } from "@/components/appearance-form";
import { SocialsCart } from "@/components/socials-cart";

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
      <SocialsCart />
    </div>
  );
}
