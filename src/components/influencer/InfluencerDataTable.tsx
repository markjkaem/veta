"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function InfluencerDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="rounded-md border overflow-x-scroll scrollbar-hide">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableHead className="w-20">Company</TableHead>
              {headerGroup.headers.map((header) => {
                return (
                  <>
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  </>
                );
              })}
              <TableHead className="w-20">Campaign</TableHead>
              <TableHead className="w-20">Message</TableHead>
              <TableHead className="w-20">Status</TableHead>
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  <TableCell>
                    <Image
                      /* @ts-ignore */
                      src={row.original.image}
                      alt=""
                      className="rounded-full md:w-10 md:h-10 w-10 h-10"
                      width={200}
                      height={200}
                    />
                  </TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Link
                          /* @ts-ignore */
                          href={`/dashboard/campaigns/listings/${row.original.listingId}`}
                          className="font-semibold hover:underline hover:cursor-pointer"
                        >
                          Info
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-96">
                        <Link
                          /* @ts-ignore */
                          href={`/dashboard/campaigns/listings/${row.original.listingId}`}
                        >
                          <div className="flex gap-2 ">
                            {" "}
                            <Image
                              /* @ts-ignore */
                              src={row.original.image}
                              alt=""
                              className="rounded-full m-2 md:w-10 md:h-10 w-10 h-10"
                              width={200}
                              height={200}
                            />
                            <h2 className="font-bold">
                              {/* @ts-ignore */}
                              {row.original.listingTitle}
                            </h2>
                          </div>
                          <p className="px-2">
                            {" "}
                            {/* @ts-ignore */}
                            {row.original.listingDescription}
                          </p>
                          <Button className="mt-4" variant={"outline"}>
                            Go to page
                          </Button>
                        </Link>
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>

                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">View</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            <div className="flex gap-2 items-center ">
                              {" "}
                              <Image
                                /* @ts-ignore */
                                src={row.original.image}
                                alt=""
                                className="rounded-full m-2 md:w-10 md:h-10 w-10 h-10"
                                width={200}
                                height={200}
                              />
                              <span>
                                {/* @ts-ignore */}
                                {row.original.alias}
                              </span>
                            </div>
                            <div className="py-6 font-normal text-sm">
                              <span className="font-semibold">Motivation</span>
                              {/* @ts-ignore */}
                              <p>{row.original.message}</p>
                            </div>
                          </AlertDialogTitle>
                          <AlertDialogDescription></AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Back</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                  <TableCell>Pending</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
