import React from "react";
import db from "../../../drizzle/db";
import { accounts, sessions, users } from "../../../drizzle/schema";

const getData = async () => {
  const data = await db.select().from(users);
  return data;
};
async function page() {
  const data = await getData();
  return (
    <div className="flex flex-col">
      {data.map((item, id) => {
        return <div key={id}>{item.email}</div>;
      })}
    </div>
  );
}

export default page;
