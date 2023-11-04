import React from "react";
import TeamSwitcher from "./ui/team-switcher";
import { MainNav } from "./ui/main-nav";
import { Search } from "./ui/search";
import { UserNav } from "./ui/user-nav";
import db from "../../drizzle/db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

const getRole = async () => {
  const session = await getServerSession();
  const role = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.email, session?.user?.email as string));
  return role[0].role;
};
async function DashboardHeader() {
  const role = await getRole();

  return (
    <div>
      {" "}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="md:flex hidden">
            {" "}
            <TeamSwitcher />
          </div>
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <div className="hidden md:flex">
              <Search />
            </div>
            <UserNav role={role} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
