"use client";

import { DrugCategory } from "@/lib/types/pharmacy";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const SearchByCategory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (categoryFilter) {
      router.push(pathname + "?" + createQueryString("c", categoryFilter));
    }
  }, [categoryFilter]);

  return (
    <>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Categories</SelectItem>
          {Object.values(DrugCategory).map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

const PRESCRIPTION_STATUS = ["PENDING", "COMPLETED", "CANCELLED"];
export const SearchByPrescriptionStatus = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (categoryFilter) {
      router.push(pathname + "?" + createQueryString("c", categoryFilter));
    }
  }, [categoryFilter]);

  return (
    <>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Categories</SelectItem>
          {PRESCRIPTION_STATUS.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export const SearchByFilters = ({ data }: { data: string[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (categoryFilter) {
      router.push(pathname + "?" + createQueryString("c", categoryFilter));
    }
  }, [categoryFilter]);

  return (
    <>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Categories</SelectItem>
          {data?.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
