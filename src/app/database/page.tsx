import React from "react";
import db from "../../../drizzle/db";
import { profiles } from "@/../drizzle/schema";

const getData = async () => {
  const data = await db.select().from(profiles);
  console.log(data);
  return data;
};
async function Page() {
  await getData();
  return <div></div>;
}

export default Page;
