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

  const defaultRecordText = useMemo(() => {
    if (isLoading) {
      return "Loading...";
    }
    if (data.length === 0) {
      if (Object.values(filters).every((f) => !f?.length) && search === "") {
        return "No data available.";
      } else {
        return "No records found.";
      }
    }
    return "";
  }, [filters, search, data.length, isLoading]);

  return (
    <div className="bg-slate-50/70 p-1 sm:p-2 lg:p-4 rounded-xl">
      {/* Mobile View - Card Layout */}
      <div className="block md:hidden">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: Math.min(limit, 5) }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 shadow-sm animate-pulse"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-5 w-32 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <img
                src="/assets/no-data.svg"
                alt="No records illustration"
                className="w-32 h-32 opacity-60"
              />
              <span className="text-gray-600 font-medium text-sm">
                {defaultRecordText}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((record, index) => {
              // Find the actions column
              const actionsColumn = columns.find(
                (col: any) => col.accessor === "actions"
              );
              const nameColumn = columns.find(
                (col: any) => col.accessor === "name"
              );

              return (
                <div
                  key={record.id ?? index}
                  className={`bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
                    onRowClick ? "cursor-pointer active:scale-[0.98]" : ""
                  }`}
                  onClick={(e) =>
                    onRowClick?.({
                      event: e as React.MouseEvent<HTMLTableRowElement>,
                      record,
                      index,
                    })
                  }
                >
                  {/* Header with name and action */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-gray-50/50">
                    <div className="flex-1 min-w-0">
                      {nameColumn?.render ? (
                        <div className="text-base font-semibold text-gray-900 truncate">
                          {nameColumn.render(record, index)}
                        </div>
                      ) : (
                        <div className="text-base font-semibold text-gray-900 truncate">
                          {record[nameColumn?.accessor] as React.ReactNode}
                        </div>
                      )}
                    </div>
                    {actionsColumn && (
                      <div
                        className="ml-3 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {actionsColumn.render(record, index)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {columns
                      .filter(
                        (col: any) =>
                          col.accessor !== "name" && col.accessor !== "actions"
                      )
                      .map((column: any) => (
                        <div
                          key={String(column.accessor)}
                          className="flex items-start gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                              {typeof column.title === "string"
                                ? column.title
                                : "Info"}
                            </div>
                            <div className="text-sm text-gray-900">
                              {column.render
                                ? column.render(record, index)
                                : (record[
                                    column.accessor
                                  ] as React.ReactNode) || "N/A"}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Selection checkbox if selectable */}
                  {selectable && (
                    <div className="px-4 pb-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectable.selectedRecords.some(
                            (r) => r.id === record.id
                          )}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(record, e.target.checked);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-sm text-gray-600">
                          Select this item
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop/Tablet View - Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table
          className="w-full text-sm border-separate"
          style={{ borderSpacing: "0 1rem" }}
        >
          <thead>
            <tr>
              {selectable && (
                <th className="p-4 w-4 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = isIndeterminate;
                      }
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              {columns.map((column: any) => (
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
                  {selectable && (
                    <td className="px-4 py-4 rounded-l-xl">
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  )}
                  {columns.map((column: any, colIndex: number) => (
                    <td
                      key={String(column.accessor)}
                      className={`px-6 py-4 ${
                        colIndex === 0 && !selectable ? "rounded-l-xl" : ""
                      } ${
                        colIndex === columns.length - 1 ? "rounded-r-xl" : ""
                      }`}
                    >
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="text-center p-16"
                >
                  <div className="flex flex-col items-center gap-6">
                    <img
                      src="/assets/no-data.svg"
                      alt="No records illustration"
                      className="w-40 h-40 opacity-60"
                    />
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
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
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
                  {columns.map((column: any, colIndex: number) => (
                    <td
                      key={String(column.accessor)}
                      className={`px-6 py-5 align-middle ${
                        colIndex === columns.length - 1 ? "rounded-r-xl" : ""
                      } ${colIndex === 0 && !selectable ? "rounded-l-xl" : ""}`}
                    >
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

      {/* Pagination */}
      {pagination && tablePageInfo && tablePageInfo.totalRecords > 0 && (
        <div className="mt-4 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg border border-gray-100">
          <div className="text-sm text-gray-600 text-center sm:text-left">
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
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Rows:
              </span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                {/* Show fewer pages on mobile */}
                {Array.from(
                  {
                    length: Math.min(
                      tablePageInfo.totalPages,
                      window.innerWidth < 640 ? 3 : 7
                    ),
                  },
                  (_, i) => {
                    const totalPages = tablePageInfo.totalPages;
                    const maxVisible = window.innerWidth < 640 ? 3 : 7;
                    let start = Math.max(1, page - Math.floor(maxVisible / 2));
                    let end = Math.min(totalPages, start + maxVisible - 1);

                    if (end - start + 1 < maxVisible) {
                      start = Math.max(1, end - maxVisible + 1);
                    }

                    return start + i;
                  }
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md text-xs sm:text-sm font-semibold transition-all duration-200 ${
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
