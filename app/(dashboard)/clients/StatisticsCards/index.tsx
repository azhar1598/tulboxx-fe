import { SimpleGrid, Group, Text, ThemeIcon, Paper } from "@mantine/core";
import { IconUserPlus, IconUsers, IconUserCheck } from "@tabler/icons-react";
import React, { useMemo } from "react";

function StatisticsCards({ clients, leads }) {
  const stats = useMemo(() => {
    if (!clients || clients.length === 0) {
      return {
        totalClients: 0,
        newLeads: 0,
        newClients: 0,
      };
    }

    let newLeads = 0;
    let newClients = 0;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    clients.forEach((client) => {
      if (client.created_at) {
        const createdDate = new Date(client.created_at);
        const createdMonth = createdDate.getMonth();
        const createdYear = createdDate.getFullYear();

        if (createdYear === currentYear && createdMonth === currentMonth) {
          newClients++;
        }
      }
    });

    // Calculate new leads for the current month from leads data
    if (
      leads &&
      typeof leads === "object" &&
      !leads.isLoading &&
      !leads.isError
    ) {
      Object.values(leads).forEach((lead: any) => {
        // Skip non-lead entries like isLoading, isError, error, refetch
        if (lead && lead.created_at) {
          const createdDate = new Date(lead.created_at);
          const createdMonth = createdDate.getMonth();
          const createdYear = createdDate.getFullYear();

          if (createdYear === currentYear && createdMonth === currentMonth) {
            newLeads++;
          }
        }
      });
    }

    const totalClients = clients.length;

    return {
      totalClients,
      newLeads,
      newClients,
    };
  }, [clients, leads]);

  console.log("leads", leads);

  const statCards = [
    {
      title: "Total Clients",
      value: stats.totalClients,
      subtitle: "All time clients",
      icon: IconUsers,
      color: "dark.8",
    },
    {
      title: "New Clients",
      value: stats.newClients,
      subtitle: "This month",
      icon: IconUserPlus,
      color: "dark.8",
    },
    {
      title: "New Leads",
      value: stats.newLeads,
      subtitle: "This month",
      icon: IconUserCheck,
      color: "dark.8",
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" className="mb-4">
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
