import React from "react";
import { Table } from "./tables/table";
import db from "@/lib/db";
import { Payment } from "@prisma/client";
import { formatDate } from "@/utils";
import { ViewAction } from "./action-options";
import ActionDialog from "./dialogs/action-dialog";
import { checkRole } from "@/utils/roles";
import { Card } from "./ui/card";

interface DataProps {
  patientId: string;
}

const columns = [
  {
    header: "No",
    key: "id",
  },
  {
    header: "Bill Date",
    key: "bill_date",
    className: "",
  },
  {
    header: "Payment Date",
    key: "pay_date",
    className: "hidden md:table-cell",
  },
  {
    header: "Total",
    key: "total",
    className: "",
  },
  {
    header: "Discount",
    key: "discount",
    className: "hidden xl:table-cell",
  },
  {
    header: "Payable",
    key: "payable",
    className: "hidden xl:table-cell",
  },
  {
    header: "Paid",
    key: "payable",
    className: "hidden xl:table-cell",
  },
  {
    header: "Actions",
    key: "action",
  },
];

export const Payments = async ({ patientId }: DataProps) => {
  const data = await db.payment.findMany({
    where: { patient_id: patientId },
  });
  const isAdmin = await checkRole("ADMIN");

  if (!data) return null;

  const renderRow = (item: Payment) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 dark:border-gray-800 even:bg-blue-50  dark:even:bg-transparent text-sm hover:bg-slate-50 dark:hover:bg-gray-900"
      >
        <td className="flex items-center gap-2 md:gap-4 py-2 xl:py-4">
          #{item?.id}
        </td>

        <td className="lowercase">{formatDate(item?.bill_date)}</td>
        <td className="hidden  items-center py-2  md:table-cell">
          {formatDate(item?.payment_date)}
        </td>
        <td className="">{item?.total_amount.toFixed(2)}</td>
        <td className="hidden xl:table-cell">{item?.discount.toFixed(2)}</td>
        <td className="hidden xl:table-cell">
          {(item?.total_amount - item?.discount).toFixed(2)}
        </td>
        <td className="hidden xl:table-cell">{item?.amount_paid.toFixed(2)}</td>

        <td className="">
          <div className="flex items-center">
            <ViewAction
              href={`/record/appointments/${item?.appointment_id}?cat=bills`}
            />
            {isAdmin && (
              <ActionDialog
                type="delete"
                deleteType="payment"
                id={item?.id.toString()}
              />
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <Card className="rounded-xl p-2 md:p-4 2xl:p-6">
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-1">
          <p className="text-2xl font-semibold">{data?.length ?? 0}</p>
          <span className="text-gray-600 text-sm xl:text-base">
            total records
          </span>
        </div>
      </div>

      <div className="mt-6">
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>
    </Card>
  );
};
