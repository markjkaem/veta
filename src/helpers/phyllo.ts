import { getServerSession } from "next-auth";
import { phyllo } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../../drizzle/db";

export const BASE_URL = "https://api.staging.getphyllo.com";
export const accountExternalIdEndpoint = `/v1/users/external_id/`;
export const accountIdEndpoint = `/v1/accounts/`;
export const getUserEndpoint = "/v1/users/";
export const usersEndpoint = `/v1/users`;
export const sdktokenEndpoint = `/v1/sdk-tokens`;
export const getAccountsEndpoint = `/v1/accounts`;

export const generateUuid = (): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };


  export const createBuffer = async (): Promise<string> => {
    const clientId = process.env.PHYLLO_ID;
    const clientSecret = process.env.PHYLLO_SECRET;
    const combined = `${clientId}:${clientSecret}`;
    const buffer = Buffer.from(combined);
    const base64data = buffer.toString("base64");
    return base64data;
  };
  
  export const getSocialAccountMain = async (email: string) => {
    const retrieveAccounts = async (
      BASE_URL: string,
      accountEndpoint: string,
      base64data: string
    ) => {
      const response = await fetch(`${BASE_URL}${accountEndpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${base64data}`,
        },
      });
      const data = await response.json();
      return data;
    };
  
    const retrieveAccount = async (
      BASE_URL: string,
      getUserEndpoint: string,
      accountIdEndpoint: string,
      base64data: string,
      phylloid: string
    ) => {
      const response = await fetch(`${BASE_URL}${getUserEndpoint}${phylloid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${base64data}`,
        },
      });
      const data = await response.json();
      if (!data) {
        throw new Error("No account found matching with account in database");
      }
  
      const responseUser = await fetch(
        `${BASE_URL}${getUserEndpoint}${data.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Basic ${base64data}`,
          },
        }
      );
      const dataUser = await responseUser.json();
      return dataUser;
    };
  
    const getSocialAccount = async (email: string) => {
      const userData = await db
        .select()
        .from(phyllo)
        .where(eq(phyllo.email, email as string));
  
      const phylloid = userData[0]?.phylloid;
      const base64data = await createBuffer();
  
      if (phylloid) {
        const account = await retrieveAccount(
          BASE_URL,
          getUserEndpoint,
          accountIdEndpoint,
          base64data,
          phylloid
        );
        return account;
      }
    };
    const session = await getServerSession();
    const account = await getSocialAccount(email);
  
    const base64data = await createBuffer();
  
    const accounts: any = await retrieveAccounts(
      BASE_URL,
      getAccountsEndpoint,
      base64data
    );
    const correctAccount = accounts?.data?.filter(
      (item: any) => item.user.id === account?.id
    );
  
    return correctAccount;
  };