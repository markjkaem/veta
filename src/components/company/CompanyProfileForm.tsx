"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { companyProfiles } from "../../../drizzle/schema";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { PutBlobResult, put } from "@vercel/blob";
import Image from "next/image";

const profileFormSchema = z.object({
  alias: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  bio: z.string().max(160).min(4),
  url: z.string().url({ message: "Please enter a valid URL." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface CompanyData {
  id: string;
  alias: string | null;
  url: string | null;
  email: string | null;
  bio: string | null;
  categories: string | null;
  countries: string | null;
  genders: string | null;
  image: string | null;
}

export function CompanyProfileForm(props: { companyData: CompanyData[] }) {
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const session = useSession();
  const [categories, setCategories] = useState([
    { name: "Lifestyle", selected: false },
    { name: "Travel", selected: false },
    { name: "Beauty", selected: false },
    { name: "Fashion", selected: false },
    { name: "Entertainment", selected: false },
    { name: "Food", selected: false },
    { name: "Art & Culture", selected: false },
    { name: "Music", selected: false },
    { name: "Gaming", selected: false },
  ]);
  const companyData = props.companyData;

  const selectedCategoriesString = companyData[0]?.categories!;

  useEffect(() => {
    const selectedCategories = selectedCategoriesString?.split(",");
    const updatedCategories = categories.map((category) => ({
      ...category,
      selected: selectedCategories?.includes(category.name),
    }));
    setCategories(updatedCategories);
  }, []);

  const defaultValues: Partial<ProfileFormValues> = {
    alias: companyData[0]?.alias ?? undefined,
    bio: companyData[0]?.bio ?? undefined,
    url: companyData[0]?.url ?? undefined,
  };
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const createBlobFile = async (file: File) => {
    const response = await fetch(`/api/avatar/upload?filename=${file.name}`, {
      method: "POST",
      body: file,
    });

    const newBlob = (await response.json()) as PutBlobResult;
    return newBlob;
  };

  async function onSubmit(data: ProfileFormValues) {
    const profilerows = await db
      .select()
      .from(companyProfiles)
      .where(eq(companyProfiles.email, session.data?.user?.email as string));
    const isProfile = profilerows[0];

    const createCategoryString = (): string => {
      const selectedCategories = categories.filter((cat) => cat.selected);
      const makeString = selectedCategories.map((cat) => cat.name);
      const cateString = makeString.join();
      return cateString;
    };
    const categoryString = createCategoryString();
    if (!inputFileRef?.current?.files![0]?.name) {
      console.log("no file found");
      if (!isProfile) {
        await db.insert(companyProfiles).values({
          alias: data.alias,
          bio: data.bio,
          url: data.url,
          email: session.data?.user?.email as string,
          categories: categoryString,
        });
        toast({
          title: "Your profile was succesfully updated.",
        });
        router.push("/dashboard/settings/profile");
      } else {
        await db
          .update(companyProfiles)
          .set({
            alias: data.alias,
            bio: data.bio,
            url: data.url,
            categories: categoryString,
          })
          .where(
            eq(companyProfiles.email, session.data?.user?.email as string)
          );
        toast({
          title: "Your profile was succesfully updated.",
        });
        router.push("/dashboard/settings/profile");
      }
    } else {
      console.log("file found");
      const file = inputFileRef.current.files[0];
      const newBlob = await createBlobFile(file);
      if (!isProfile) {
        await db.insert(companyProfiles).values({
          alias: data.alias,
          bio: data.bio,
          url: data.url,
          image: newBlob.url,
          email: session.data?.user?.email as string,
          categories: categoryString,
        });
        toast({
          title: "Your profile was succesfully updated.",
        });
        router.push("/dashboard/settings/profile");
      } else {
        await db
          .update(companyProfiles)
          .set({
            alias: data.alias,
            bio: data.bio,
            url: data.url,
            image: newBlob.url,
            categories: categoryString,
          })
          .where(
            eq(companyProfiles.email, session.data?.user?.email as string)
          );
        toast({
          title: "Your profile was succesfully updated.",
        });
        router.push("/dashboard/settings/profile");
      }
    }
  }

  return (
    <div>
      <div className="space-y-2 mt-4 md:w-8/12 w-11/12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {companyData[0]?.image && (
              <Image
                className="h-40 w-40 object-cover"
                src={companyData[0]?.image!}
                alt={companyData[0]?.alias! as string}
                width={400}
                height={400}
              />
            )}

            <input name="file" ref={inputFileRef} type="file" />
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input placeholder="Davinci11" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can be your real name
                    or a pseudonym.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="">
              <span className="text-sm font-medium">Categories</span>
            </div>
            <div className=" grid lg:grid-cols-3 md:gap-6 grid-cols-2 gap-6">
              {categories.map((category, index) => {
                return (
                  <div key={index}>
                    {!category.selected ? (
                      <span
                        onClick={() => {
                          const updatedCategories = [...categories]; // Create a copy of the categories array
                          updatedCategories[index].selected = true; // Update the selected property
                          setCategories(updatedCategories); // Set the new state
                        }}
                        className="py-2 px-1 cursor-pointer bg-gray-800 rounded-sm  text-white font-bold font-inter"
                      >
                        {category.name}
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          const updatedCategories = [...categories]; // Create a copy of the categories array
                          updatedCategories[index].selected = false; // Update the selected property
                          setCategories(updatedCategories); // Set the new state
                        }}
                        className="py-2 px-1 cursor-pointer bg-[#F472B6] rounded-sm  text-white font-bold font-inter"
                      >
                        {category.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can <span>@mention</span> other users and organizations
                    to link to them.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url</FormLabel>
                  <FormControl>
                    <Input placeholder="https://url.com" {...field} />
                  </FormControl>
                  <FormDescription>This your public url.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div></div>
            <Button type="submit">Update profile</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
