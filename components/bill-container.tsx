import db from "@/lib/db";
import { calculateDiscount, formatDate } from "@/utils";
import { checkRole } from "@/utils/roles";
import { PatientBills } from "@prisma/client";
import { ReceiptText } from "lucide-react";
import ActionDialog from "./dialogs/action-dialog";
import { AddBills } from "./dialogs/add-bills";
import { GenerateFinalBills } from "./dialogs/generate-final-bill";
import { Table } from "./tables/table";
import { SelectSeparator } from "./ui/select";

const columns = [
  {
    header: "No",
    key: "no",
    className: "hidden md:table-cell",
  },
  {
    header: "Service",
    key: "service",
  },
  {
    header: "Date",
    key: "date",
    className: "",
  },
  {
    header: "Quantity",
    key: "qnty",
    className: "hidden md:table-cell",
  },
  {
    header: "Unit Price",
    key: "price",
    className: "hidden md:table-cell",
  },
  {
    header: "Total Cost",
    key: "total",
    className: "",
  },
  {
    header: "Action",
    key: "action",
    className: "hidden xl:table-cell",
  },
];

interface BillProps {
  id: number | string;
}

interface ExtendedBillProps extends PatientBills {
  service: {
    service_name: string;
  };
}
export const BillsContainer = async ({ id }: BillProps) => {
  const data = await db.payment.findFirst({
    where: {
      appointment_id: Number(id),
    },
    include: {
      bills: {
        include: {
          service: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { service_date: "asc" },
      },
    },
  });
  const servicesData = await db.services.findMany();
  let totalBill = 0;

  const billData = data?.bills || [];
  if (billData) {
    totalBill = billData.reduce((a, b) => a + b.total_cost, 0);
  }
  const discount = data
    ? calculateDiscount({
        amount: data?.total_amount || totalBill,
        discount: data?.discount,
      })
    : null;

  const renderRow = (item: ExtendedBillProps) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
      >
        <td className="hidden md:table-cell py-2 xl:py-6"># {item?.id}</td>

        <td className="items-center py-2">{item?.service?.service_name}</td>

        <td className="">{formatDate(item?.service_date)}</td>

        <td className="hidden items-center py-2  md:table-cell">
          {item?.quantity}
        </td>
        <td className="hidden lg:table-cell">{item?.unit_cost.toFixed(2)}</td>
        <td>{item?.total_cost.toFixed(2)}</td>

        <td className="hidden xl:table-cell">
          <ActionDialog
            type="delete"
            id={item?.id.toString()}
            deleteType="bill"
          />
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl p-2 2xl:p-4">
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="">
            <h1 className="font-semibold text-xl">Patient Bills</h1>
            <div className="hidden lg:flex items-center gap-1">
              <ReceiptText size={20} className="text-gray-500" />
              <p className="text-2xl font-semibold">{billData?.length}</p>
              <span className="text-gray-600 text-sm xl:text-base">
                total records
              </span>
            </div>
          </div>

          {((await checkRole("ADMIN")) || (await checkRole("DOCTOR"))) && (
            <div className="flex items-center mt-5 justify-end">
              <AddBills id={data?.id} appId={id} servicesData={servicesData} />

              <GenerateFinalBills id={data?.id} total_bill={totalBill} />
            </div>
          )}
        </div>

        <Table columns={columns} renderRow={renderRow} data={billData!} />

        <SelectSeparator className="mt-16" />
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between md:text-center py-2 space-y-6">
          <div className="w-[120px]">
            <span className="text-gray-500">Total Bill</span>
            <p className="text-xl font-semibold">
              {(data?.total_amount || totalBill).toFixed(2)}
            </p>
          </div>
          <div className="w-[120px]">
            <span className="text-gray-500">Discount</span>
            <p className="text-xl font-semibold text-yellow-600">
              {(data?.discount || 0.0).toFixed(2)}{" "}
              <span className="text-sm text-gray-600">
                {" "}
                ({discount?.discountPercentage?.toFixed(2) || "0.0"}%)
              </span>
            </p>
          </div>
          <div className="w-[120px]">
            <span className="text-gray-500">Payable</span>
            <p className="text-xl font-semibold ">
              {(discount?.finalAmount || 0.0).toFixed(2)}
            </p>
          </div>
          <div className="w-[120px]">
            <span className="text-gray-500">Amount Paid</span>
            <p className="text-xl font-semibold text-emerald-600">
              {(data?.amount_paid || 0.0).toFixed(2)}
            </p>
          </div>
          <div className="w-[120px]">
            <span className="text-gray-500">Unpaid Amount</span>
            <p className="text-xl font-semibold text-red-600">
              {(discount?.finalAmount! - data?.amount_paid! || 0.0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
