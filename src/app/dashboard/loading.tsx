"use client";

import Image from "next/image";
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <>
      <div className="h-screen w-screen items-center flex justify-center">
        {" "}
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            className="animate-pulse invert mb-6"
            src="/veta-template.jpg"
            alt="veta"
            width={50}
            height={50}
          />
        </div>
      </div>
    </>
  );
}
