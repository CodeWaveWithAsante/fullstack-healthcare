interface TableProps {
  columns: { header: string; key: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}

export const Table = ({ columns, renderRow, data }: TableProps) => {
  return (
    <table className="w-full mt-4">
      <thead>
        <tr className="text-left text-sm lg:uppercase">
          {columns?.map((col) => (
            <th key={col.key} className={col?.className}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.length < 1 && (
          <tr className="">
            <td className="text-gray-400 text-base py-10">No Data found</td>
          </tr>
        )}

        {data?.length > 0 &&
          data?.map((item, id) => renderRow({ ...item, index: id }))}
      </tbody>
    </table>
  );
};
