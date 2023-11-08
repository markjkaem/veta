"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Applicant = {
  id: string;
  alias: string | null;
  image: string | null;
  senderId: string | null;
  receiverId: string | null;
  message: string | null;
  campaignId: string | null;
  listingId: string | null;
  listingDescription: string | null;
  listingTitle: string | null;
  receiverImage: string | null;
};

export const columns: ColumnDef<Applicant>[] = [
  {
    accessorKey: "alias",
    header: "Alias",
  },
];
