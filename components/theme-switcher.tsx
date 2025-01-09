"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/hooks/theme-provider";
import { Monitor, Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Select
      value={theme}
      onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select theme">
          <div className="flex items-center gap-2">
            {theme === "light" && <Sun className="h-4 w-4" />}
            {theme === "dark" && <Moon className="h-4 w-4" />}
            {theme === "system" && <Monitor className="h-4 w-4" />}
            <span className="capitalize">{theme}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </div>
        </SelectItem>
        <SelectItem value="system">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>System</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
