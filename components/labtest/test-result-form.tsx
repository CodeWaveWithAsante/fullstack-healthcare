"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LabResultSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { addLabResult } from "@/app/actions/medical";
import { useState } from "react";

export const LabResultForm = ({
  id,
  disabled,
}: {
  id: number;
  disabled: boolean;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof LabResultSchema>>({
    resolver: zodResolver(LabResultSchema),
    defaultValues: {
      testId: id.toString() || "",
      testDate: "",
      result: "",
      status: "PENDING",
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LabResultSchema>) {
    try {
      setIsLoading(true);

      const res = await addLabResult(values);
      router.refresh();
      toast.success(res?.message);
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        asChild
        disabled={disabled}
        className="disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Button
          size="sm"
          variant="link"
          className="text-[13px] font-normal flex items-center bg-emerald-50 text-emerald-500"
        >
          <Plus className="h-4 w-4" />
          Add Result
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Test Result</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="testId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Test ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="testDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="result"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Result</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter test result" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Textarea
                      placeholder="Add any additional notes"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isLoading}
              type="submit"
              className="w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Lab Result
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
