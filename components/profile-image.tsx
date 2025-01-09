import { cn } from "@/lib/utils";
import { getInitials } from "@/utils";
import Image from "next/image";
import React from "react";

let index = -1;

export const ProfileImage = ({
  url,
  name,
  className,
  textClassName,
  bgColor,
}: {
  url?: string;
  name?: string;
  className?: string;
  textClassName?: string;
  bgColor?: string;
}) => {
  const bg = ["bg-violet-500", "bg-rose-400", "bg-emerald-500"];

  if (url)
    return (
      <Image
        src={url}
        alt=""
        width={40}
        height={40}
        className={cn(
          "flex md:hidden lg:block w-10 h-10 rounded-full object-cover",
          className
        )}
      />
    );
  if (name) {
    index = index === 2 ? 0 : index + 1;

    return (
      <div
        className={cn(
          "flex md:hidden lg:flex w-10 h-10 rounded-full text-white text-base items-center justify-center font-light",
          className
        )}
        style={{ backgroundColor: bgColor || "#2563eb" }}
      >
        <p className={textClassName}>{getInitials(name!)}</p>
      </div>
    );
  }
};
