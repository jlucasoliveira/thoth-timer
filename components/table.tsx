"use client";

import { useSearchParams } from "next/navigation";
import {
  type ColumnDef,
  flexRender,
  getSortedRowModel,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table as TableUI,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/pagination";

type TableProps<T> = {
  data: T[];
  title?: string;
  columns: ColumnDef<T>[];
  enableRowSelection?: boolean;
  onRowSelectionChange?: (row: T) => void;
  debug?: boolean;
  pages: number;
  filtersContext?: string;
  forceScroll?: boolean;
};

export function Table<T>(props: TableProps<T>) {
  const searchParams = useSearchParams();
  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    enableSortingRemoval: true,
    enableMultiSort: true,
    debugTable: props.debug,
  });

  return (
    <>
      <div className="flex flex-grow">
        <TableUI>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={props.columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableUI>
      </div>
      <Pagination
        page={Number(searchParams.get("page")) || 1}
        pages={props.pages}
      />
    </>
  );
}
