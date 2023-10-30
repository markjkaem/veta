import Link from "next/link";
import React from "react";
import Image from "next/image";

function header() {
  return (
    <div>
      <div className="">
        <Link
          href="/"
          className="absolute gap-2 top-10 md:top-8 md:left-8 lg:left-16 flex items-baseline lef-2 decoration-none ml-4"
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
    </div>
  );
}

export default header;
