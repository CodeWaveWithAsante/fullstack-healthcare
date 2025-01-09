"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
import { issueDrugs } from "@/app/actions/pharmacy";
import { formatNumberToCurrency } from "@/utils";

const issuanceSchema = z.object({
  prescriptionId: z.string(),
  patientId: z.string(),
  drugs: z.array(
    z.object({
      drugId: z.string(),
      quantity: z.number().min(1),
      pricePerUnit: z.number(),
    })
  ),
});

type IssuanceFormProps = {
  prescription: any;
};

export function IssuanceForm({ prescription }: IssuanceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit } = useForm({
    resolver: zodResolver(issuanceSchema),
    defaultValues: {
      prescriptionId: prescription.id,
      patientId: prescription.patient.id,
      drugs: prescription.drugs.map((drug: any) => ({
        drugId: drug.drug.id,
        quantity: drug.quantity,
        pricePerUnit: drug.drug.pricePerUnit,
      })),
    },
  });

  const onSubmit = async (data: any) => {
    console.log("first");
    setIsSubmitting(true);
    console.log(data);
    // const result = await issueDrugs(data);
    setIsSubmitting(false);

    // if (result.success) {
    //   toast.success("Drugs issued successfully");
    //   router.push("/pharmacy/drug-issuance");
    // } else {
    //   toast.error(result.error);
    // }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label>Patient Name</Label>
            <p className="text-lg uppercase">
              {prescription?.patient?.first_name +
                " " +
                prescription?.patient?.last_name}
            </p>
          </div>
          <div>
            <Label>Prescription ID</Label>
            <p className="text-lg font-medium">{prescription?.id}</p>
          </div>
          <div>
            <Label>Doctor</Label>
            <p className="text-lg uppercase">{prescription?.doctor?.name}</p>
          </div>
          <div>
            <Label>Date</Label>
            <p className="text-lg font-medium">
              {new Date(prescription?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="lg:uppercase">
                <TableHead>Drug Name</TableHead>
                <TableHead>Prescribed Qty</TableHead>
                <TableHead>Available Stock</TableHead>
                <TableHead>Price/Unit</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Instructions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescription?.drugs?.map((item: any) => (
                <TableRow key={item?.drug?.id}>
                  <TableCell>{item?.drug?.name}</TableCell>
                  <TableCell>{item?.quantity}</TableCell>
                  <TableCell>{item?.drug?.quantity}</TableCell>
                  <TableCell>
                    {formatNumberToCurrency(item?.drug?.pricePerUnit)}
                  </TableCell>
                  <TableCell>
                    {formatNumberToCurrency(
                      item?.quantity * item?.drug?.pricePerUnit
                    )}
                  </TableCell>
                  <TableCell>{item?.frequency}</TableCell>
                  <TableCell>{item?.duration} days</TableCell>
                  <TableCell>{item?.instructions || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/pharmacy/drug-issuance")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Issue Drugs"}
        </Button>
      </div>
    </form>
  );
}
