"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useState } from "react";
import { Input } from "./ui/input";
import { useDebounce, useDebounceCallback } from "@react-hook/debounce";
import debounce from "debounce";

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      router.push(pathname + "?" + createQueryString("q", value));
    }, 500),
    [pathname, searchParams, router, createQueryString] // 500ms debounce delay
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 2xl:w-6" />
      <Input
        placeholder="Search record..."
        value={searchValue}
        onChange={handleChange}
        className="pl-10"
      />
    </div>
  );
};

export default SearchInput;
