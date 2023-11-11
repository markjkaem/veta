import { ChevronDownIcon } from "@radix-ui/react-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerSession } from "next-auth";
import {
  BASE_URL,
  accountIdEndpoint,
  createBuffer,
  generateUuid,
  getAccountsEndpoint,
  getSocialAccountMain,
  getUserEndpoint,
  sdktokenEndpoint,
  usersEndpoint,
} from "@/helpers/phyllo";
import db from "../../drizzle/db";
import { phyllo } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import Head from "next/head";
import Script from "next/script";
import PhylloConnect from "./phylloconnect";
import PhylloConnectIt from "./phylloconnect";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";

const createSocials = async () => {
  "use server";

  const createPhylloUser = async (
    BASE_URL: string,
    usersEndpoint: string,
    base64data: String,
    email: string
  ) => {
    const uuid = generateUuid();

    const responseUser = await fetch(`${BASE_URL}${usersEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${base64data}`,
      },
      body: `{"name": "${email}","external_id":"${uuid}"}`,
    });
    const data = await responseUser.json();
    return data;
  };

  const session = await getServerSession();
  const email = session?.user?.email;

  const user = await db
    .select()
    .from(phyllo)
    .where(eq(phyllo.email, session?.user?.email as string));
  const isPhylloId = user[0];

  if (isPhylloId) {
    throw new Error("User is already in database");
  }

  const base64data = await createBuffer();

  const createdUser = await createPhylloUser(
    BASE_URL,
    usersEndpoint,
    base64data,
    email as string
  );

  if (!createdUser) {
    throw new Error("User was not created");
  }

  await db.insert(phyllo).values({
    phylloid: createdUser.id,
    email: session?.user?.email as string,
  });
  revalidatePath("/dashboard/settings/socials");
};

const editSocials = async () => {
  const generateSDK = async () => {
    const session = await getServerSession();

    const connectUser = async (
      BASE_URL: string,
      getUserEndpoint: string,
      id: string,
      base64data: string
    ) => {
      const response = await fetch(`${BASE_URL}${getUserEndpoint}${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${base64data}`,
        },
      });
      const data = await response.json();
      return data;
    };

    const generatePhylloSDK = async (
      BASE_URL: string,
      sdktokenEndpoint: string,
      base64data: string,
      responseUser: { id: string }
    ) => {
      const response = await fetch(`${BASE_URL}${sdktokenEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${base64data}`,
        },
        body: `{"user_id":"${responseUser.id}","products":["IDENTITY","IDENTITY.AUDIENCE","ENGAGEMENT","ENGAGEMENT.AUDIENCE","INCOME","PUBLISH.CONTENT","ACTIVITY"]}`,
      });
      const data = await response.json();
      return data;
    };

    const user = await db
      .select()
      .from(phyllo)
      .where(eq(phyllo.email, session?.user?.email as string));

    const phylloid = user[0]?.phylloid;

    const base64data = await createBuffer();
    const connectedUser = await connectUser(
      BASE_URL,
      getUserEndpoint,
      phylloid as string,
      base64data
    );

    const responseSDK = await generatePhylloSDK(
      BASE_URL,
      sdktokenEndpoint,
      base64data,
      connectedUser as { id: string }
    );
    return { responseSDK: responseSDK, user: connectedUser };
  };
  const { responseSDK, user } = await generateSDK();
  return { responseSDK, user };
};

const checkUserPhylloIdStatus = async () => {
  const session = await getServerSession();
  const user = await db
    .select()
    .from(phyllo)
    .where(eq(phyllo.email, session?.user?.email as string));
  const isPhylloId = user[0];
  return isPhylloId;
};

export async function SocialsCart() {
  const session = await getServerSession();
  const promises = [checkUserPhylloIdStatus(),
    editSocials(),
    getSocialAccountMain(
      session?.user?.email as string
    )]
  const [isPhylloId, { responseSDK, user }, socialAccountData ] = await Promise.all(promises);
  return (
    <div>
      {!isPhylloId ? (
        <form action={createSocials}>
          <Button className="ml-auto mb-4">Add new </Button>
        </form>
      ) : (
        <PhylloConnectIt responseSDK={responseSDK} user={user} />
      )}
      <Card>
        <CardHeader>
          <CardTitle>Your socials</CardTitle>
          <CardDescription>Add socials to update your profile.</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          {socialAccountData?.map((platform: any, i: number) => {
            return (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={platform?.profile_pic_url} />
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {platform.work_platform.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {platform.platform_username}
                    </p>
                  </div>
                </div>
                <span className="text-green-800 ml-4 bg-green-300 px-2 h-5 text-xs rounded-sm">
                  {platform.status && "Active"}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
