"use client"

import React from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
import { useRouter } from 'next/navigation'

const handleDelete = async (id: string) => {
  
    console.log("exec")
    await fetch(`/api/listings/delete`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(id),
      });
      toast({
        title: "Your listing was succesfully deleted.",
       
      })
}

function DetailsDropdown({id}: {id: string}) {
  const router = useRouter();
  return (
    <DropdownMenu >
    <DropdownMenuTrigger>
      <HamburgerMenuIcon className="z-40 cursor-pointer text-gray-400 h-6 w-6 hover:text-gray-500 " />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Details</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleDelete(id).then(() => router.refresh())}>Delete</DropdownMenuItem>

    </DropdownMenuContent>
  </DropdownMenu>
  )
}

export default DetailsDropdown