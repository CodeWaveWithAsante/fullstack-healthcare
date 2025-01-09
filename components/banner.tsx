"use client";

import { Theme, useTheme } from "@/hooks/theme-provider";
import Image from "next/image";

export const Banner1 = () => {
  const ISSERVER = typeof window === "undefined";

  const theme = (!ISSERVER ? localStorage.getItem("theme") : "system") as Theme;

  return (
    <div className="flex items-center justify-center md:pb-20">
      <Image
        src={theme !== "light" ? "/list-dark.png" : "/list.png"}
        width={1000}
        height={850}
        alt="Banner2"
        quality={100}
        priority
        className="rounded-3xl hover:scale-110 duration-700 ease-in-out border-8 border-border shadow-2xl"
      />
    </div>
  );
};
export const Banner = () => {
  const ISSERVER = typeof window === "undefined";

  const theme = (!ISSERVER ? localStorage.getItem("theme") : "system") as Theme;

  return (
    <div className="flex items-center justify-center -mt-20">
      <Image
        src={theme !== "light" ? "/dashboard-dark.png" : "/dashboard.png"}
        width={1000}
        height={850}
        alt="Banner2"
        quality={100}
        priority
        className="rounded-3xl hover:scale-110 duration-700 ease-in-out border-8 border-border shadow-xl "
      />
    </div>
  );
};
