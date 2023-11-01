import React from "react";
import TeamSwitcher from "./ui/team-switcher";
import { MainNav } from "./ui/main-nav";
import { Search } from "./ui/search";
import { UserNav } from "./ui/user-nav";

function DashboardHeader() {
  return (
    <div>
      {" "}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <TeamSwitcher />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
