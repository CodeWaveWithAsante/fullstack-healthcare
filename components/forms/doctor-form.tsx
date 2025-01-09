"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DoctorSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createDoctor } from "@/app/actions/doctors";
import { SPECIALIZATION } from "@/utils/settings";
import { CustomInput, SwitchInput } from "../custom-inputs";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Label } from "../ui/label";

const TYPES = [
  { label: "Full-Time", value: "FULL" },
  { label: "Part-Time", value: "PART" },
];

const WORKING_DAYS = [
  { label: "Sunday", value: "sunday" },
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
];

type Day = {
  day: string;
  start_time?: string;
  close_time?: string;
};

export const DoctorForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [workSchedule, setWorkSchedule] = useState<Day[]>([]);

  const form = useForm<z.infer<typeof DoctorSchema>>({
    resolver: zodResolver(DoctorSchema),
    defaultValues: {
      name: "",
      type: "FULL",
      specialization: "",
      phone: "",
      email: "",
      password: "",
      license_number: "",
      address: "",
      department: "",
      img: "",
    },
  });

  const handleOnSubmit = async (values: z.infer<typeof DoctorSchema>) => {
    try {
      if (workSchedule?.length === 0) {
        toast.error("Please add at least one working day!");
        return;
      }

      setIsLoading(true);
      const resp = await createDoctor({
        ...values,
        work_schedule: workSchedule,
      });

      if (resp.success) {
        toast.success("Doctor added successfully!");

        router.refresh();
        setWorkSchedule([]);
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

  const selectedSpecialization = form.watch("specialization");

  useEffect(() => {
    if (selectedSpecialization) {
      const department = SPECIALIZATION.find(
        (el) => el.value === selectedSpecialization
      );

      if (department) {
        form.setValue("department", department?.department);
      }
    }
  }, [selectedSpecialization]);

  return (
    <Sheet>
      <Button size="sm" className="text-sm font-normal" asChild>
        <SheetTrigger>
          <Plus size={20} />
          Add Doctor
        </SheetTrigger>
      </Button>

      <SheetContent className="rounded-xl md:h-[90%] md:top-[5%] md:right-[1%] w-full overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Add New Doctor</SheetTitle>
        </SheetHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-8 mt-5 2xl:mt-10"
            >
              <>
                <CustomInput
                  type="radio"
                  selectList={TYPES}
                  control={form.control}
                  name="type"
                  label="Type"
                  placeholder=""
                  defaultValue="FULL"
                />

                <CustomInput
                  type="input"
                  control={form.control}
                  name="name"
                  placeholder="Dr. John Doe"
                  label="Full Name"
                />

                <div className="flex items-center gap-2">
                  <CustomInput
                    type="select"
                    control={form.control}
                    name="specialization"
                    placeholder="Select specialization"
                    label="Specialization"
                    selectList={SPECIALIZATION!}
                  />
                  <CustomInput
                    type="input"
                    control={form.control}
                    name="department"
                    placeholder="OPD"
                    label="Department"
                  />
                </div>

                <CustomInput
                  type="input"
                  control={form.control}
                  name="license_number"
                  placeholder="AN-347834786"
                  label="License Number"
                />

                <div className="flex items-center gap-2">
                  <CustomInput
                    type="input"
                    control={form.control}
                    name="email"
                    placeholder="john@example.com"
                    label="Email Address"
                  />

                  <CustomInput
                    type="input"
                    control={form.control}
                    name="phone"
                    placeholder="9225600735"
                    label="Contact Number"
                  />
                </div>
                <CustomInput
                  type="input"
                  control={form.control}
                  name="address"
                  placeholder="1479 Street, Apt 1839-G, NY"
                  label="Address"
                />

                <CustomInput
                  type="input"
                  control={form.control}
                  name="password"
                  placeholder=""
                  label="Password"
                  inputType="password"
                />
              </>

              <div className="mt-6 space-y-2">
                <Label>Working Days</Label>
                <SwitchInput
                  data={WORKING_DAYS}
                  setWorkSchedule={setWorkSchedule}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
