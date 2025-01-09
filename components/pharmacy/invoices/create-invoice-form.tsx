"use client";

import { createInvoice } from "@/app/actions/pharmacy";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useInvoiceStore } from "@/hooks/use-invoice-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const invoiceSchema = z.object({
  providerName: z.string().min(1, "Provider name is required"),
  purchaseDate: z.date(),
  notes: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export function CreateInvoiceForm() {
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const { selectedDrugs, clearSelection } = useInvoiceStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      providerName: "",
      purchaseDate: new Date(),
      notes: "",
    },
  });

  const onSubmit = async (data: InvoiceFormData) => {
    if (selectedDrugs.length === 0) {
      toast.error("Please select at least one drug");
      return;
    }

    setIsLoading(true);

    const result = await createInvoice({
      ...data,
      drugs: selectedDrugs.map((drug) => ({
        drugId: drug.drugId,
        quantity: drug.quantity,
        pricePerUnit: drug.pricePerUnit,
      })),
    });

    setIsLoading(false);

    if (result.invoice) {
      toast.success("Invoice created successfully");
      clearSelection();
      router.push("/pharmacy/invoices");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="providerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provider Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter provider name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          setDate(selectedDate);
                          field.onChange(selectedDate || null);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input placeholder="Additional notes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/pharmacy/invoices")}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            Create Invoice
          </Button>
        </div>
      </form>
    </Form>
  );
}
