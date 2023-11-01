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
import { settingsaccounts } from "../../../drizzle/schema";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const accountFormSchema = z.object({
  firstname: z
    .string()
    .min(2, {
      message: "Firstname must be at least 2 characters.",
    })
    .max(30, {
      message: "Firstname must not be longer than 30 characters.",
    }),
  lastname: z
    .string()
    .min(2, {
      message: "Lastname must be at least 2 characters.",
    })
    .max(30, {
      message: "Lastname must not be longer than 30 characters.",
    }),
  gender: z.string(),
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
  vatnumber: z
    .string()
    .max(20, {
      message: "Vatnumber must not be longer than 20 characters.",
    })
    .min(6, {
      message: "Lastname must be at least 6 characters.",
    }),
  companyId: z
    .string()
    .max(20, {
      message: "Vatnumber must not be longer than 20 characters.",
    })
    .min(6, {
      message: "Lastname must be at least 6 characters.",
    }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface AccountData {
  id: number;
  firstname: string | null;
  lastname: string | null;
  gender: string | null;
  phone: string | null;
  vatnumber: string | null;
  companyid: string | null;
  email: string | null;
}

export function AccountForm(props: { accountData: AccountData[] }) {
  const router = useRouter();
  const session = useSession();

  const accountData = props.accountData;
  console.log(accountData);

  const defaultValues: Partial<AccountFormValues> = {
    firstname: accountData[0]?.firstname!,
    lastname: accountData[0]?.lastname!,
    gender: accountData[0]?.gender!,
    phone: accountData[0]?.phone!,
    vatnumber: accountData[0]?.vatnumber!,
    companyId: accountData[0]?.companyid!,
  };
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: AccountFormValues) {
    const accountRows = await db
      .select()
      .from(settingsaccounts)
      .where(eq(settingsaccounts.email, session.data?.user?.email as string));

    if (!accountRows[0]) {
      await db.insert(settingsaccounts).values({
        firstname: data?.firstname!,
        lastname: data?.lastname!,
        gender: data?.gender!,
        phone: data?.phone!,
        vatnumber: data?.vatnumber!,
        companyid: data?.companyId!,
        email: session.data?.user?.email as string,
      });
      toast({
        title: "Your account was succesfully updated.",
      });
      router.push("/dashboard/settings/account");
    } else {
      await db
        .update(settingsaccounts)
        .set({
          firstname: data?.firstname!,
          lastname: data?.lastname!,
          gender: data?.gender!,
          phone: data?.phone!,
          vatnumber: data?.vatnumber!,
          companyid: data?.companyId!,
        })
        .where(eq(settingsaccounts.email, session.data?.user?.email as string));
      toast({
        title: "Your account was succesfully updated.",
      });
      router.push("/dashboard/settings/account");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firstname</FormLabel>
              <FormControl>
                <Input placeholder="Davici" {...field} />
              </FormControl>
              <FormDescription>This is your firstname.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lastname</FormLabel>
              <FormControl>
                <Input placeholder="Musk" {...field} />
              </FormControl>
              <FormDescription>This is your lastname.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a gender to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="woman">Woman</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                For more information, we provided additional
                <Link href="/examples/forms">info</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>This is your phone number.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vatnumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vatnumber</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>This is your vatnumber.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>This is your company number.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div></div>
        <Button type="submit">Update account</Button>
      </form>
    </Form>
  );
}
