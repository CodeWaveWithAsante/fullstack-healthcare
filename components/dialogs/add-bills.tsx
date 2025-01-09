"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { addNewBill } from "@/app/actions/medical";
import { PatientBillSchema } from "@/lib/schema";
import { Services } from "@prisma/client";
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
  id?: string | number;
  appId?: string | number;
  servicesData: Services[];
}
export const AddBills = ({ id, appId, servicesData }: DataProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [data, setData] = useState<any>();

  const form = useForm<z.infer<typeof PatientBillSchema>>({
    resolver: zodResolver(PatientBillSchema),
    defaultValues: {
      bill_id: String(id),
      service_id: undefined,
      service_date: new Date().toDateString(),
      appointment_id: String(appId),
      quantity: undefined,
      unit_cost: undefined,
      total_cost: undefined,
    },
  });

  const handleOnSubmit = async (values: z.infer<typeof PatientBillSchema>) => {
    try {
      setIsLoading(true);
      const resp = await addNewBill(values);

      if (resp.success) {
        toast.success("Patient bill added successfully!");

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

  useEffect(() => {
    if (servicesData) {
      setData(
        servicesData?.map((service) => ({
          value: service.id.toString(),
          label: service?.name,
        }))
      );
    }
  }, [servicesData, id]);

  const selectedService = form.watch("service_id");
  const quantity = form.watch("quantity");

  useEffect(() => {
    if (selectedService) {
      const unit_cost = servicesData.find(
        (el) => el.id === Number(selectedService)
      );

      if (unit_cost) {
        form.setValue("unit_cost", unit_cost?.price.toFixed(2));
      }
      if (quantity) {
        form.setValue(
          "total_cost",
          (Number(quantity) * Number(unit_cost?.price!)).toFixed(2)
        );
      }
    }
  }, [selectedService, quantity]);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="text-sm font-normal">
            <Plus size={22} className="text-gray-400" />
            Add Bill
          </Button>
        </DialogTrigger>
        <DialogContent>
          <CardHeader className="px-0">
            <DialogTitle>Add Patient Bill</DialogTitle>
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
              <div className="flex items-center gap-2">
                <CustomInput
                  type="select"
                  control={form.control}
                  name="service_id"
                  placeholder="Select service"
                  label="Service Name"
                  selectList={data!}
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="unit_cost"
                  placeholder=""
                  label="Unit Cost"
                />
              </div>

              <div className="flex items-center gap-2">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="quantity"
                  placeholder="Enter quantity"
                  label="Quantity"
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="total_cost"
                  placeholder="0.00"
                  label="Total Cost"
                />
              </div>

              <CustomInput
                type="input"
                control={form.control}
                name="service_date"
                label="Service Date"
                placeholder=""
                inputType="date"
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 w-full"
              >
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
