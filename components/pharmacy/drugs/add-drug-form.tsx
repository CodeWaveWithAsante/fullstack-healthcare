"use client";

import { createDrug } from "@/app/actions/pharmacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DrugCategory } from "@/lib/types/pharmacy";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type DrugFormData = {
  name: string;
  category: DrugCategory;
  batchNumber: string;
  manufacturer: string;
  quantity: number;
  pricePerUnit: number;
  expiryDate: string;
  description: string;
};

const drugSchema = z.object({
  name: z.string().min(1, "Drug name is required"),
  category: z.nativeEnum(DrugCategory, {
    required_error: "Category is required",
  }),
  batchNumber: z.string().min(1, "Batch number is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  quantity: z.number().min(0, "Quantity must be 0 or greater"),
  pricePerUnit: z.number().min(0, "Price must be 0 or greater"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  description: z.string().optional(),
});

export function AddDrugForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DrugFormData>({
    resolver: zodResolver(drugSchema),
  });

  const onSubmit = async (data: DrugFormData) => {
    setIsLoading(true);
    const result = await createDrug({
      ...data,
      expiryDate: new Date(data.expiryDate),
    });
    setIsLoading(false);
    if (result.drug) {
      toast.success("Drug added successfully");
      router.push("/pharmacy/drugs");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Drug Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            onValueChange={(value) =>
              setValue("category", value as DrugCategory)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(DrugCategory).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-destructive">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="batchNumber">Batch Number</Label>
          <Input id="batchNumber" {...register("batchNumber")} />
          {errors.batchNumber && (
            <p className="text-sm text-destructive">
              {errors.batchNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input id="manufacturer" {...register("manufacturer")} />
          {errors.manufacturer && (
            <p className="text-sm text-destructive">
              {errors.manufacturer.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            type="number"
            id="quantity"
            {...register("quantity", { valueAsNumber: true })}
          />
          {errors.quantity && (
            <p className="text-sm text-destructive">
              {errors.quantity.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pricePerUnit">Price per Unit</Label>
          <Input
            type="number"
            step="0.01"
            id="pricePerUnit"
            {...register("pricePerUnit", { valueAsNumber: true })}
          />
          {errors.pricePerUnit && (
            <p className="text-sm text-destructive">
              {errors.pricePerUnit.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input type="date" id="expiryDate" {...register("expiryDate")} />
          {errors.expiryDate && (
            <p className="text-sm text-destructive">
              {errors.expiryDate.message}
            </p>
          )}
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/pharmacy/drugs")}
        >
          Cancel
        </Button>
        <Button disabled={isLoading} type="submit">
          Add Drug
        </Button>
      </div>
    </form>
  );
}
