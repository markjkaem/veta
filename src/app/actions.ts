"use server"

import { toast } from "@/components/ui/use-toast";
import db from "../../drizzle/db";
import { eq } from "drizzle-orm";
import { settingsaccounts, settingsaddress } from "../../drizzle/schema";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function accountAction(formData: FormData) {
  const session = await getServerSession()
    const firstname = formData.get("firstname")?.toString();
    const lastname = formData.get("lastname")?.toString();
    const gender = formData.get("gender")?.toString();
    const phone = formData.get("phone")?.toString();
    const vatnumber = formData.get("vatnumber")?.toString();
    const companyId = formData.get("companyId")?.toString();
   
    const accountRows = await db
      .select()
      .from(settingsaccounts)
      .where(eq(settingsaccounts.email, session?.user?.email as string));

    if (!accountRows[0]) {
      await db.insert(settingsaccounts).values({
        firstname: firstname,
        lastname: lastname,
        gender: gender,
        phone: phone,
        vatnumber: vatnumber,
        companyid: companyId,
        email: session?.user?.email as string,
      });
      toast({
        title: "Your account was succesfully updated.",
      });
      redirect("/dashboard/settings/account");
    } else {
      await db
        .update(settingsaccounts)
        .set({
          firstname: firstname!,
          lastname: lastname!,
          gender: gender,
          phone: phone!,
          vatnumber: vatnumber,
          companyid: companyId,
        })
        .where(eq(settingsaccounts.email, session?.user?.email as string));
      toast({
        title: "Your account was succesfully updated.",
      });
      redirect("/dashboard/settings/account");
    }
  }
  
  export async function addressAction(formData: FormData) {
    const session = await getServerSession()
    const companyname = formData.get("companyname")?.toString();
    const street = formData.get("street")?.toString();
    const zipcode = formData.get("zipcode")?.toString();
    const city = formData.get("city")?.toString();
    const country = formData.get("country")?.toString();
    
    const addressRows = await db
    .select()
    .from(settingsaddress)
    .where(eq(settingsaddress.email, session?.user?.email as string));

  if (!addressRows[0]) {
    await db.insert(settingsaddress).values({
      companyname: companyname!,
      street: street,
      zipcode: zipcode,
      city: city,
      country: country,
      email: session?.user?.email as string,
    });
    toast({
      title: "Your address was succesfully updated.",
    });
   redirect("/dashboard/settings/address");
  } else {
    await db
      .update(settingsaddress)
      .set({
        companyname: companyname,
        street: street,
        zipcode: zipcode,
        city: city,
        country: country,
      })
      .where(eq(settingsaddress.email, session?.user?.email as string));
    toast({
      title: "Your address was succesfully updated.",
    });
    redirect("/dashboard/settings/address");
  }
  }