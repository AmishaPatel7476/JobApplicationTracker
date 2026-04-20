import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../api/config";
import { notifications } from "@mantine/notifications";
import OutcomeBadge from "../components/OutcomeBadge";

import {
  Table,
  Button,
  Modal,
  TextInput,
  Select,
  Textarea,
  Group,
  Stack,
  Title,
  Pagination,
  Paper,
  Text
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

function Interviews() {
  const { token } = useAuth();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const [opened, setOpened] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    round: "",
    interviewDate: "",
    mode: "Online",
    outcome: "Pending",
    notes: "",
    application: ""
  });

  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // fetch

  const fetchInterviews = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/interviews?search=${search}&sort=${sortBy}&page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      const pages = res.headers.get("X-Total-Pages");

      setTotalPages(Number(pages) || 1);
      setInterviews(Array.isArray(data) ? data : data.results || data);
    } catch (err) {
      notifications.show({
        color: "red",
        message: err.message
      });
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setApplications(Array.isArray(data) ? data : data.results || data);
    } catch (err) {
      notifications.show({
        color: "red",
        message: err.message
      });
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [search, sortBy, page]);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy]);

  useEffect(() => {
    fetchApplications();
  }, []);

  // handlers

  const handleChange = (e) => {
    setFormError("");
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value
    }));
  };

  const handleEdit = (i) => {
    setEditingId(i._id);
    setOpened(true);

    setFormData({
      round: i.round || "",
      interviewDate: i.interviewDate?.split("T")[0] || "",
      mode: i.mode || "Online",
      outcome: i.outcome || "Pending",
      notes: i.notes || "",
      application: i.application?._id || ""
    });
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      round: "",
      interviewDate: "",
      mode: "Online",
      outcome: "Pending",
      notes: "",
      application: ""
    });
    setOpened(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.round.trim()) {
      setFormError("Round is required");
      return;
    }

    if (!formData.interviewDate) {
      setFormError("Date required");
      return;
    }

    if (!formData.application) {
      setFormError("Select application");
      return;
    }

    setLoading(true);

    try {
      const url = editingId
        ? `${API_BASE_URL}/interviews/${editingId}`
        : `${API_BASE_URL}/interviews`;

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      notifications.show({
        color: "green",
        message: editingId
          ? "Interview updated!"
          : "Interview created!"
      });

      setOpened(false);
      setEditingId(null);
      fetchInterviews();
    } catch (err) {
      notifications.show({
        color: "red",
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/interviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      notifications.show({
        color: "green",
        message: "Deleted successfully"
      });

      fetchInterviews();
    } catch (err) {
      notifications.show({
        color: "red",
        message: err.message
      });
    }
  };

  // user interface

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Interviews</Title>

        <Button
          leftSection={<IconPlus />}
          onClick={handleAddNew}
          size={isMobile ? "xs" : "sm"}
        >
          Add Interview
        </Button>
      </Group>

      {/* Search + sort*/}
      <Group grow>
        <TextInput
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          value={sortBy}
          onChange={setSortBy}
          data={[
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" }
          ]}
        />
      </Group>

      <Paper withBorder radius="md">
        <Table.ScrollContainer minWidth={800}>
          <Table highlightOnHover verticalSpacing={isMobile ? "xs" : "sm"}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Round</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Mode</Table.Th>
                <Table.Th>Outcome</Table.Th>
                {!isMobile && <Table.Th>Application</Table.Th>}
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {interviews.map((i) => (
                <Table.Tr key={i._id}>
                  <Table.Td>{i.round}</Table.Td>

                  <Table.Td>
                    {new Date(i.interviewDate).toLocaleDateString()}
                  </Table.Td>

                  <Table.Td>{i.mode}</Table.Td>

                  <Table.Td>
                    <OutcomeBadge outcome={i.outcome} />
                  </Table.Td>

                  {!isMobile && (
                    <Table.Td>{i.application?.roleTitle}</Table.Td>
                  )}

                  <Table.Td>
                    <Group>
                      <Button
                        size={isMobile ? "xs" : "sm"}
                        onClick={() => handleEdit(i)}
                      >
                        Edit
                      </Button>

                      <Button
                        size={isMobile ? "xs" : "sm"}
                        color="red"
                        onClick={() => handleDelete(i._id)}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>

      <Pagination value={page} onChange={setPage} total={totalPages} />

      <Modal opened={opened} onClose={() => setOpened(false)} title="Interview">
        <form onSubmit={handleSubmit}>
          <Stack>
            {formError && <Text c="red">{formError}</Text>}

            <TextInput
              label="Round"
              name="round"
              placeholder="Enter round"
              value={formData.round}
              onChange={handleChange}
            />

            <TextInput
              type="date"
              name="interviewDate"
              label="Interview Date"
              placeholder="Select interview date"
              value={formData.interviewDate}
              onChange={handleChange}
            />

            <Select
              value={formData.mode}
              label="Mode"
              placeholder="Select mode"
              onChange={(v) =>
                setFormData((p) => ({ ...p, mode: v }))
              }
              data={["Online", "Phone", "In-person"]}
            />

            <Select
              value={formData.outcome}
              label="Outcome"
              placeholder="Select outcome"
              onChange={(v) =>
                setFormData((p) => ({ ...p, outcome: v }))
              }
              data={["Pending", "Passed", "Failed"]}
            />

            <Select
              placeholder="Select Application"
              label="Application"
              value={formData.application}
              onChange={(v) =>
                setFormData((p) => ({ ...p, application: v }))
              }
              data={applications.map((a) => ({
                value: a._id,
                label: a.roleTitle
              }))}
            />

            <Textarea
              name="notes"
              label="Notes"
              placeholder="Add notes here..."
              value={formData.notes}
              onChange={handleChange}
            />

            <Button type="submit" loading={loading}>
              Save
            </Button>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}

export default Interviews;