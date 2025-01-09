"use client";

import {
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
import { MedicalRecords } from "@prisma/client";
import { UseFormReturn } from "react-hook-form";

interface PatientInfoSectionProps {
  form: UseFormReturn<any>;
  data: MedicalRecords[];
}

export const PatientInfoSection = ({ form, data }: PatientInfoSectionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="recordId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Medical ID</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Id" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data.map((record) => (
                  <SelectItem key={record.id} value={record.id.toString()}>
                    #
                    {record.id +
                      " | " +
                      new Date(record?.created_at).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter patient name" {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter patient ID" {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input placeholder="Enter age" {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  {/* <SelectItem value="other">Other</SelectItem> */}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
