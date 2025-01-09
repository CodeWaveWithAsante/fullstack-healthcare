"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { useInvoiceStore } from "@/hooks/use-invoice-store";
import { Drug } from "@prisma/client";

function filterDrugs(drugs: Drug[], searchTerm: string): Drug[] {
  if (!searchTerm.trim()) return drugs; // Return the full list if searchTerm is empty

  const lowercasedTerm = searchTerm.toLowerCase();

  return drugs.filter((drug) => {
    return (
      drug.name.toLowerCase().includes(lowercasedTerm) ||
      drug.category.toLowerCase().includes(lowercasedTerm)
    );
  });
}

export function DrugSelectionTable({ drugs }: { drugs: Drug[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [drugsData, setDrugData] = useState(drugs);

  const { selectedDrugs, addDrug, removeDrug, updateQuantity } =
    useInvoiceStore();

  const handleCheckboxChange = (drug: any, checked: boolean) => {
    if (checked) {
      addDrug({
        drugId: drug.id,
        name: drug.name,
        quantity: 1,
        pricePerUnit: drug.pricePerUnit,
      });
    } else {
      removeDrug(drug.id);
    }
  };

  useEffect(() => {
    const fetchDrugs = async () => {
      const list = filterDrugs(drugs, searchTerm);
      setDrugData(list);
    };

    const debounce = setTimeout(fetchDrugs, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search drugs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="lg:uppercase">
              <TableHead className="w-12"></TableHead>
              <TableHead>Drug Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Available Qty</TableHead>
              <TableHead>Price/Unit</TableHead>
              <TableHead>Order Qty</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drugsData?.map((drug) => {
              const selectedDrug = selectedDrugs?.find(
                (d) => d.drugId === drug?.id
              );
              const quantity = selectedDrug?.quantity || 0;

              return (
                <TableRow key={drug.id}>
                  <TableCell>
                    <Checkbox
                      checked={!!selectedDrug}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(drug, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>{drug.name}</TableCell>
                  <TableCell>{drug.category}</TableCell>
                  <TableCell>{drug.quantity}</TableCell>
                  <TableCell>${drug.pricePerUnit.toFixed(2)}</TableCell>
                  <TableCell className="w-24">
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        selectedDrug &&
                        updateQuantity(drug.id, parseInt(e.target.value) || 0)
                      }
                      className="w-20"
                      disabled={!selectedDrug}
                    />
                  </TableCell>
                  <TableCell>
                    ${(quantity * drug.pricePerUnit).toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
