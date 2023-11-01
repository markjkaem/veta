"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import db from "../../../drizzle/db";
import { eq } from "drizzle-orm";
import { settingsaddress } from "../../../drizzle/schema";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const addressFormSchema = z.object({
  companyname: z
    .string()
    .min(2, {
      message: "Company name must be at least 2 characters.",
    })
    .max(30, {
      message: "Company name must not be longer than 30 characters.",
    }),
  street: z
    .string()
    .min(2, {
      message: "Street must be at least 2 characters.",
    })
    .max(30, {
      message: "Street must not be longer than 30 characters.",
    }),
  zipcode: z.string(),
  city: z.string(),
  country: z.string(),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

interface AddressData {
  id: number;
  companyname: string | null;
  street: string | null;
  zipcode: string | null;
  city: string | null;
  country: string | null;
  email: string | null;
}

export function AddressForm(props: { addressData: AddressData[] }) {
  const router = useRouter();
  const session = useSession();

  const addressData = props.addressData;
  console.log(addressData);

  const defaultValues: Partial<AddressFormValues> = {
    companyname: addressData[0]?.companyname!,
    street: addressData[0]?.street!,
    zipcode: addressData[0]?.zipcode!,
    city: addressData[0]?.city!,
    country: addressData[0]?.country!,
  };
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: AddressFormValues) {
    const addressRows = await db
      .select()
      .from(settingsaddress)
      .where(eq(settingsaddress.email, session.data?.user?.email as string));

    if (!addressRows[0]) {
      await db.insert(settingsaddress).values({
        companyname: data?.companyname!,
        street: data?.street!,
        zipcode: data?.zipcode!,
        city: data?.city!,
        country: data?.country!,
        email: session.data?.user?.email as string,
      });
      toast({
        title: "Your address was succesfully updated.",
      });
      router.push("/dashboard/settings/address");
    } else {
      await db
        .update(settingsaddress)
        .set({
          companyname: data?.companyname!,
          street: data?.street!,
          zipcode: data?.zipcode!,
          city: data?.city!,
          country: data?.country!,
        })
        .where(eq(settingsaddress.email, session.data?.user?.email as string));
      toast({
        title: "Your address was succesfully updated.",
      });
      router.push("/dashboard/settings/address");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="companyname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company name</FormLabel>
              <FormControl>
                <Input placeholder="Bank of America" {...field} />
              </FormControl>
              <FormDescription>This is your company name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street</FormLabel>
              <FormControl>
                <Input placeholder="Bridgestreet 22" {...field} />
              </FormControl>
              <FormDescription>This is your street and number.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zipcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zipcode</FormLabel>
              <FormControl>
                <Input placeholder="1111AM" {...field} />
              </FormControl>
              <FormDescription>This is your zipcode.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Amsterdam" {...field} />
              </FormControl>
              <FormDescription>This is your city.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <div></div>
        <Button type="submit">Update address</Button>
      </form>
    </Form>
  );
}
