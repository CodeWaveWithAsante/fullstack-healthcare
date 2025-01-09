import { cn } from "@/lib/utils";

export const SmallCard = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div className="w-full md:w-1/3">
    <span className="text-sm text-gray-500">{label}</span>
    <p className={cn(className, "text-sm md:text-base")}>{value}</p>
  </div>
);
