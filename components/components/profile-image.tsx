import { cn } from "@/lib/utils";
import { getInitials } from "@/utils";
import Image from "next/image";

export const ProfileImage = ({
  url,
  name,
  className,
  textClassName,
  bgColor,
}: {
  url?: string;
  name: string;
  className?: string;
  textClassName?: string;
  bgColor?: string;
}) => {
  if (url)
    return (
      <Image
        src={url}
        alt={name}
        height={40}
        width={40}
        className={cn(
          "flex md:hidden lg:block w-10 h-10 rounded-full object-cover",
          className
        )}
      />
    );

  if (name) {
    return (
      <div
        className={cn(
          "flex md:hidden lg:flex w-10 h-10 rounded-full text-white text-base items-center justify-center font-light",
          className
        )}
        style={{ backgroundColor: bgColor || "#2563eb" }}
      >
        <p className={textClassName}>{getInitials(name)}</p>
      </div>
    );
  }
};
