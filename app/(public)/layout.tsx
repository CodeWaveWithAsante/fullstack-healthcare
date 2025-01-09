import { ThemeSwitcher } from "@/components/theme-switcher";
import React from "react";

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="">
      <div className="w-full flex justify-end p-4">
        <ThemeSwitcher />
      </div>
      {children}
    </div>
  );
};

export default PublicLayout;
