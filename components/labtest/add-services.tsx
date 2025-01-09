"use client";

import { addNewService, updateService } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ServicesSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

type DataType = {
  type?: "create" | "update";
  data?: z.infer<typeof ServicesSchema>;
  id?: number;
};
export const AddServiceDialog = ({ type = "create", data, id }: DataType) => {
  console.log(data);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof ServicesSchema>>({
    resolver: zodResolver(ServicesSchema),
    defaultValues: {
      name: data?.name || "",
      category: data?.category || "",
      price: data?.price || "",
      tat: data?.tat || "",
      description: data?.description || "",
      department: data?.department || "GENERAL",
    },
  });

  async function onSubmit(values: z.infer<typeof ServicesSchema>) {
    try {
      setIsLoading(true);

      const res =
        type === "create"
          ? await addNewService({
              ...values,
              price: values.price,
              tat: values.tat,
            })
          : await updateService(
              { ...values, price: values.price, tat: values.tat },
              id!
            );

      if (res.success) {
        form.reset();
        router.refresh();
        toast.success("Service added successfully!");
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    type === "update" &&
      form.reset({
        ...data,
      });
  }, [type]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {type === "create" ? (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Service
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
          <DialogDescription>
            Add a new laboratory service to the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. Complete Blood Count" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. Hematology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GENERAL">GENERAL</SelectItem>
                      <SelectItem value="LABORATORY">LABORATORY</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field}></Textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="eg. 50.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turn Around Time (hours)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="eg. 24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={isLoading} type="submit">
                Save Service
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
