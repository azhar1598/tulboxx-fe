"use client";
import { ActionIcon, Box, Group } from "@mantine/core";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import React, { useEffect, useState } from "react";
import classes from "./customtable.module.css";

const PAGE_SIZE = 15;

function CustomTable({ records, columns }) {
  const [page, setPage] = useState(1);
  //   const [records, setRecords] = useState([].slice(0, PAGE_SIZE));

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    // setRecords(employees.slice(from, to));
  }, [page]);
  return (
    <div className="data-table">
      <DataTable
        withTableBorder
        columns={columns}
        height={500}
        records={records}
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
            color: "#8898A9",
            fontSize: "13px",
            padding: "20px",
          }),
        }}
        rowStyle={({ state }) =>
          state != "NH" ? { padding: "20px" } : undefined
        }
        styles={{
          header: {
            backgroundColor: "#14141fd9",
            color: "white",
            padding: "20px",
            height: "30px",
          },
          footer: {
            backgroundColor: "#14141fd9",
            border: "5px solid red",
          },
        }}
        totalRecords={["1"].length}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}

export default CustomTable;
