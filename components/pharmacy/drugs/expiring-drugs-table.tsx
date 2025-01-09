import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Drug } from "@prisma/client";
import { format } from "date-fns";

export const ExpiringDrugsTable = ({ data }: { data: Drug[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="lg:uppercase">
          <TableHead>Name</TableHead>
          <TableHead>Batch Number</TableHead>
          <TableHead>Expiry Date</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((drug) => (
          <TableRow key={drug?.id}>
            <TableCell>{drug?.name}</TableCell>
            <TableCell className="uppercase">{drug?.batchNumber}</TableCell>
            <TableCell>{format(drug?.expiryDate, "yyy-MM-dd")}</TableCell>
            <TableCell>{drug?.quantity}</TableCell>
            <TableCell>{drug?.category}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
