import { cn } from "@/lib/utils";
import { AppointmentStatus, Status } from "@prisma/client";

const status_color = {
  PENDING: "bg-yellow-600/15 text-yellow-600",
  SCHEDULED: "bg-emerald-600/15 text-emerald-600",
  CANCELLED: "bg-red-600/15 text-red-600",
  COMPLETED: "bg-blue-600/15 text-blue-600",
};

interface StatusProps {
  status: AppointmentStatus;
}
export const AppointmentStatusIndicator = ({ status }: StatusProps) => {
  return (
    <p
      className={cn(
        "w-fit px-2 py-1 rounded-full capitalize text-xs lg:text-sm",
        status_color[status]
      )}
    >
      {status}
    </p>
  );
};

const user_status_color = {
  DORMANT: "bg-gray-600/110 text-gray-600",
  INACTIVE: "bg-red-600/15 text-red-600",
  ACTIVE: "bg-blue-600/15 text-blue-600",
};

interface UserStatusProps {
  status: Status;
}
export const UserStatus = ({ status }: UserStatusProps) => {
  return (
    <p
      className={cn(
        "w-fit px-2 py-1 rounded-full capitalize",
        user_status_color[status]
      )}
    >
      {status}
    </p>
  );
};

const bill_status = {
  unpaid: "bg-rose-600/10 text-rose-600",
  paid: "bg-emerald-600/15 text-emerald-600",
  "partially paid": "bg-blue-600/15 text-blue-600",
};

interface PaymentStatusProps {
  status: "paid" | "unpaid" | "partially paid";
}
export const PaymentStatus = ({ status }: PaymentStatusProps) => {
  return (
    <p
      className={cn(
        "w-fit px-2 py-1 rounded-full capitalize",
        bill_status[status]
      )}
    >
      {status}
    </p>
  );
};
