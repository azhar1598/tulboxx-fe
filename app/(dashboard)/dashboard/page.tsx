"use client";
import React, { useMemo, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import {
  Card,
  Grid,
  Text,
  Group,
  Skeleton,
  ThemeIcon,
  Stack,
  Title,
  Paper,
  Badge,
  List,
  rem,
  useMantineTheme,
  RingProgress,
  Tabs,
  ScrollArea,
} from "@mantine/core";
import {
  IconUsers,
  IconFileInvoice,
  IconFileText,
  IconBriefcase,
  IconArrowUpRight,
  IconReceipt,
  IconChartPie,
  IconChartLine,
  IconCash,
  IconClockHour4,
  IconActivity,
  IconCalendar,
  IconAlertCircle,
  IconCheck,
  IconCircleDashed,
  IconReceiptOff,
  IconCurrencyDollar,
  IconArrowsExchange,
  IconSparkles,
} from "@tabler/icons-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts";
import dayjs from "dayjs";
import { UserContext } from "@/app/layout";

const StatCard = ({ title, value, icon: Icon, diff, isLoading }) => {
  const theme = useMantineTheme();
  const DiffIcon = diff > 0 ? IconArrowUpRight : null; // No icon for negative diff for now

  return (
    <Paper withBorder p="xl" radius="md" shadow="md">
      {isLoading ? (
        <Stack>
          <Skeleton height={20} width="60%" />
          <Skeleton height={40} width="40%" />
          <Skeleton height={15} width="50%" />
        </Stack>
      ) : (
        <>
          <Group justify="space-between">
            <Text size="sm" c="dimmed" fw={700} tt="uppercase">
              {title}
            </Text>
            <Icon size={28} stroke={1.5} />
          </Group>

          <Group align="flex-end" gap="xs" mt="xl">
            <Text fz={36} fw={700} lh={1}>
              {value}
            </Text>
            {DiffIcon && (
              <Text c="teal" fz="sm" fw={500}>
                <span>{diff}%</span>
                <DiffIcon size="1rem" stroke={1.5} />
              </Text>
            )}
          </Group>

          <Text fz="xs" c="dimmed" mt="sm">
            Compared to previous month
          </Text>
        </>
      )}
    </Paper>
  );
};

const RevenueChart = ({ data, isLoading }) => (
  <Paper withBorder radius="md" p="lg" shadow="md">
    <Title order={5} mb="md">
      Monthly Performance
    </Title>
    {isLoading ? (
      <Skeleton height={350} />
    ) : (
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#8884d8"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#82ca9d"
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="estimates"
            stroke="#82ca9d"
            strokeWidth={2}
            name="Estimates Value"
          />
        </ComposedChart>
      </ResponsiveContainer>
    )}
  </Paper>
);

const ActionFeed = ({ overdue, estimates, isLoading }) => {
  const theme = useMantineTheme();
  return (
    <Paper withBorder radius="md" p="lg" shadow="md" style={{ height: "100%" }}>
      <Tabs defaultValue="overdue">
        <Tabs.List>
          <Tabs.Tab value="overdue" leftSection={<IconAlertCircle size={16} />}>
            Overdue Invoices
          </Tabs.Tab>
          <Tabs.Tab value="estimates" leftSection={<IconFileText size={16} />}>
            Recent Estimates
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overdue" pt="xs">
          <ScrollArea.Autosize mah={300}>
            <List spacing="sm" size="sm">
              {isLoading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => <Skeleton key={i} height={40} mt="sm" />)
                : overdue?.map((item) => (
                    <List.Item key={item.id}>
                      <Group justify="space-between">
                        <div>
                          <Text>Invoice #{item.invoice_number}</Text>
                          <Text size="xs" c="dimmed">
                            {item.client?.name || "N/A"}
                          </Text>
                        </div>
                        <Stack align="flex-end" gap={0}>
                          <Text fw={500}>
                            ${item.invoice_total_amount.toLocaleString()}
                          </Text>
                          <Text size="xs" c="red">
                            {dayjs().diff(dayjs(item.due_date), "day")} days
                            overdue
                          </Text>
                        </Stack>
                      </Group>
                    </List.Item>
                  ))}
            </List>
          </ScrollArea.Autosize>
        </Tabs.Panel>

        <Tabs.Panel value="estimates" pt="xs">
          <ScrollArea.Autosize mah={300}>
            <List spacing="sm" size="sm">
              {isLoading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => <Skeleton key={i} height={40} mt="sm" />)
                : estimates?.map((item) => (
                    <List.Item key={item.id}>
                      <Group justify="space-between">
                        <div>
                          <Text>Estimate #{item.number}</Text>
                          <Text size="xs" c="dimmed">
                            {item.clients?.name || "N/A"}
                          </Text>
                        </div>
                        <Text fw={500}>
                          ${item.total_amount.toLocaleString()}
                        </Text>
                      </Group>
                    </List.Item>
                  ))}
            </List>
          </ScrollArea.Autosize>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};

function DashboardPage() {
  const theme = useMantineTheme();
  const user = useContext(UserContext);

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ["get-all-invoices"],
    queryFn: () => callApi.get("invoices", { params: { limit: -1 } }),
    select: (data) => data?.data?.data,
  });

  const { data: estimates, isLoading: estimatesLoading } = useQuery({
    queryKey: ["get-all-estimates"],
    queryFn: () => callApi.get("estimates", { params: { limit: -1 } }),
    select: (data) => data?.data?.data,
  });

  const {
    totalRevenue,
    conversionRate,
    avgJobValue,
    overdueAmount,
    monthlyChartData,
    overdueInvoices,
  } = useMemo(() => {
    if (!invoices || !estimates) return {};

    let totalRevenue = 0;
    const paidInvoices = invoices.filter((i) => i.status === "paid");
    paidInvoices.forEach((invoice) => {
      totalRevenue += invoice.invoice_total_amount;
    });

    const conversionRate =
      estimates.length > 0 ? (invoices.length / estimates.length) * 100 : 0;
    const avgJobValue =
      paidInvoices.length > 0 ? totalRevenue / paidInvoices.length : 0;

    const overdueInvoices = invoices.filter(
      (i) => i.status === "unpaid" && dayjs(i.due_date).isBefore(dayjs())
    );
    const overdueAmount = overdueInvoices.reduce(
      (sum, i) => sum + i.invoice_total_amount,
      0
    );

    const monthlyData = {};
    invoices.forEach((invoice) => {
      const month = dayjs(invoice.issue_date).format("MMM YYYY");
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, estimates: 0 };
      }
      if (invoice.status === "paid") {
        monthlyData[month].revenue += invoice.invoice_total_amount;
      }
    });

    estimates.forEach((estimate) => {
      const month = dayjs(estimate.created_at).format("MMM YYYY");
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, estimates: 0 };
      }
      monthlyData[month].estimates += estimate.total_amount;
    });

    const monthlyChartData = Object.keys(monthlyData)
      .map((month) => ({ name: month, ...monthlyData[month] }))
      .slice(-12);

    return {
      totalRevenue,
      conversionRate,
      avgJobValue,
      overdueAmount,
      monthlyChartData,
      overdueInvoices,
    };
  }, [invoices, estimates]);

  const isLoading = invoicesLoading || estimatesLoading;

  return (
    <Stack gap="xl" className="dashboard-page">
      <Paper withBorder p="lg" radius="md" shadow="md">
        <Group>
          <ThemeIcon color="teal" size={48} radius="md">
            <IconSparkles size={32} stroke={1.5} />
          </ThemeIcon>
          <div>
            <Title order={3}>
              Welcome back, {user?.user_metadata?.first_name || "buddy"}!
            </Title>
            <Text c="dimmed">
              Here's what's happening with your business today.
            </Text>
          </div>
        </Group>
      </Paper>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Revenue"
            value={`$${(totalRevenue || 0).toLocaleString()}`}
            icon={IconCurrencyDollar}
            diff={14} // Placeholder diff
            isLoading={isLoading}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Overdue Amount"
            value={`$${(overdueAmount || 0).toLocaleString()}`}
            icon={IconReceiptOff}
            diff={-5} // Placeholder diff
            isLoading={isLoading}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Conversion Rate"
            value={`${(conversionRate || 0).toFixed(1)}%`}
            icon={IconArrowsExchange}
            diff={22} // Placeholder diff
            isLoading={isLoading}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Avg. Job Value"
            value={`$${(avgJobValue || 0).toLocaleString()}`}
            icon={IconCash}
            diff={8} // Placeholder diff
            isLoading={isLoading}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <RevenueChart data={monthlyChartData} isLoading={isLoading} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <ActionFeed
            overdue={overdueInvoices}
            estimates={estimates}
            isLoading={isLoading}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default DashboardPage;
