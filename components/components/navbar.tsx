"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

export const Navbar = () => {
  const user = useAuth();

  function formatPathName(): string {
    const pathname = usePathname();

    if (!pathname) return "Overview";

    const splitRoute = pathname.split("/");
    const lastIndex = splitRoute.length - 1 > 2 ? 2 : splitRoute.length - 1;

    const pathName = splitRoute[lastIndex];

    const formattedPath = pathName.replace(/-/g, " ");

    return formattedPath;
  }

  const path = formatPathName();

  return (
    <div className="p-5 flex justify-between bg-white">
      <h1 className="text-xl font-medium text-gray-500 capitalize">
        {path || "Overview"}
      </h1>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell />
          <p className="absolute -top-3 right-1 size-4 bg-red-600 text-white rounded-full text-[10px] text-center">
            2
          </p>
        </div>

        {user?.userId && <UserButton />}
      </div>
    </div>
  );
};
