import Link from "next/link";
import React from "react";
import Image from "next/image";

function hero() {
  return (
    <div className="flex items-center justify-center h-screen p-4">
      <div className="flex flex-col items-center">
        <Link
          href="/"
          className="gap-2 flex items-baseline decoration-none ml-4"
        >
          <Image
            className="h-16 w-auto invert"
            src="/veta-template.jpg"
            width={100}
            height={100}
            alt="veta-logo"
          />
        </Link>
        <h1 className="font-switzer font-bold md:text-4xl text-xl">
          Find your partner in music
        </h1>
        <span className="md:text-md text-sm text-center md:w-96">
          Connect with influencers or businesses to begin your journey. You can
          start today, sign up below.
        </span>

        <div className="flex gap-6 mt-4">
          <Link
            className="bg-pink-400 text-white rounded-sm py-3 px-5 no-underline hover:bg-pink-500 transition"
            href="/sign-up"
          >
            Sign Up
          </Link>
          <Link
            className="bg-black text-white rounded-sm py-3 px-5 no-underline  transition"
            href="/#services"
          >
            More information
          </Link>
        </div>
      </div>
    </div>
  );
}

export default hero;
