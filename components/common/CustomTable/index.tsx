import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  DataTable,
  DataTableSortStatus,
  DataTableColumn,
  DataTableProps as MantineDatatableProps,
} from "mantine-datatable";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { useDebouncedState } from "@mantine/hooks";
import { Group, Text, Radio, TableTd, Stack, Box } from "@mantine/core";
import classes from "./customtable.module.css";

import Image from "next/image";

// import classes from "./CustomDataTable.module.css";
// import asc from "@public/icons/ps-icon-sort.svg";
// import dsc from "@public/icons/ps-icon-sort.svg";
// import psIconGrabSort from "@public/icons/ps-icon-grab-sort.svg";
import callApi from "@/services/apiService";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { SortAsc, SortDesc } from "lucide-react";

interface BaseRecord {
  id?: number;
  sequenceOrder?: number;
  Motifs?: any[];
}

interface SelectableProps<T> {
  selectedRecords: T[];
  onSelectedRecordsChange: (selectedRecords: T[]) => void;
  idAccessor?: string;
}

interface DataTableProps<T extends BaseRecord> {
  disabledRowClass?: string;
  queryKey?: QueryKey;
  url?: string;
  data?: T[];
  columns: any[];
  sortable?: boolean;
  pagination?: boolean;
  draggable?: boolean | { draggableUrl: string };
  height?: string | number;
  search?: string;
  filters?: { [key: string]: string[] };
  operators?: { [key: string]: string };
  defaultSortedColumn?: string;
  defaultSortedColumnDirection?: "asc" | "desc";
  recordsPerPage?: number;
  noRecordsText?: string;
  toolTiplabel?: string;
  isRecordSelectable?: (record: T) => boolean;
  rowColor?: any;
  rowClassName?: any;
  rowStyle?: any;
  selectable?: SelectableProps<T>;
  withCheckboxes?: boolean;
  checkedRecords?: BaseRecord[];
  onCheckedRecordsChange?: (records: BaseRecord[]) => void;
  isCheckboxDisabled?: (record: BaseRecord) => boolean;
  withRadio?: boolean;
  keyName?: string | undefined;
  showPreviousBorder?: boolean;
  refetchInterval?: number;
  selectedRecord?: T | null;
  onSelectedRecordChange?: (record: T | null) => void;
  setState?: (state: any) => void;
  onRowClick?: (params: {
    event: React.MouseEvent;
    record: T;
    index: number;
  }) => void;
  onTotalCountChange?: (count: number) => void;
  minHeight?: number | null;
  setMetaData?: any;
  state?: any;
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
  isRecordSelectable,
  rowColor,
  queryKey: _queryKey,
  url,
  columns,
  sortable = false,
  pagination = false,
  height,
  search = "",
  filters = {},
  operators = {},
  defaultSortedColumn,
  defaultSortedColumnDirection,
  showPreviousBorder,
  recordsPerPage = 10,
  noRecordsText,
  rowClassName,
  selectable,
  refetchInterval,
  toolTiplabel: toolTipLabel,
  minHeight = 600,
  rowStyle,
  onRowClick,
  setState,
  onTotalCountChange,
  setMetaData,
  state,
}: DataTableProps<T>) => {
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
    columnAccessor: defaultSortedColumn ?? columns?.[0]?.accessor,
    direction: defaultSortedColumnDirection || "asc",
  });

  const [data, setData] = useState<T[]>([]);

  const [page, setPage] = useState(1);

  const notification = usePageNotifications();

  const getSortByParam = useCallback(
    (sortStatus: DataTableSortStatus<T>): string[] => {
      if (!sortable) return null;
      const { columnAccessor, direction } = sortStatus;
      const accessor = String(columnAccessor);
      return [`${accessor}:${direction.toUpperCase()}`];
    },
    [sortable]
  );

  const [debouncedSearch, setDebouncedSearch] = useDebouncedState(search, 200, {
    leading: true,
  });

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
      recordsPerPage,
    ],
    [
      _queryKey,
      debouncedSearch,
      filters,
      getSortByParam,
      operators,
      page,
      recordsPerPage,
      sortStatus,
    ]
  );

  function getFilter(rawFilter: string): string {
    const arr = rawFilter.split(":");

    let filter = arr.pop() as string;
    const operator = arr.join(":"); // in case of chained filters

    if (filter.startsWith("$")) return operator + filter;

    return operator + ":" + filter;
  }

  function constructFilterParams(
    filters: { [key: string]: string[] | string },
    operators: { [key: string]: string }
  ) {
    const filterParams: Record<string, string> = {};

    for (const key in filters) {
      let filter = filters[key];
      let operator = operators[key] || "$eq";

      if (!filter?.length) continue;

      if (Array.isArray(filter)) {
        const hasCustomOperator = filter.some((value) => value.startsWith("$"));

        if (!hasCustomOperator) {
          if (filter.length > 1) {
            operator = "$in";
          }

          filterParams[`filter.${key}`] = `${operator}:${filter.join(",")}`;
          continue;
        }

        filter.forEach((val, index) => {
          filterParams[`filter.${key}[${index}]`] = `$or:${getFilter(val)}`;
        });

        continue;
      }

      const hasCustomOperator =
        filter.startsWith("$") && filter.split(":").length > 1;

      filterParams[`filter.${key}`] = hasCustomOperator
        ? getFilter(filter)
        : filter;
    }

    return filterParams;
  }

  const {
    data: queryData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKey,
    queryFn: () => {
      const params = new URLSearchParams();

      params.append("page", page.toString());
      params.append("pageSize", recordsPerPage.toString());
      params.append("search", search);
      params.append(
        "sortBy",
        `${String(sortStatus.columnAccessor)}:${sortStatus.direction}`
      );
      const response = callApi.get(`${url}`, {
        params,
      });
      console.log("response", response);
      return response;
    },
    refetchInterval,

    // callApi
    //   .get(`/${url}`, {
    //     params: {
    //       page,
    //       limit: recordsPerPage,
    //       // sortBy: getSortByParam(sortStatus),
    //       search: search.includes("%")
    //         ? encodeURIComponent(search.trimStart())
    //         : search.trimStart(),
    //       ...constructFilterParams(filters, operators),
    //     },
    //   })
  });

  const tableData = useMemo(() => {
    return queryData?.data ?? [];
  }, [queryData]);
  const tablePageInfo: TablePageInfo = queryData?.data?.metadata;

  useEffect(() => {
    if (isError) {
      notification.error(`something went wrong`);
    }
  }, [isError, recordsPerPage, debouncedSearch]);

  console.log("tablePageInfo", tableData, tablePageInfo);

  useEffect(() => {
    setData(tableData?.data ?? []);
    setMetaData({ ...state, metaData: tableData?.metadata ?? {} });
    if (!setState) return;
    setState({
      allRecords: tablePageInfo?.totalRecords ?? 0,
    });
  }, [tableData]);

  useEffect(() => {
    if (onTotalCountChange && tablePageInfo?.totalRecords !== undefined) {
      onTotalCountChange(tablePageInfo.totalRecords);
    }
  }, [onTotalCountChange, tablePageInfo?.totalRecords]);

  const sortableProps = sortable
    ? {
        sortStatus: sortStatus,
        onSortStatusChange: (status: DataTableSortStatus<T>) => {
          setPage(1);
          setSortStatus(status);
        },
      }
    : {};

  const paginationProps = pagination
    ? {
        totalRecords: tablePageInfo?.totalRecords ?? 0,
        recordsPerPage: recordsPerPage,
        page: page,
        onPageChange: (pageNo: number) => {
          if (pageNo > 0) setPage(pageNo);
        },
        paginationSize: "lg" as const,
        paginationText: ({
          from,
          to,
          totalRecords,
        }: {
          from: number;
          to: number;
          totalRecords: number;
        }) => (
          <Stack gap={10}>
            {showPreviousBorder && (
              <Group gap={10} align="center" p={"0 10px"}>
                <Box
                  w={8}
                  h={20}
                  style={{ borderRadius: 2 }}
                  bg={"#6271DD"}
                ></Box>
                <Text size="sm" c={"#182A4D"}>
                  Previously Shared
                </Text>
              </Group>
            )}
            <Text size="sm" c={"#8898a9"} p={"0 10px"}>
              Showing {from} to {to} of {totalRecords} records
            </Text>
          </Stack>
        ),
      }
    : {};

  const selectableProps = selectable
    ? {
        selectedRecords: selectable.selectedRecords,
        onSelectedRecordsChange: selectable.onSelectedRecordsChange,
        idAccessor: selectable.idAccessor,
      }
    : {};

  const defaultRecordText = (() => {
    const filteredKeys = Object.keys(filters).filter(
      (key) => typeof filters[key] !== "string"
    );

    const areOtherFiltersEmpty = filteredKeys.every((key) =>
      Array.isArray(filters[key]) ? filters[key].length === 0 : !filters[key]
    );

    return areOtherFiltersEmpty && search === ""
      ? noRecordsText
      : "No Records Found.";
  })();

  const tableColumns = useMemo(() => {
    return columns as DataTableColumn<T>[];
  }, [columns]);

  console.log("data", data);

  return (
    <Box className="data-table">
      {" "}
      <DataTable
        records={data}
        fetching={isLoading}
        minHeight={minHeight}
        striped
        highlightOnHover
        rowClassName={rowClassName}
        withTableBorder
        columns={tableColumns}
        onRowClick={onRowClick}
        height={height ?? "100% !important"}
        // sortIcons={{
        //   sorted: <Image src={asc.src} alt="sort asc" width={7} height={9} />,
        //   unsorted: <Image src={dsc.src} alt="sort desc" width={7} height={9} />,
        // }}
        classNames={{
          table: classes.table,
          header: classes.header,
          footer: classes.footer,
          pagination: classes.pagination,
        }}
        {...sortableProps}
        {...paginationProps}
        {...selectableProps}
        // noRecordsText={"defaultRecordText"}
        // selectionColumnStyle={{
        //   backgroundColor: "#ffffff",
        //   minWidth: "5%",
        // }}
        defaultColumnProps={{
          textAlign: "left",
          noWrap: false,
          titleStyle: (theme) => ({
            color: "#8898a9",
            fontSize: "13px",
            paddingTop: "20px",
            paddingBottom: "20px",
          }),
        }}
        // rowStyle={({ state: any }) =>
        //   state !== "NH" ? { padding: "20px" } : undefined
        // }
        styles={{
          header: {
            backgroundColor: "#f0f3f8",
            color: "white",
            padding: "20px",
            height: "30px",
          },
          footer: {
            backgroundColor: "#f0f3f8",
            borderTop: "1px solid #e9ecef",
            borderRadius: "30px",
          },
        }}
      />
    </Box>
  );
};

export default CustomDataTable;
