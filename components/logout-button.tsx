"use client";

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

import { useClerk } from "@clerk/nextjs";

export const LogoutButton = () => {
  const { signOut } = useClerk();

  return (
    <Button
      onClick={() => signOut({ redirectUrl: "/sign-in" })}
      variant="outline"
      className="w-fit bottom-0 gap-2 px-0 md:px-4"
    >
      <LogOut /> <span className="hidden lg:block">Logout</span>
    </Button>
  );
};
