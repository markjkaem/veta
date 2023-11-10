"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { listings, listingsTasks } from "../../../drizzle/schema";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PutBlobResult } from "@vercel/blob";
import { useRef } from "react";

const profileFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(50, {
      message: "Title must not be longer than 50 characters.",
    }),
  description: z.string().max(160).min(4),
  briefing: z.string().max(1000).min(4),
  tasks: z.array(
    z.object({
      platform: z.string(),
      description: z.string().max(1000).min(4),
    })
  ),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function CompanyListingForm() {
  const router = useRouter();
  const session = useSession();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const defaultValues: Partial<ProfileFormValues> = {
    title: "",
    description: "",
    briefing: "",
    tasks: [{ platform: "tiktok", description: "" }],
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
  
  const { fields, append } = useFieldArray({
    name: "tasks",
    control: form.control,
  });

  async function onSubmit(data: ProfileFormValues) {
    if(!inputFileRef?.current?.files){
      throw new Error("No file was seleced")
    }

    const file = inputFileRef.current.files[0];
    const newBlob = await createBlobFile(file);
    const listing = await db
      .insert(listings)
      .values({
        title: data.title,
        description: data.description,
        briefing: data.briefing,
        email: session.data?.user?.email as string,
        banner: newBlob.url as string
      })
      .returning();

    if (!listing[0]) {
      throw new Error("the listing was not created");
    }

    for (let i = 0; i < data.tasks.length; i++) {
      await db.insert(listingsTasks).values({
        listingId: listing[0].id,
        description: data.tasks[i].description,
        platform: data.tasks[i].platform as any,
      });
    }
    toast({
      title: "Your listing was succesfully created.",
    });
    router.push("/dashboard/campaigns");
  }

  return (
    <div>
      <div className="space-y-2 mt-4 md:w-8/12 w-11/12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
       
          <input name="file" ref={inputFileRef} type="file" />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="This is my campaign title" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can be your real name
                    or a pseudonym.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Info</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell influencers a little bit about your company"
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
              name="briefing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Briefing</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell influencers more about your campaign"
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
            {fields.map((field, index) => (
              <div className="gap-2 flex flex-col" key={field.id}>
                <FormField
                  control={form.control}
                  name={`tasks.${index}.platform`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        Add Tasks
                      </FormLabel>

                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a platform for this task" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tiktok">Tiktok</SelectItem>
                            <SelectItem value="instagram">
                              Instragram
                            </SelectItem>
                            <SelectItem value="x">X</SelectItem>
                            <SelectItem value="twitch">Twitch</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="substack">Substack</SelectItem>
                            <SelectItem value="instagramlite">
                              Instagram Lite
                            </SelectItem>
                            <SelectItem value="adsense">Adsense</SelectItem>
                            <SelectItem value="spotify">Spotify</SelectItem>
                            <SelectItem value="linkedin">Linkedin</SelectItem>
                            <SelectItem value="beehiiv">Beehiiv</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`tasks.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="What is this task about.."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ description: "", platform: "tiktok" })}
            >
              Add Task
            </Button>
            <div></div>
            <Button type="submit">Update profile</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
