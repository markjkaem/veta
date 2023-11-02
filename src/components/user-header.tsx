"use client";
import { useSession } from "next-auth/react";
import React from "react";
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
