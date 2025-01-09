import { Badge } from "@/components/ui/badge";
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
import { formatNumberToCurrency } from "@/utils";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import Link from "next/link";

export const DrugIssuance = async () => {
  const data = await db.drugIssuance.findMany({
    take: 10,
    orderBy: { issuedAt: "desc" },
    include: {
      patient: { select: { first_name: true, last_name: true } },
      prescription: { select: { id: true, status: true } },
      drugs: true,
    },
  });

  if (!data) return null;

  return (
    <div>
      <div className="flex justify-end items-center mb-6">
        <Link href={`/pharmacy/prescriptions`}>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Issuance
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="lg:uppercase">
              <TableHead>Date</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Prescription ID</TableHead>
              <TableHead>Drugs</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((el, index) => (
              <TableRow key={el.id}>
                <TableCell>{format(el?.issuedAt, "yyyy-MM-dd")}0</TableCell>
                <TableCell>
                  {el?.patient?.first_name + " " + el?.patient?.last_name}
                </TableCell>
                <TableCell>{el?.prescriptionId}</TableCell>
                <TableCell>{el?.drugs?.length} Items</TableCell>
                <TableCell>{formatNumberToCurrency(el?.totalCost)}</TableCell>
                <TableCell>
                  <Badge>{el?.prescription?.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View
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
