import Link from "next/link";
import React from "react";
import Image from "next/image";
import { ToggleMode } from "./togglemode";

function header() {
  return (
    <div className="flex w-screen items-center justify-between">
      <div className="">
        <Link
          href="/"
          className="absolute gap-2 top-10 md:top-8 md:left-8 lg:left-16 flex items-baseline left-2 decoration-none ml-4"
        >
          <Image
            className="h-8 w-auto invert"
            src="/veta-template.jpg"
            alt="veta-logo"
            width={100}
            height={100}
          />
        </Link>
      </div>
      <div className="absolute gap-2 top-10 md:top-8 md:right-8 lg:right-16 flex items-baseline right-2 decoration-none ml-4">
        <ToggleMode />
      </div>
    </div>
  );
}

export default header;
