import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/lib/db";
import { DrugCategory, Prisma } from "@prisma/client";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { SearchParams } from "next/dist/server/request/search-params";
import Link from "next/link";
import { SearchByCategory } from "../search-by-category";
import SearchInput from "../search-input";

export const DrugStock = async ({
  category,
  searchTerm,
}: {
  category: string;
  searchTerm: string;
}) => {
  const where: Prisma.DrugWhereInput = {
    ...(searchTerm && {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { manufacturer: { contains: searchTerm, mode: "insensitive" } },
        { batchNumber: { contains: searchTerm, mode: "insensitive" } },
      ],
    }),
    ...(category &&
      category !== "ALL" && { category: category as DrugCategory }),
  };

  const data = await db.drug.findMany({
    where,
    take: 10,
  });

  if (!data) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 flex-1 max-w-lg">
          <SearchInput />
          <SearchByCategory />
        </div>

        <div>
          <Link href="/pharmacy/drugs">
            <Button variant="outline" className="text-blue-600 hover:underline">
              View all
            </Button>
          </Link>
          <Link href="/pharmacy/drugs/add">
            <Button className="ml-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Drug
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="lg:uppercase">
              <TableHead>Drug Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Batch Number</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((drug) => (
              <TableRow key={drug?.id}>
                <TableCell>{drug?.name}</TableCell>
                <TableCell>{drug?.category}</TableCell>
                <TableCell>{drug?.batchNumber}</TableCell>
                <TableCell>{drug?.quantity}</TableCell>
                <TableCell>${drug?.pricePerUnit.toFixed(2)}</TableCell>
                <TableCell>{format(drug?.expiryDate, "yyy-MM-dd")}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
