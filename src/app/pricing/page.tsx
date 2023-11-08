import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="h-screen w-screen items-center flex justify-center">
      <div className="mt-6 space-y-8 sm:gap-6 lg:space-y-0 xl:gap-4">
        <div className="mx-auto flex max-w-lg flex-col rounded-lg border border-slate-600 bg-slate-900  p-6 text-center text-white shadow transition   xl:p-8">
          <h3 className="mb-4 text-2xl font-semibold">Premium</h3>
          <p className="font-light text-slate-400 sm:text-lg">
            Get acces to our platform
          </p>
          <div className="my-8 flex items-baseline justify-center">
            <span className="mr-2 text-5xl font-extrabold">$29</span>
            <span className="text-slate-400">/month</span>
          </div>

          <ul role="list" className="mb-8 space-y-4 text-left">
            <li className="flex items-center space-x-3">
              <svg
                className="h-5 w-5 flex-shrink-0 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span>Acces to the dashboard</span>
            </li>
            <li className="flex items-center space-x-3">
              <svg
                className="h-5 w-5 flex-shrink-0 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span>Unlimited campaign creations</span>
            </li>
            <li className="flex items-center space-x-3">
              <svg
                className="h-5 w-5 flex-shrink-0 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span>Auto renew on</span>
            </li>
          </ul>
          <Link
            href="/payment?id=price_1OA0FlJ0Tu9paWkWv8iNbHFT"
            className="bg-slate-600 hover:bg-slate-700 focus:ring-primary-900 rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white transition  focus:ring-4"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default page;
