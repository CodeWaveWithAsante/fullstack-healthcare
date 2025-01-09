import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/lib/db";
import { cn } from "@/lib/utils";
import { format, sub } from "date-fns";
import Link from "next/link";
import { Button } from "../ui/button";
import { ExpiringDrugsTable } from "./drugs/expiring-drugs-table";

// export interface Drug {
//   id: string;
//   name: string;
//   batchNumber: string;
//   manufacturer: string;
//   expiryDate: string;
//   quantity: number;
//   pricePerUnit: number;
//   category: string;
//   description: string;
// }

export const ExpiringDrugs = async ({ isShow }: { isShow?: boolean }) => {
  const EXPIRING_SOON_DAYS = 30;

  const expiringSoonDate = sub(new Date(), { days: -EXPIRING_SOON_DAYS });

  const data = await db.drug.findMany({
    where: {
      expiryDate: {
        lte: expiringSoonDate,
      },
    },
  });

  if (!data) return null;

  return (
    <Card className="mb-8">
      <CardHeader
        className={cn(
          "flex flex-row items-center",
          isShow ? "justify-start" : "justify-end"
        )}
      >
        {isShow ? <CardTitle>Expiring Soon</CardTitle> : ""}

        {!isShow && (
          <Link href="/pharmacy/drugs/expire">
            <Button variant="outline" className="text-blue-600 hover:underline">
              View all
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <ExpiringDrugsTable data={data} />
      </CardContent>
    </Card>
  );
};
