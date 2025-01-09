"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAvailableDrugs, getPatients } from "@/utils/services/pharmacy";

const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
  drugs: z
    .array(
      z.object({
        drugId: z.string().min(1, "Drug is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        instructions: z.string().optional(),
        frequency: z.string().optional(),
        duration: z.number().optional(),
      })
    )
    .optional(),
  // .min(1, "At least one drug is required"),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

export function DiagnosisForm() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [drugs, setDrugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      drugs: [
        {
          drugId: "",
          quantity: 1,
          instructions: "",
          frequency: "",
          duration: undefined,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "drugs",
  });

  useEffect(() => {
    // loadDrugs();
  }, []);

  const searchPatients = async (search: string) => {
    const result = await getPatients(search);
    if (result.patients) {
      setPatients(result.patients);
    }
  };

  const loadDrugs = async () => {
    const result = await getAvailableDrugs();
    if (result.drugs) {
      setDrugs(result.drugs);
    }
  };

  const onSubmit = async (data: PrescriptionFormData) => {
    // setLoading(true);
    // const result = await createPrescription(data);
    // setLoading(false);
    // if (result.prescription) {
    //   toast.success("Prescription created successfully");
    //   router.push("/prescriptions");
    // } else {
    //   toast.error(result.error);
    // }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Patient Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search patients..."
                onChange={(e) => searchPatients(e.target.value)}
                className="pl-10"
              />
            </div>
            {errors.patientId && (
              <p className="text-sm text-destructive">
                {errors.patientId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Doctor ID</Label>
            <Input {...register("doctorId")} />
            {errors.doctorId && (
              <p className="text-sm text-destructive">
                {errors.doctorId.message}
              </p>
            )}
          </div>

          <div className="col-span-2 space-y-2">
            <Label>Diagnosis</Label>
            <Textarea {...register("diagnosis")} />
          </div>

          <div className="col-span-2 space-y-2">
            <Label>Notes</Label>
            <Textarea {...register("notes")} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Prescribed Drugs</h3>
            <Button
              type="button"
              onClick={() =>
                append({
                  drugId: "",
                  quantity: 1,
                  instructions: "",
                  frequency: "",
                  duration: undefined,
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Drug
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-4 gap-4 p-4 border rounded-md"
            >
              <div className="space-y-2">
                <Label>Drug</Label>
                <Input {...register(`drugs.${index}.drugId`)} />
                {errors.drugs?.[index]?.drugId && (
                  <p className="text-sm text-destructive">
                    {errors.drugs[index]?.drugId?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  {...register(`drugs.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                />
                {errors.drugs?.[index]?.quantity && (
                  <p className="text-sm text-destructive">
                    {errors.drugs[index]?.quantity?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Frequency</Label>
                <Input
                  {...register(`drugs.${index}.frequency`)}
                  placeholder="e.g., twice daily"
                />
              </div>

              <div className="space-y-2">
                <Label>Duration (days)</Label>
                <Input
                  type="number"
                  min="1"
                  {...register(`drugs.${index}.duration`, {
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div className="col-span-4 space-y-2">
                <Label>Instructions</Label>
                <Input
                  {...register(`drugs.${index}.instructions`)}
                  placeholder="Special instructions"
                />
              </div>

              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  className="col-span-4 text-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Drug
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/prescriptions")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Prescription"}
          </Button>
        </div>
      </form>
    </>
  );
}
