import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Drug } from "@prisma/client";
import { AlertCircle, Calendar, Package, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export const PharmacyDashboard = ({
  totalDrugs,
  totalLowStock,
  expiringSoonDrugs,
  totalIssuedDrugs,
  expiringDrugList,
}: {
  totalDrugs: number;
  totalLowStock: number;
  expiringSoonDrugs: number;
  totalIssuedDrugs: number;
  expiringDrugList: Drug[];
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Package className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Total Drugs</p>
            <h3 className="text-2xl font-bold">{totalDrugs || 0}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <TrendingDown className="w-8 h-8 text-destructive" />
          <div>
            <p className="text-sm text-muted-foreground">Low Stock</p>
            <h3 className="text-2xl font-bold">{totalLowStock || 0}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-8 h-8 text-warning" />
          <div>
            <p className="text-sm text-muted-foreground">Expiring Soon</p>
            <h3 className="text-2xl font-bold">{expiringSoonDrugs || 0}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <AlertCircle className="w-8 h-8 text-success" />
          <div>
            <p className="text-sm text-muted-foreground">Issued Today</p>
            <h3 className="text-2xl font-bold">{totalIssuedDrugs || 0}</h3>
          </div>
        </div>
      </Card>

      {expiringSoonDrugs > 0 && (
        <div className="col-span-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Low Stock Alert</AlertTitle>
            <AlertDescription className="flex gap-1">
              The following drugs are running low on stock:
              {expiringDrugList?.map((drug, id) => (
                <ul key={drug.id} className="font-semibold">
                  {drug.name} ({drug.quantity} units)
                  {id < expiringDrugList.length - 1 && ", "}
                </ul>
              ))}
              {expiringSoonDrugs > 5
                ? ` and ${expiringSoonDrugs - 5} more`
                : ""}
            </AlertDescription>
            <div className="mt-4">
              <Button variant="ghost" className="hover:underline">
                <Link href="/pharmacy/drugs/expire">View Details</Link>
              </Button>
            </div>
          </Alert>
        </div>
      )}
    </div>
  );
};
