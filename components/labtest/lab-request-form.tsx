"use client";

import { addLabRequest } from "@/app/actions/medical";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { LabRequestSchema } from "@/lib/schema";
import { calculateAge } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { MedicalRecords, Patient, Services } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PatientInfoSection } from "./patient-info-form";
import { TestDetailsSection } from "./test-details-form";
import { useRouter } from "next/navigation";

export const LabRequestForm = ({
  patient,
  medicalRecords,
  availableTest,
}: {
  patient: Patient;
  medicalRecords: MedicalRecords[];
  availableTest: { id: number; name: string }[];
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof LabRequestSchema>>({
    resolver: zodResolver(LabRequestSchema),
    defaultValues: {
      recordId: "",
      patientName: "",
      patientId: "",
      age: "",
      gender: undefined,
      testTypes: [],
      priority: undefined,
      requestDate: new Date().toISOString().split("T")[0],
      specialInstructions: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof LabRequestSchema>) {
    try {
      setIsLoading(true);

      const res = await addLabRequest(values);
      router.refresh();
      toast.success("The lab test request has been submitted successfully.");
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const AGE = calculateAge(patient.date_of_birth);

    form.reset({
      patientName: patient?.first_name + " " + patient?.last_name,
      patientId: patient.id,
      age: AGE,
      gender: patient.gender.toLowerCase()! as "male" | "female",
      testTypes: [],
      priority: undefined,
      requestDate: new Date().toISOString().split("T")[0],
      specialInstructions: "",
    });
  }, [patient]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Test Request</Button>
      </DialogTrigger>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>New Lab Test Request</DialogTitle>
        </DialogHeader>
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <PatientInfoSection form={form} data={medicalRecords} />
              <TestDetailsSection form={form} data={availableTest} />
              <Button disabled={isLoading} type="submit" className="w-full">
                Submit Request
              </Button>
            </form>
          </Form>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
