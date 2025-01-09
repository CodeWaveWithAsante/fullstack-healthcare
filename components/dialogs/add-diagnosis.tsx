"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { addNewDiagnosis } from "@/app/actions/medical";
import { DiagnosisSchema } from "@/lib/schema";
import { z } from "zod";
import { CustomInput } from "../custom-inputs";
import { Button } from "../ui/button";
import { CardDescription, CardHeader } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form } from "../ui/form";

interface DataProps {
  patientId: string;
  medicalId: string;
  doctor_id: string | number;
  appointment_id: string | number;
}
export const AddDiagnosis = ({
  patientId,
  medicalId,
  doctor_id,
  appointment_id,
}: DataProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof DiagnosisSchema>>({
    resolver: zodResolver(DiagnosisSchema),
    defaultValues: {
      patient_id: patientId,
      medical_id: medicalId,
      doctor_id: doctor_id.toString(),
      symptoms: undefined,
      diagnosis: undefined,
      notes: undefined,
      prescribed_medications: undefined,
      follow_up_plan: undefined,
    },
  });

  const handleOnSubmit = async (values: z.infer<typeof DiagnosisSchema>) => {
    try {
      setIsLoading(true);
      const resp = await addNewDiagnosis({
        ...values,
        doctor_id: doctor_id,
        appointment_id: appointment_id,
      });

      if (resp.success) {
        toast.success("Vital Signs added successfully!");

        router.refresh();

        form.reset();
      } else if (resp.error) {
        toast.error(resp.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="lg"
            // variant="outline"
            className="text-white mt-4"
          >
            <Plus size={22} className="text-white" />
            Add Diagnosis
            <span className="ml-2 text-sm font-medium text-gray-300">
              (New)
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[60%] 2xl:max-w-[40%]">
          <CardHeader className="px-0">
            <DialogTitle>Add New Diagnosis</DialogTitle>
            <CardDescription>
              Ensure accurate findings are presented and corrected accordingly
              to ensure that they are correct for your application and that they
              do not result in an error.
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <CustomInput
                  type="textarea"
                  control={form.control}
                  name="symptoms"
                  label="Symptoms"
                  placeholder="Enter symptoms here ..."
                />
              </div>
              <div className="flex items-center gap-4">
                <CustomInput
                  type="textarea"
                  control={form.control}
                  name="diagnosis"
                  placeholder="Enter diagnosis here ..."
                  label="Diagnosis (Findings)"
                />
              </div>
              {/* <div className="flex items-center gap-4">
                <CustomInput
                  type="textarea"
                  control={form.control}
                  name="prescribed_medications"
                  placeholder="Enter principles here ..."
                  label="Prescriptions for this patient"
                />
              </div> */}

              <div className="flex flex-col gap-4">
                <CustomInput
                  type="textarea"
                  control={form.control}
                  name="notes"
                  placeholder="Optional note"
                  label="Additional Notes for this treatment"
                />
                <CustomInput
                  type="textarea"
                  control={form.control}
                  name="follow_up_plan"
                  placeholder="Optional"
                  label="Follow Up Plan"
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
