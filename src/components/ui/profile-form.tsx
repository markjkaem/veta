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
import { profiles } from "../../../drizzle/schema";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { PutBlobResult, put } from "@vercel/blob";

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

interface ProfileData {
  id: string | null;
  email: string | null;
  categories: string | null;
  alias: string | null;
  url: string | null;
  bio: string | null;
  image: string | null;
}

export function ProfileForm(props: { profileData: ProfileData[] }) {
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
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
  const profileData = props.profileData;

  const selectedCategoriesString = profileData[0]?.categories!;

  useEffect(() => {
    const selectedCategories = selectedCategoriesString?.split(",");
    const updatedCategories = categories.map((category) => ({
      ...category,
      selected: selectedCategories?.includes(category.name),
    }));
    setCategories(updatedCategories);
  }, []);

  const defaultValues: Partial<ProfileFormValues> = {
    alias: profileData[0]?.alias!,
    bio: profileData[0]?.bio!,
    url: profileData[0]?.url!,
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
      .from(profiles)
      .where(eq(profiles.email, session.data?.user?.email as string));
    const isProfile = profilerows[0];

    const createCategoryString = (): string => {
      const selectedCategories = categories.filter((cat) => cat.selected);
      const makeString = selectedCategories.map((cat) => cat.name);
      const cateString = makeString.join();
      return cateString;
    };
    const categoryString = createCategoryString();

    // image blob upload
    if (!inputFileRef.current?.files) {
      // executed
      if (!isProfile) {
        await db.insert(profiles).values({
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
          .update(profiles)
          .set({
            alias: data.alias,
            bio: data.bio,
            url: data.url,
            categories: categoryString,
          })
          .where(eq(profiles.email, session.data?.user?.email as string));
        toast({
          title: "Your profile was succesfully updated.",
        });
        router.push("/dashboard/settings/profile");
      }
    } else {
      const file = inputFileRef.current.files[0];
      const newBlob = await createBlobFile(file);
      if (!isProfile) {
        await db.insert(profiles).values({
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
          .update(profiles)
          .set({
            alias: data.alias,
            bio: data.bio,
            url: data.url,
            image: newBlob.url,
            categories: categoryString,
          })
          .where(eq(profiles.email, session.data?.user?.email as string));
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
            <img
              className="h-40 w-40 object-cover"
              src={profileData[0]?.image!}
              alt=""
            />

            <input name="file" ref={inputFileRef} type="file" />
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alias</FormLabel>
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
                  <FormLabel>Bio</FormLabel>
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
