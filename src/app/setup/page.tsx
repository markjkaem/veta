"use client";

import * as React from "react";
import Stripe from "stripe";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import db from "../../../drizzle/db";
import { eq } from "drizzle-orm";
import { influencerProfiles, users } from "../../../drizzle/schema";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const accountFormSchema = z.object({
  type: z.string(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

type Role = "influencer" | "company" | null;

export default function AccountForm() {
  const router = useRouter();
  const session = useSession();

  const defaultValues: Partial<AccountFormValues> = {
    type: "influencer",
  };
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: AccountFormValues) {
    const stripe = new Stripe(
      "***REMOVED***",
      {
        apiVersion: "2023-10-16",
      }
    );

    //create the role for the user
    await db
      .update(users)
      .set({
        role: data?.type as Role,
      })
      .where(eq(users.email, session.data?.user?.email as string));

    //  Create stripe account
    const response = await db
      .select({ stripe_id: users?.stripe_id })
      .from(users)
      .where(eq(users.email, session.data?.user?.email as string));

    let customer;

    if (!response[0]?.stripe_id?.includes("cus")) {
      customer = await stripe.customers.create({
        email: session.data?.user?.email as string,
      });
      await db
        .update(users)
        .set({ stripe_id: customer.id })
        .where(eq(users.email, session.data?.user?.email as string));
    } else {
      customer = { id: response[0]?.stripe_id };
    }
    toast({
      title: "Your account was succesfully created.",
    });
    router.push("/dashboard");
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Hi, welcome</CardTitle>
          <CardDescription>
            Please select the type of account you want to create.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="influencer">Influencer</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* <FormDescription></FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div></div>
              <Button variant={"outline"} type="submit">
                Continue
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
