"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { addNewVitalSigns } from "@/app/actions/appointment";
import { VitalSignsSchema } from "@/lib/schema";
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
export const AddVitalSigns = ({
  patientId,
  medicalId,
  doctor_id,
  appointment_id,
}: DataProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof VitalSignsSchema>>({
    resolver: zodResolver(VitalSignsSchema),
    defaultValues: {
      patient_id: patientId,
      medical_id: medicalId,
      body_temperature: 0,
      systolic: 0,
      diastolic: 0,
      heartRate: "",
      weight: 0,
      height: 0,
      respiratory_rate: 0,
      oxygen_saturation: 0,
    },
  });

  const handleOnSubmit = async (values: z.infer<typeof VitalSignsSchema>) => {
    try {
      setIsLoading(true);
      const resp = await addNewVitalSigns({
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
            size="sm"
            variant="outline"
            className="text-[14px] font-light"
          >
            <Plus size={22} className="text-gray-500" /> Add Vital Signs
          </Button>
        </DialogTrigger>
        <DialogContent>
          <CardHeader className="px-0">
            <DialogTitle>Add Vital Signs</DialogTitle>
            <CardDescription>
              Ensure accurate readings are perform as this may affect the
              diagnosis and other medical processes.
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="body_temperature"
                  label="Body Temperature (°C)"
                  placeholder="eg.:37.5"
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="heartRate"
                  placeholder="eg: 54-123"
                  label="Heart Rate (BPM)"
                />
              </div>
              <div className="flex items-center gap-4">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="systolic"
                  placeholder="eg: 120"
                  label="Systolic BP"
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="diastolic"
                  placeholder="eg: 80"
                  label="Diastolic BP"
                />
              </div>
              <div className="flex items-center gap-4">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="weight"
                  placeholder="eg.: 80"
                  label="Weight (Kg)"
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="height"
                  placeholder="eg.: 175"
                  label="Height (Cm)"
                />
              </div>

              <div className="flex items-center gap-4">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="respiratory_rate"
                  placeholder="Optional"
                  label="Respiratory Rate"
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="oxygen_saturation"
                  placeholder="Optional"
                  label="Oxygen Saturation"
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
