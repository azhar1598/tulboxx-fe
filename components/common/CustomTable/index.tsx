"use client";
import { Box, Loader } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import React, { useEffect, useState } from "react";
import classes from "./customtable.module.css";

function CustomTable({
  records,
  columns,
  totalRecords,
  currentPage: initialPage = 1,
  pageSize = 10,
  onPageChange: externalPageChange,
  isLoading,
}) {
  const [page, setPage] = useState(initialPage);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (externalPageChange) {
      externalPageChange(newPage);
    }
  };

  // Reset page when total records changes
  useEffect(() => {
    setPage(initialPage);
  }, [totalRecords, initialPage]);

  console.log("isLoading", isLoading);

  return (
    <Box className="data-table">
      <DataTable
        withTableBorder
        columns={columns}
        height={500}
        records={records?.map((record) => ({
          ...record,
          id: record.id,
        }))}
        classNames={{
          table: classes.table,
          header: classes.header,
          footer: classes.footer,
          pagination: classes.pagination,
        }}
        defaultColumnProps={{
          textAlign: "left",
          noWrap: false,
          titleStyle: (theme) => ({
            color: "#8898a9",
            fontSize: "13px",
            padding: "20px",
          }),
        }}
        rowStyle={({ state }) =>
          state !== "NH" ? { padding: "20px" } : undefined
        }
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
          },
        }}
        totalRecords={totalRecords}
        recordsPerPage={pageSize}
        page={page}
        onPageChange={handlePageChange}
        fetching={isLoading && !records.length}
      />
    </Box>
  );
}

export default CustomTable;
