import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Control } from "react-hook-form";
import { Checkbox } from "./ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";

interface CustomInputProps {
  type: "input" | "select" | "checkbox" | "switch" | "radio" | "textarea";
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  inputType?: "text" | "email" | "password" | "date";
  selectList?: { label: string; value: string }[];
  defaultValue?: string;
}

const RenderInput = ({
  field,
  props,
}: {
  field: any;
  props: CustomInputProps;
}) => {
  switch (props.type) {
    case "input":
      return (
        <FormControl>
          <Input
            type={props.inputType}
            placeholder={props.placeholder}
            {...field}
          />
        </FormControl>
      );
    case "select":
      return (
        <Select onValueChange={field.onChange} value={field?.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {props.selectList?.map((i, id) => (
              <SelectItem key={id} value={i.value}>
                {i.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "radio":
      return (
        <div className="w-full">
          <FormLabel>{props.label}</FormLabel>
          <RadioGroup
            defaultValue={props.defaultValue}
            onChange={field.onChange}
            className="flex gap-4"
          >
            {props?.selectList?.map((i, id) => (
              <div className="flex items-center w-full" key={id}>
                <RadioGroupItem
                  value={i.value}
                  id={i.value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={i.value}
                  className="flex flex-1 items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:text-blue-600"
                >
                  {i.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );

    case "switch":
      return (
        <div className="">
          {props?.selectList?.map((i, id) => (
            <div
              className="w-full flex items-center space-x-3 border-t border-t-gray-200 py-5"
              key={id}
            >
              <Switch
                id={i.value}
                className="data-[state=checked]:bg-blue-600 peer"
                onChange={() => field.onChange}
              />
              <Label htmlFor={i.value} className="w-20">
                {i.label}
              </Label>

              {/* <div> */}
              <Label className="text-gray-400 font-normal italic peer-data-[state=checked]:hidden pl-10">
                Not working on this day
              </Label>

              <div className="hidden peer-data-[state=checked]:flex items-center gap-2 pl-6">
                <Input
                  name={`${props.name}."start_time"`}
                  type="time"
                  defaultValue="09:00"
                  onChange={() => {}}
                />
                <Input
                  name={`${props.name}."start_time"`}
                  type="time"
                  defaultValue="17:00"
                  onChange={() => field.onChange()}
                />
              </div>
            </div>
          ))}

          <pre>{JSON.stringify(field.values)}</pre>
        </div>
      );

    case "checkbox":
      return (
        <div className="items-top flex space-x-2">
          <Checkbox
            id={props.name}
            onCheckedChange={(e) => field.onChange(e === true || null)}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor={props.name}
              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {props.label}
            </label>
            <p className="text-sm text-muted-foreground">{props.placeholder}</p>
          </div>
        </div>
      );
    case "textarea":
      return (
        <FormControl>
          <Textarea
            type={props.inputType}
            placeholder={props.placeholder}
            {...field}
          ></Textarea>
        </FormControl>
      );
    default:
      break;
  }
};

export const CustomInput = (props: CustomInputProps) => {
  const { name, label, control, type } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {type !== "radio" && type !== "checkbox" && (
            <FormLabel>{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

type Day = {
  day: string;
  start_time?: string;
  close_time?: string;
};
interface SwitchProps {
  data: { label: string; value: string }[];
  setWorkSchedule: React.Dispatch<React.SetStateAction<Day[]>>;
  // workSchedule: Day[];
}

export const SwitchInput = ({ data, setWorkSchedule }: SwitchProps) => {
  const handleChange = (day: string, field: any, value: string) => {
    setWorkSchedule((prevDays) => {
      const dayExists = prevDays.find((d) => d.day === day);

      if (dayExists) {
        return prevDays.map((d) =>
          d.day === day ? { ...d, [field]: value } : d
        );
      } else {
        if (field === true) {
          return [
            ...prevDays,
            { day, start_time: "09:00", close_time: "17:00" },
          ];
        } else return [...prevDays, { day, [field]: value }];
      }
    });
  };

  return (
    <div className="">
      {data?.map((i, id) => (
        <div
          className="w-full flex items-center space-x-3 border-t border-t-gray-200 dark:border-gray-800 py-5"
          key={id}
        >
          <Switch
            id={i.value}
            className="data-[state=checked]:bg-blue-600 peer"
            onCheckedChange={(e) => handleChange(i.value, true, "09:00")}
          />
          <Label htmlFor={i.value} className="w-20">
            {i.label}
          </Label>

          {/* <div> */}
          <Label className="text-gray-400 font-normal italic peer-data-[state=checked]:hidden pl-10">
            Not working on this day
          </Label>

          <div className="hidden peer-data-[state=checked]:flex items-center gap-2 pl-6">
            <Input
              name={`${i.label}."start_time"`}
              type="time"
              defaultValue="09:00"
              onChange={(e) =>
                handleChange(i.value, "start_time", e.target.value)
              }
            />
            <Input
              name={`${i.label}."close_time"`}
              type="time"
              defaultValue="17:00"
              onChange={(e) =>
                handleChange(i.value, "close_time", e.target.value)
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
};
