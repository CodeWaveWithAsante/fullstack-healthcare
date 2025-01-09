import { ApplyLeave } from "@/components/forms/apply-leave";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";

const page = async () => {
  const { userId } = await auth();
  const data = await db.leave.findMany({
    where: { userId: userId! },
  });

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <Badge variant={"outline"} className={variants[status.toLowerCase()]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Leave</CardTitle>

          <ApplyLeave />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((request) => (
                <TableRow key={request.id}>
                  <TableCell># {request.id}</TableCell>
                  <TableCell>
                    {format(request.startDate, "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>{format(request.endDate, "yyyy-MM-dd")}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
