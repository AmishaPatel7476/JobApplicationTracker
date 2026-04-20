import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../api/config";

import {
  Title,
  Text,
  SimpleGrid,
  Paper,
  Group,
  Stack,
  Table,
  Loader,
  Center
} from "@mantine/core";

import {
  IconBriefcase,
  IconCalendar,
  IconCheck,
  IconX,
  IconPlus
} from "@tabler/icons-react";

import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/applications`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        const apps = Array.isArray(data) ? data : data.results || [];

        const total = apps.length;
        const interviews = apps.filter(a => a.status === "Interview").length;
        const offers = apps.filter(a => a.status === "Offered").length;
        const rejected = apps.filter(a => a.status === "Rejected").length;

        setStats([
          { label: "Total Applications", value: total, icon: IconBriefcase },
          { label: "Interviews Scheduled", value: interviews, icon: IconCalendar },
          { label: "Offers Received", value: offers, icon: IconCheck },
          { label: "Rejections", value: rejected, icon: IconX }
        ]);

        setRecentApps(apps.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Center h={300}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Dashboard</Title>
        <Text c="dimmed">Welcome back, {user?.name}</Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
        {stats.map((stat) => (
          <Paper key={stat.label} p="md" radius="md" withBorder shadow="sm">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">{stat.label}</Text>
                <Text fw={700} size="xl">{stat.value}</Text>
              </div>
              <stat.icon size={28} color="#3b82f6" />
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        <Paper p="lg" withBorder onClick={() => navigate("/applications")} style={{ cursor: "pointer" }}>
          <Group>
            <IconPlus size={20} />
            <Text>Add Application</Text>
          </Group>
        </Paper>

        <Paper p="lg" withBorder onClick={() => navigate("/companies")} style={{ cursor: "pointer" }}>
          <Group>
            <IconPlus size={20} />
            <Text>Add Company</Text>
          </Group>
        </Paper>

        <Paper p="lg" withBorder onClick={() => navigate("/interviews")} style={{ cursor: "pointer" }}>
          <Group>
            <IconPlus size={20} />
            <Text>Schedule Interview</Text>
          </Group>
        </Paper>
      </SimpleGrid>

      <Paper withBorder p="md">
        <Title order={4} mb="sm">Latest Applications</Title>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Company</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {recentApps.map((a) => (
              <Table.Tr key={a._id}>
                <Table.Td>{a.company?.name}</Table.Td>
                <Table.Td>{a.roleTitle}</Table.Td>
                <Table.Td>{a.status}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}

export default Dashboard;