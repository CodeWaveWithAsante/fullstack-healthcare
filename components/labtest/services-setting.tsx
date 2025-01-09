import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/lib/db";
import { Edit2, Trash2 } from "lucide-react";
import { AddServiceDialog } from "./add-services";
import { formatNumberToCurrency } from "@/utils";
import { ServiceTable } from "../tables/services-table";

export const ServicesSettings = async () => {
  const data = await db.services.findMany({
    where: { department: "LABORATORY" },
    orderBy: { name: "asc" },
  });

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Laboratory Services</CardTitle>
            <CardDescription>
              Manage all available laboratory services and their pricing
            </CardDescription>
          </div>
          <AddServiceDialog />
        </div>
      </CardHeader>
      <CardContent>
        <ServiceTable data={data} />
      </CardContent>
    </Card>
  );
};
