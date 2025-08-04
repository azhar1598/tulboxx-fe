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
  Center,
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
  IconInbox,
  IconFileOff,
  IconChartAreaLine,
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
import { UserContext } from "./layout";

const StatCard = ({
  title,
  value,
  icon: Icon,
  diff,
  isLoading,
  hasData = true,
}) => {
  const theme = useMantineTheme();
  const DiffIcon = diff > 0 ? IconArrowUpRight : null;

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

          {hasData ? (
            <>
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
          ) : (
            <Stack align="center" mt="xl" mb="sm">
              <IconInbox size={32} stroke={1.5} color={theme.colors.gray[5]} />
              <Text fz="sm" c="dimmed" ta="center">
                No data available yet
              </Text>
            </Stack>
          )}
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
    ) : !data || data.length === 0 ? (
      <Center style={{ height: 350 }}>
        <Stack align="center" gap="sm">
          <IconChartAreaLine size={48} stroke={1.5} color="#cbd5e1" />
          <Text fz="lg" fw={500} c="dimmed">
            No performance data available
          </Text>
          <Text fz="sm" c="dimmed" ta="center">
            Create some invoices and estimates to see your monthly performance
          </Text>
        </Stack>
      </Center>
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const CustomPieChart = ({ data, title, isLoading }) => (
  <Paper withBorder radius="md" p="lg" shadow="md" style={{ height: "100%" }}>
    <Title order={5} mb="md">
      {title}
    </Title>
    {isLoading ? (
      <Skeleton height={350} />
    ) : !data || data.length === 0 ? (
      <Center style={{ height: 350 }}>
        <Stack align="center" gap="sm">
          <IconChartPie size={48} stroke={1.5} color="#cbd5e1" />
          <Text fz="lg" fw={500} c="dimmed">
            No data to display
          </Text>
          <Text fz="sm" c="dimmed" ta="center">
            {title.includes("Invoice")
              ? "Create some invoices to see the breakdown"
              : "Create some estimates to see the breakdown"}
          </Text>
        </Stack>
      </Center>
    ) : (
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
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
            {isLoading ? (
              <Stack>
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} height={40} mt="sm" />
                  ))}
              </Stack>
            ) : !overdue || overdue.length === 0 ? (
              <Center py="xl">
                <Stack align="center" gap="sm">
                  <IconCheck size={32} stroke={1.5} color="#22c55e" />
                  <Text fz="sm" fw={500} c="dimmed">
                    No overdue invoices
                  </Text>
                  <Text fz="xs" c="dimmed" ta="center">
                    Great! All your invoices are up to date
                  </Text>
                </Stack>
              </Center>
            ) : (
              <List spacing="sm" size="sm">
                {overdue.map((item) => (
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
            )}
          </ScrollArea.Autosize>
        </Tabs.Panel>

        <Tabs.Panel value="estimates" pt="xs">
          <ScrollArea.Autosize mah={300}>
            {isLoading ? (
              <Stack>
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} height={40} mt="sm" />
                  ))}
              </Stack>
            ) : !estimates || estimates.length === 0 ? (
              <Center py="xl">
                <Stack align="center" gap="sm">
                  <IconFileOff size={32} stroke={1.5} color="#cbd5e1" />
                  <Text fz="sm" fw={500} c="dimmed">
                    No estimates yet
                  </Text>
                  <Text fz="xs" c="dimmed" ta="center">
                    Create your first estimate to get started
                  </Text>
                </Stack>
              </Center>
            ) : (
              <List spacing="sm" size="sm">
                {estimates.map((item) => (
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
            )}
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
    invoiceStatusData,
    estimateTypeData,
    hasInvoiceData,
    hasEstimateData,
  } = useMemo(() => {
    if (!invoices || !estimates) return {};

    const hasInvoiceData = invoices && invoices.length > 0;
    const hasEstimateData = estimates && estimates.length > 0;

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

    const invoiceStatusCounts = invoices.reduce(
      (acc, invoice) => {
        const status = (invoice.status || "draft").toLowerCase();
        if (acc.hasOwnProperty(status)) {
          acc[status]++;
        }
        return acc;
      },
      { paid: 0, unpaid: 0, pending: 0, draft: 0 }
    );

    const invoiceStatusData = Object.keys(invoiceStatusCounts)
      .map((name) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: invoiceStatusCounts[name],
      }))
      .filter((d) => d.value > 0);

    const estimateTypeCounts = estimates.reduce((acc, estimate) => {
      const type = (estimate.type || "N/A").toLowerCase();
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const estimateTypeData = Object.keys(estimateTypeCounts)
      .map((name) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: estimateTypeCounts[name],
      }))
      .filter((d) => d.value > 0);

    return {
      totalRevenue,
      conversionRate,
      avgJobValue,
      overdueAmount,
      monthlyChartData,
      overdueInvoices,
      invoiceStatusData,
      estimateTypeData,
      hasInvoiceData,
      hasEstimateData,
    };
  }, [invoices, estimates]);

  const isLoading = invoicesLoading || estimatesLoading;

  return (
    <Stack gap="xl">
      <Paper withBorder p="lg" radius="md" shadow="md">
        <Group>
          <ThemeIcon color="teal" size={48} radius="md">
            <IconSparkles size={32} stroke={1.5} />
          </ThemeIcon>
          <div>
            <Title order={3}>
              Welcome back, {user?.user_metadata?.name || "buddy"}!
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
            diff={14}
            isLoading={isLoading}
            hasData={hasInvoiceData && totalRevenue > 0}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Overdue Amount"
            value={`$${(overdueAmount || 0).toLocaleString()}`}
            icon={IconReceiptOff}
            diff={-5}
            isLoading={isLoading}
            hasData={hasInvoiceData}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Conversion Rate"
            value={`${(conversionRate || 0).toFixed(1)}%`}
            icon={IconArrowsExchange}
            diff={22}
            isLoading={isLoading}
            hasData={hasInvoiceData && hasEstimateData}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Avg. Job Value"
            value={`$${(avgJobValue || 0).toLocaleString()}`}
            icon={IconCash}
            diff={8}
            isLoading={isLoading}
            hasData={hasInvoiceData && avgJobValue > 0}
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
      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <CustomPieChart
            data={invoiceStatusData}
            title="Invoices by Status"
            isLoading={isLoading}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <CustomPieChart
            data={estimateTypeData}
            title="Estimates by Type"
            isLoading={isLoading}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default DashboardPage;
