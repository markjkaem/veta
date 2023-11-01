"use client";
import React from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

function SignOut() {
  return (
    <>
      {" "}
      <span onClick={() => signOut()}>Sign out</span>
    </>
  );
}

export default SignOut;
