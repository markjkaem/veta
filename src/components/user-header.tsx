"use client";
import { useSession, signOut } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

function UserHeader() {
  const session = useSession();

  return (
    <div>
      {session.data?.user?.email && (
        <Link className="underline" href={"/dashboard"}>
          My dashboard
        </Link>
      )}
    </div>
  );
}

export default UserHeader;
