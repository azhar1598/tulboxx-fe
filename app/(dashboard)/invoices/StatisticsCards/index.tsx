import {
  SimpleGrid,
  Group,
  Text,
  ThemeIcon,
  Paper,
  Stack,
  Grid,
} from "@mantine/core";
import {
  IconCurrencyDollar,
  IconFileInvoice,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useMemo } from "react";

function StatisticsCards({ invoices }) {
  console.log("invoicesData", invoices);
  const stats = useMemo(() => {
    if (!invoices) {
      return {
        totalRevenue: 0,
        totalInvoices: 0,
        paidInvoices: 0,
        overdue: 0,
      };
    }

    const now = dayjs();
    let totalRevenue = 0;
    let paidInvoices = 0;
    let overdue = 0;

    invoices.forEach((invoice) => {
      if (invoice.status === "paid") {
        totalRevenue += invoice.invoice_total_amount;
        paidInvoices++;
      }
      if (invoice.status !== "paid" && dayjs(invoice.due_date).isBefore(now)) {
        overdue++;
      }
    });

    return {
      totalRevenue,
      totalInvoices: invoices.length,
      paidInvoices,
      overdue,
    };
  }, [invoices]);

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: IconCurrencyDollar,
      color: "dark.8",
    },
    {
      title: "Total Invoices",
      value: stats.totalInvoices,
      icon: IconFileInvoice,
      color: "dark.8",
    },
    {
      title: "Paid Invoices",
      value: stats.paidInvoices,
      icon: IconCheck,
      color: "dark.8",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: IconAlertCircle,
      color: "dark.8",
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" className="mb-4">
      {statCards.map((stat) => (
        <Paper withBorder p="md" radius="md" shadow="sm" key={stat.title}>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              {stat.title}
            </Text>
            <ThemeIcon size="lg" radius="md" color={stat.color} variant="light">
              <stat.icon size={24} />
            </ThemeIcon>
          </Group>

          <Group align="flex-end" gap="xs" mt="md">
            <Text size="2rem" fw={700} lh={1}>
              {stat.value}
            </Text>
          </Group>
        </Paper>
      ))}
    </SimpleGrid>
  );
}

export default StatisticsCards;
