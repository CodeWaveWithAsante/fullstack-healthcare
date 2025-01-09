import { LucideLoader } from "lucide-react";

export const Loader = ({ size = 24 }: { size?: number }) => {
  return (
    <div className="flex items-center w-full justify-center flex-col">
      <LucideLoader
        size={size}
        className="animate-spin text-xl text-blue-600"
      />
      <p className="text-sm text0gray-500">Loading, please wait...</p>
    </div>
  );
};
