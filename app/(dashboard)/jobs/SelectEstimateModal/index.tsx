import CustomTable from "@/components/common/CustomTable";
import { FilterLayout } from "@/components/common/FilterLayout";
import { Badge, Button, Modal, Text, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDebouncedState } from "@mantine/hooks";

interface SelectEstimateModalProps {
  opened: boolean;
  onClose: () => void;
}

export const SelectEstimateModal = ({
  opened,
  onClose,
}: SelectEstimateModalProps) => {
  const router = useRouter();
  const [search, setSearch] = useDebouncedState("", 500);
  const [state, setState] = useState({
    sortOrder: "",
    sortedColumn: "",
    allRecords: 0,
    metaData: {
      totalRecords: 0,
    },
    data: null,
  });

  const handleSelect = (estimateId: string) => {
    router.push(`/jobs/add?estimateId=${estimateId}`);
    onClose();
  };

  const columns = [
    {
      accessor: "projectName",
      title: "Estimate",
      sortable: true,
      render: ({ projectName }: any) => (
        <Text size="14px">{projectName || "N/A"}</Text>
      ),
    },
    {
      accessor: "customerName",
      title: "Customer",
      sortable: true,
      render: ({ clients }: any) => (
        <Text size="14px">{clients?.name || "N/A"}</Text>
      ),
    },
    {
      accessor: "total_amount",
      title: "Total Amount",
      sortable: true,
      render: ({ total_amount }: any) => (
        <Text size="14px" fw={600}>
          {total_amount ? `$${total_amount}` : "N/A"}
        </Text>
      ),
    },
    {
      accessor: "actions",
      title: "Actions",
      textAlign: "right",
      render: (record: any) => (
        <Button
          size="xs"
          //   variant="light"
          rightSection={<IconPlus size={14} />}
          onClick={() => handleSelect(record.id)}
        >
          Select
        </Button>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Select Estimate to Create Job"
      size="xl"
    >
      <Stack gap={20}>
        <FilterLayout onSearch={handleSearch} searchable={true} />
        <CustomTable
          url={"/estimates"}
          queryKey={["get-estimates-modal"]}
          search={search}
          columns={columns}
          pagination={true}
          sortable
          defaultSortedColumn={"projectName"}
          defaultSortedColumnDirection={"asc"}
          setMetaData={setState}
          setState={setState}
          state={state}
        />
      </Stack>
    </Modal>
  );
};
