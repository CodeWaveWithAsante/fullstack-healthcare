import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceType } from "@/lib/types/pharmacy";
import { formatNumberToCurrency } from "@/utils";
import { format } from "date-fns";
import { InvoiceActions } from "./inoice-actions";

export const InvoiceTable = ({ data }: { data: InvoiceType[] }) => {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return "success";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="lg:uppercase">
            <TableHead>Invoice #</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>{invoice.providerName}</TableCell>
              <TableCell>
                {format(invoice.purchaseDate, "yyyy-MM-dd")}
              </TableCell>
              <TableCell>{formatNumberToCurrency(invoice.totalCost)}</TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(invoice.status!)}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>
                <InvoiceActions
                  id={invoice.id}
                  status={invoice.status}
                  data={invoice!}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
