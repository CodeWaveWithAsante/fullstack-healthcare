"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { createNewDiagnosis } from "@/app/actions/medical";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MedicalRecords } from "@prisma/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const diagnosisSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  medicalId: z.string().min(1, "Medical ID is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  symptoms: z.string().min(1, "Symptoms is required"),
  follow_up_plan: z.string().optional(),
  notes: z.string().optional(),
  name: z.string().optional(),
  drugs: z
    .array(
      z.object({
        drugId: z.string().min(1, "Drug is required"),
        // drugName: z.string(),
        // maxQuantity: z.number().min(1, "Max quantity must be at least 1"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        instructions: z.string().optional(),
        frequency: z.string().optional(),
        duration: z.number().optional(),
      })
    )
    .refine(
      (drugs) => drugs.length === 0 || drugs.every((drug) => !!drug.drugId),
      {
        message: "At least one drug must have valid details.",
      }
    ),
});

type DiagnosisFormData = z.infer<typeof diagnosisSchema>;

interface PatientData extends MedicalRecords {
  patient: { last_name: string; id: string; first_name: string };
}

export function DiagnosisForm({
  data,
  doctorId,
  drugs,
}: {
  data: PatientData;
  doctorId: string;
  drugs: {
    id: string;
    name: string;
    quantity: number;
    expiryDate: Date;
    category: string;
  }[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<DiagnosisFormData>({
    resolver: zodResolver(diagnosisSchema),
    defaultValues: {
      patientId: data?.patient_id,
      name: data?.patient?.first_name + " " + data?.patient?.last_name,
      medicalId: String(data?.id),
      doctorId: doctorId,
      symptoms: undefined,
      diagnosis: undefined,
      notes: undefined,
      follow_up_plan: undefined,
      drugs: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "drugs",
  });

  const onSubmit = async (data: DiagnosisFormData) => {
    try {
      setLoading(true);
      const result = await createNewDiagnosis(data);

      if (result.diagnosis) {
        toast.success("Diagnosis created successfully");
        router.back();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Search</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Patient name"
                    className="pl-10"
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor ID</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symptoms</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnosis</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="follow_up_plan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Follow up Plan</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Drug Prescription</h3>
            <Button
              variant="outline"
              type="button"
              onClick={() =>
                append({
                  drugId: "",
                  //   drugName: "",
                  quantity: 1,
                  //   maxQuantity: 0,
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
            <>
              <div
                key={field.id}
                className="grid grid-cols-4 gap-4 p-4 border rounded-md mt-10"
              >
                <FormField
                  control={form.control}
                  name={`drugs.${index}.drugId`}
                  render={({ field: drugField }) => (
                    <FormItem>
                      <FormLabel>Drug Name</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selectedDrug = drugs.find(
                            (drug) => drug.id === value
                          );
                          if (selectedDrug) {
                            form.setValue(
                              `drugs.${index}.drugId`,
                              selectedDrug.id
                            );
                            //   form.setValue(
                            //     `drugs.${index}.drugName`,
                            //     selectedDrug.name
                            //   );
                            //   form.setValue(
                            //     `drugs.${index}.maxQuantity`,
                            //     selectedDrug.quantity
                            //   );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select drug" />
                        </SelectTrigger>
                        <SelectContent>
                          {drugs.map((drug) => (
                            <SelectItem key={drug.id} value={drug.id}>
                              {drug.name} - {drug.quantity} available
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...form.register(`drugs.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <FormControl>
                    <Input {...form.register(`drugs.${index}.frequency`)} />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Duration (Days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...form.register(`drugs.${index}.duration`, {
                        valueAsNumber: true,
                      })}
                    />
                  </FormControl>
                </FormItem>
              </div>
              <div className="flex items-center gap-6">
                <FormItem className="w-full">
                  <FormLabel>Instruction</FormLabel>
                  <FormControl className="w-full">
                    <Input {...form.register(`drugs.${index}.instructions`)} />
                  </FormControl>
                </FormItem>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => remove(index)}
                    className="col-span-4 text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Drug
                  </Button>
                )}
              </div>
            </>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Diagnosis"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
