import { ActionOptions, ViewAction } from "@/components/action-options";
import ActionDialog from "@/components/dialogs/action-dialog";
import { Pagination } from "@/components/pagination";
import { ProfileImage } from "@/components/profile-image";
import SearchInput from "@/components/search-input";
import { Table } from "@/components/tables/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SearchParamsProps } from "@/types";
import { formatDate, formatPhoneNumber } from "@/utils";
import { checkRole, getRole } from "@/utils/roles";
import { getPaymentRecords } from "@/utils/services/bills";
import { DATA_LIMIT } from "@/utils/settings";
import { auth } from "@clerk/nextjs/server";
import { Payment } from "@prisma/client";
import { ListFilter, ReceiptText } from "lucide-react";

const columns = [
  {
    header: "RNO",
    key: "id",
  },
  {
    header: "Patient",
    key: "info",
    className: "",
  },
  {
    header: "Contact",
    key: "phone",
    className: "hidden md:table-cell",
  },
  {
    header: "Bill Date",
    key: "bill_date",
    className: "hidden md:table-cell",
  },
  {
    header: "Total",
    key: "total",
    className: "hidden xl:table-cell",
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
    header: "Status",
    key: "status",
    className: "hidden xl:table-cell",
  },
  {
    header: "Actions",
    key: "action",
  },
];

interface ExtendedPayment extends Payment {
  patient: {
    first_name: string;
    last_name: string;
    phone: string;
    gender: string;
    img: string;
  };
}

const BillingRecords = async (props: SearchParamsProps) => {
  const searchParams = await props.searchParams;
  const page = (searchParams?.p || "1") as string;
  const searchQuery = (searchParams?.q || "") as string;
  const { userId } = await auth();
  const userRole = await getRole();
  const isAdmin = await checkRole("ADMIN");

  const { data, totalRecord, totalPages, currentPage } =
    await getPaymentRecords({
      page,
      limit: DATA_LIMIT,
      search: searchQuery,
    });

  const renderRow = (item: ExtendedPayment) => {
    const name = item?.patient?.first_name + " " + item?.patient?.last_name;

    return (
      <tr
        key={item?.id + name}
        className="border-b border-gray-200 dark:border-gray-800 even:bg-blue-50  dark:even:bg-transparent text-sm hover:bg-slate-50 dark:hover:bg-gray-900 cursor-pointer"
      >
        <td className="">#{item?.id}</td>

        <td className="flex items-center gap-2 2xl:gap-4 py-2 xl:py-4">
          <ProfileImage
            url={item?.patient?.img!}
            name={name}
            className="hidden md:flex"
          />
          <div>
            <h3 className="font-medium">{name.toUpperCase()}</h3>
            <span className="text-xs capitalize hidden md:flex">
              {item?.patient?.gender.toLowerCase()}
            </span>
          </div>
        </td>

        <td className="hidden md:table-cell lowercase">
          {formatPhoneNumber(item?.patient?.phone)}
        </td>
        <td className="hidden  items-center py-2  md:table-cell">
          {formatDate(item?.bill_date)}
        </td>
        <td className="hidden xl:table-cell">
          {item?.total_amount.toFixed(2)}
        </td>
        <td className="hidden xl:table-cell text-yellow-600">
          {item?.discount.toFixed(2)}
        </td>
        <td className="hidden xl:table-cell">
          {(item?.total_amount - item?.discount).toFixed(2)}
        </td>
        <td className="hidden xl:table-cell text-emerald-600">
          {item?.amount_paid.toFixed(2)}
        </td>

        <td className="hidden xl:table-cell">
          <span
            className={cn(
              item?.status === "UNPAID"
                ? "text-red-600"
                : item?.status === "PAID"
                ? "text-emerald-600"
                : ""
            )}
          >
            {item?.status}
          </span>
        </td>

        <td className="">
          <div className="flex items-center">
            <ViewAction
              href={`appointments/${item?.appointment_id}?cat=bills`}
              disabled={
                userRole === "admin" ? false : userId !== item?.patient_id
              }
            />
            <Button
              disabled={item?.patient_id !== userId || userRole !== "cashier"}
              variant="ghost"
              className="flex items-center gap-2 justify-start  text-gray-600 text-sm font-light"
            >
              Pay
            </Button>

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
          <ReceiptText size={20} className="text-gray-500" />
          <p className="text-2xl font-semibold">{totalRecord ?? 0}</p>
          <span className="text-gray-600 text-sm xl:text-base">
            total records
          </span>
        </div>

        <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
          <SearchInput />
        </div>
      </div>

      <div className="mt-6">
        <Table columns={columns} renderRow={renderRow} data={data!} />

        {data?.length !== 0 && (
          <Pagination
            totalRecords={totalRecord!}
            currentPage={currentPage!}
            totalPages={totalPages!}
            limit={DATA_LIMIT}
          />
        )}
      </div>
    </Card>
  );
};

export default BillingRecords;
