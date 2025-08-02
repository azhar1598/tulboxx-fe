import React, { useCallback, useEffect, useMemo, useState } from "react";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { useDebouncedState } from "@mantine/hooks";
import callApi from "@/services/apiService";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";

export interface DataTableSortStatus<T> {
  columnAccessor: keyof T | string;
  direction: "asc" | "desc";
}

export interface DataTableColumn<T> {
  accessor: keyof T | string;
  title?: React.ReactNode;
  render?: (record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  textAlign?: "left" | "center" | "right";
  width?: string | number;
}

interface BaseRecord {
  id?: number | string;
  sequenceOrder?: number;
  Motifs?: any[];
}

interface SelectableProps<T> {
  selectedRecords: T[];
  onSelectedRecordsChange: (selectedRecords: T[]) => void;
  idAccessor?: string;
}

interface DataTableProps<T extends BaseRecord> {
  queryKey?: QueryKey;
  url?: string;
  columns: any;
  sortable?: boolean;
  pagination?: boolean;
  height?: string | number;
  search?: string;
  filters?: { [key: string]: string[] | string };
  operators?: { [key: string]: string };
  defaultSortedColumn?: string;
  defaultSortedColumnDirection?: "asc" | "desc";
  recordsPerPage?: number;
  noRecordsText?: string;
  selectable?: SelectableProps<T>;
  refetchInterval?: number;
  onRowClick?: (params: {
    event: React.MouseEvent<HTMLTableRowElement>;
    record: T;
    index: number;
  }) => void;
  onTotalCountChange?: (count: number) => void;
  minHeight?: number | null;
  setMetaData?: any;
  state?: any;
  setState?: (state: any) => void;
}

export interface TablePageInfo {
  totalRecords: number;
  recordsPerPage: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const CustomDataTable = <T extends BaseRecord>({
  queryKey: _queryKey,
  url,
  columns,
  sortable = false,
  pagination = false,
  search = "",
  filters = {},
  operators = {},
  defaultSortedColumn,
  defaultSortedColumnDirection,
  recordsPerPage = 10,
  noRecordsText = "No records found",
  selectable,
  refetchInterval,
  onRowClick,
  onTotalCountChange,
  setMetaData,
  setState,
  state,
}: DataTableProps<T>) => {
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
    columnAccessor: defaultSortedColumn ?? columns?.[0]?.accessor,
    direction: defaultSortedColumnDirection || "asc",
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(recordsPerPage);

  useEffect(() => {
    setLimit(recordsPerPage);
  }, [recordsPerPage]);

  const notification = usePageNotifications();

  const getSortByParam = useCallback(
    (sortStatus: DataTableSortStatus<T>): string[] => {
      if (!sortable || !sortStatus.columnAccessor) return null;
      const { columnAccessor, direction } = sortStatus;
      return [`${String(columnAccessor)}:${direction.toUpperCase()}`];
    },
    [sortable]
  );

  const [debouncedSearch, setDebouncedSearch] = useDebouncedState(search, 300);

  useEffect(() => {
    setDebouncedSearch(search);
  }, [search, setDebouncedSearch]);

  useEffect(() => {
    if (search.length > 1) setPage(1);
  }, [search]);

  const queryKey = useMemo(
    () => [
      ...(_queryKey || []),
      page,
      ...getSortByParam(sortStatus),
      debouncedSearch,
      filters,
      operators,
      limit,
    ],
    [
      _queryKey,
      debouncedSearch,
      filters,
      getSortByParam,
      operators,
      page,
      limit,
      sortStatus,
    ]
  );

  const constructFilterParams = (
    filters: { [key: string]: string[] | string },
    operators: { [key: string]: string }
  ) => {
    const params = new URLSearchParams();
    for (const key in filters) {
      const filterValue = filters[key];
      const operator = operators[key] || "$eq";

      if (
        !filterValue ||
        (Array.isArray(filterValue) && filterValue.length === 0)
      ) {
        continue;
      }

      if (Array.isArray(filterValue)) {
        params.append(`filter.${key}`, `${operator}:${filterValue.join(",")}`);
      } else if (typeof filterValue === "string") {
        if (filterValue.startsWith("$")) {
          params.append(`filter.${key}`, filterValue);
        } else {
          params.append(`filter.${key}`, `${operator}:${filterValue}`);
        }
      }
    }
    return params;
  };

  const {
    data: queryData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKey,
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      params.append("search", debouncedSearch);
      if (sortStatus.columnAccessor) {
        params.append(
          "sortBy",
          `${String(sortStatus.columnAccessor)}:${sortStatus.direction}`
        );
      }

      const filterParams = constructFilterParams(filters, operators);
      for (const [key, value] of filterParams.entries()) {
        params.append(key, value);
      }

      return callApi.get(`${url}`, { params });
    },
    refetchInterval,
  });

  const tableData = useMemo(() => queryData?.data ?? [], [queryData]);
  const tablePageInfo: TablePageInfo = queryData?.data?.metadata;

  useEffect(() => {
    if (isError) {
      notification.error(`Something went wrong`);
    }
  }, [isError, notification]);

  // Fixed: Split the useEffect and optimize dependencies
  const data = useMemo(() => tableData?.data ?? [], [tableData]);

  // Fixed: Handle setMetaData separately to avoid infinite loop
  useEffect(() => {
    if (setMetaData && tableData?.metadata) {
      const newMetaData = { ...state, metaData: tableData.metadata };
      // Only update if the metadata actually changed
      if (
        JSON.stringify(state?.metaData) !== JSON.stringify(tableData.metadata)
      ) {
        setMetaData(newMetaData);
      }
    }
  }, [setMetaData, tableData?.metadata]); // Removed 'state' from dependencies

  // Fixed: Handle setState separately
  useEffect(() => {
    if (setState && tablePageInfo) {
      setState({
        allRecords: tablePageInfo.totalRecords ?? 0,
        data: tableData?.data ?? [],
      });
    }
  }, [setState, tablePageInfo?.totalRecords, tableData?.data]);

  useEffect(() => {
    if (onTotalCountChange && tablePageInfo?.totalRecords !== undefined) {
      onTotalCountChange(tablePageInfo.totalRecords);
    }
  }, [onTotalCountChange, tablePageInfo?.totalRecords]);

  const handleSelectAll = (checked: boolean) => {
    selectable?.onSelectedRecordsChange(checked ? data : []);
  };

  const handleSelectRow = (record: T, checked: boolean) => {
    selectable?.onSelectedRecordsChange(
      checked
        ? [...selectable.selectedRecords, record]
        : selectable.selectedRecords.filter((r) => r.id !== record.id)
    );
  };

  const isAllSelected =
    selectable &&
    selectable.selectedRecords.length === data.length &&
    data.length > 0;
  const isIndeterminate =
    selectable && selectable.selectedRecords.length > 0 && !isAllSelected;

  const defaultRecordText =
    Object.values(filters).every((f) => !f?.length) && search === ""
      ? noRecordsText
      : "No Records Found.";

  return (
    <div className="bg-slate-50/70 p-1 sm:p-2 lg:p-4 rounded-xl">
      <div className="overflow-x-auto">
        <table
          className="w-full text-sm border-separate"
          style={{ borderSpacing: "0 1rem" }}
        >
          <thead className="hidden md:table-header-group">
            <tr>
              {/* {selectable && (
                <th className="p-4 w-4 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800 cursor-pointer"
                    checked={isAllSelected}
                    ref={(el) => el && (el.indeterminate = isIndeterminate)}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )} */}
              {columns.map((column) => (
                <th
                  key={String(column.accessor)}
                  className={`px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ${
                    sortable && column.sortable
                      ? "cursor-pointer hover:text-gray-700 transition-colors"
                      : ""
                  }`}
                  style={{ width: column.width }}
                  onClick={() => {
                    if (sortable && column.sortable) {
                      const direction =
                        sortStatus.columnAccessor === column.accessor &&
                        sortStatus.direction === "asc"
                          ? "desc"
                          : "asc";
                      setSortStatus({
                        columnAccessor: String(column.accessor),
                        direction,
                      });
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    {column.title}
                    {sortable && column.sortable && (
                      <span className="text-gray-400">
                        {sortStatus.columnAccessor === column.accessor ? (
                          sortStatus.direction === "asc" ? (
                            <ArrowUp size={14} className="text-gray-800" />
                          ) : (
                            <ArrowDown size={14} className="text-gray-800" />
                          )
                        ) : (
                          <ArrowUpDown size={14} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, i) => (
                <tr key={i} className="bg-white rounded-xl shadow-sm">
                  <td className="px-6 py-4 rounded-l-xl">
                    <div className="h-5 w-5 bg-gray-200 rounded-md animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 rounded-r-xl">
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="text-center p-16"
                >
                  <div className="flex flex-col items-center gap-6">
                    <div className="bg-blue-800 p-4 rounded-full">
                      <Inbox
                        className="h-10 w-10 text-blue-800"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-gray-600 font-medium text-base">
                      {defaultRecordText}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr
                  key={record.id ?? index}
                  className={`bg-white rounded-xl shadow-sm transition-all duration-300 ease-in-out border border-transparent hover:shadow-lg hover:ring-offset-slate-50 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={(e) => onRowClick?.({ event: e, record, index })}
                >
                  {selectable && (
                    <td className="px-4 py-5 rounded-l-xl align-middle">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800 cursor-pointer"
                        checked={selectable.selectedRecords.some(
                          (r) => r.id === record.id
                        )}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(record, e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td
                      key={String(column.accessor)}
                      className={`px-6 py-5 align-middle ${
                        colIndex === columns.length - 1 ? "rounded-r-xl" : ""
                      } ${colIndex === 0 && !selectable ? "rounded-l-xl" : ""}`}
                    >
                      <div className="md:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                        {column.title as string}
                      </div>
                      <div
                        className={
                          colIndex === 0
                            ? "text-base font-semibold text-gray-900"
                            : "text-sm text-gray-600"
                        }
                      >
                        {column.render
                          ? column.render(record, index)
                          : (record[column.accessor] as React.ReactNode)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination && tablePageInfo && tablePageInfo.totalRecords > 0 && (
        <div className="p-4 flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {tablePageInfo.totalRecords > 0 ? (page - 1) * limit + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-800">
              {Math.min(page * limit, tablePageInfo.totalRecords)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {tablePageInfo.totalRecords}
            </span>{" "}
            results
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-800 focus:border-blue-800 shadow-sm transition-all"
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: tablePageInfo.totalPages },
                  (_, i) => i + 1
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-md text-sm font-semibold transition-all duration-200 ${
                      p === page
                        ? "bg-[#182a4d] text-white shadow-lg scale-105"
                        : "bg-white hover:bg-gray-100 text-gray-700 shadow-sm border border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(page + 1)}
                disabled={
                  page === tablePageInfo.totalPages ||
                  tablePageInfo.totalRecords === 0
                }
                className="p-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDataTable;
