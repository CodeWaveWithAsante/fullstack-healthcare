"use client";

import { isNumber } from "@/utils";
import { usePathname } from "next/navigation";
import React from "react";

export const GetLabel = () => {
  const formatPathname = () => {
    const pathname = usePathname();

    if (!pathname) return "Overview";

    const splitRoute = pathname.split("/");
    const lastIndex = splitRoute.length - 1 > 2 ? 2 : splitRoute.length - 1;

    const pathName = splitRoute[lastIndex];

    const formattedPath = pathName?.replace(/-/g, " ");

    return isNumber(formattedPath) ? "" : formattedPath;
  };

  const path = formatPathname();
  return (
    <h1 className="text-xl font-medium text-gray-500 capitalize">
      {path ?? "Overview"}
    </h1>
  );
};
