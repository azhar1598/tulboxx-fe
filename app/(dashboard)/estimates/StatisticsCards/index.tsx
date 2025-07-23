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
  IconReceipt,
  IconFileText,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useMemo } from "react";

function StatisticsCards({ estimates }) {
  const stats = useMemo(() => {
    if (!estimates || estimates.length === 0) {
      return {
        totalEstimates: 0,
        draft: 0,
        sent: 0,
        approved: 0,
        totalPipelineValue: 0,
        approvedValue: 0,
        winRate: 0,
      };
    }

    let draft = 0;
    let sent = 0;
    let approved = 0;
    let totalPipelineValue = 0;
    let approvedValue = 0;

    estimates.forEach((estimate) => {
      totalPipelineValue += estimate.total_amount || 0;

      switch (estimate.status?.toLowerCase()) {
        case "draft":
          draft++;
          break;
        case "sent":
          sent++;
          break;
        case "approved":
          approved++;
          approvedValue += estimate.total_amount || 0;
          break;
        default:
          break;
      }
    });

    const totalEstimates = estimates.length;
    const winRate = totalEstimates > 0 ? (approved / totalEstimates) * 100 : 0;

    return {
      totalEstimates,
      draft,
      sent,
      approved,
      totalPipelineValue,
      approvedValue,
      winRate,
    };
  }, [estimates]);

  const statCards = [
    {
      title: "Total Estimates",
      value: stats.totalEstimates,
      subtitle: `${stats.draft} draft, ${stats.sent} sent, ${stats.approved} approved`,
      icon: IconFileText,
      color: "dark.8",
    },
    {
      title: "Total Pipeline Value",
      value: `$${stats.totalPipelineValue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      subtitle: `$${stats.approvedValue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} approved (${stats.winRate.toFixed(0)}% win rate)`,
      icon: IconCurrencyDollar,
      color: "dark.8",
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" className="mb-4">
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
          <Text size="sm" c="dimmed" mt={5}>
            {stat.subtitle}
          </Text>
        </Paper>
      ))}
    </SimpleGrid>
  );
}

export default StatisticsCards;
