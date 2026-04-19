import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../api/config";
import StatusBadge from "../components/StatusBadge";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconPlus } from "@tabler/icons-react";

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
  Paper
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

function Applications() {
  const { token } = useAuth();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const [opened, setOpened] = useState(false);
  const [applications, setApplications] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [companies, setCompanies] = useState([]);

  const [formData, setFormData] = useState({
    roleTitle: "",
    status: "Applied",
    applicationDate: "",
    salaryExpectation: "",
    resumeVersion: "",
    notes: "",
    company: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ================= FETCH =================

  const fetchApplications = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/applications?search=${search}&sort=${sortBy}&page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      const pages = res.headers.get("X-Total-Pages");

      setTotalPages(Number(pages) || 1);

      if (!res.ok) throw new Error(data.message);

      setApplications(Array.isArray(data) ? data : data.results || data);
    } catch (err) {
      notifications.show({
        color: "red",
        title: "Error",
        message: err.message,
        icon: <IconX size={16} />
      });
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/companies`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : data.results || data);
    } catch (err) {
      notifications.show({
        color: "red",
        title: "Error",
        message: err.message,
        icon: <IconX size={16} />
      });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [search, sortBy, page]);

  useEffect(() => setPage(1), [search, sortBy]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  // ================= HANDLERS =================

  const handleChange = (e) => {
    setErrors({});
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value
    }));
  };

  const handleEdit = (app) => {
    setEditingId(app._id);
    setOpened(true);

    setFormData({
      roleTitle: app.roleTitle || "",
      status: app.status || "Applied",
      applicationDate: app.applicationDate?.split("T")[0] || "",
      salaryExpectation: app.salaryExpectation || "",
      resumeVersion: app.resumeVersion || "",
      notes: app.notes || "",
      company: app.company?._id || ""
    });
  };

  const handleAddNew = () => {
    setEditingId(null);
    setErrors({});
    setFormData({
      roleTitle: "",
      status: "Applied",
      applicationDate: "",
      salaryExpectation: "",
      resumeVersion: "",
      notes: "",
      company: ""
    });
    setOpened(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};

    if (!formData.roleTitle.trim()) {
      newErrors.roleTitle = "Role title is required";
    }

    if (!formData.applicationDate) {
      newErrors.applicationDate = "Application date is required";
    }

    if (!formData.company) {
      newErrors.company = "Please select a company";
    }

    if (
      formData.salaryExpectation &&
      Number(formData.salaryExpectation) < 0
    ) {
      newErrors.salaryExpectation = "Salary cannot be negative";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const url = editingId
        ? `${API_BASE_URL}/applications/${editingId}`
        : `${API_BASE_URL}/applications`;

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
        title: "Success",
        message: editingId
          ? "Application updated successfully"
          : "Application created successfully",
        icon: <IconCheck size={16} />
      });

      setOpened(false);
      setEditingId(null);
      fetchApplications();
    } catch (err) {
      notifications.show({
        color: "red",
        title: "Error",
        message: err.message,
        icon: <IconX size={16} />
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      notifications.show({
        color: "green",
        title: "Deleted",
        message: "Application deleted successfully",
        icon: <IconCheck size={16} />
      });

      fetchApplications();
    } catch (err) {
      notifications.show({
        color: "red",
        title: "Error",
        message: err.message,
        icon: <IconX size={16} />
      });
    }
  };

  // ================= UI =================

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Applications</Title>

        <Button
          leftSection={<IconPlus />}
          onClick={handleAddNew}
          size={isMobile ? "xs" : "sm"}
        >
          Add Application
        </Button>
      </Group>

      {/* SEARCH + SORT */}
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

      {/* TABLE */}
      <Paper withBorder radius="md">
        <Table.ScrollContainer minWidth={800}>
          <Table highlightOnHover verticalSpacing={isMobile ? "xs" : "sm"}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Role</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Company</Table.Th>
                {!isMobile && <Table.Th>Notes</Table.Th>}
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {applications.map((app) => (
                <Table.Tr key={app._id}>
                  <Table.Td>{app.roleTitle}</Table.Td>

                  <Table.Td>
                    <StatusBadge status={app.status} />
                  </Table.Td>

                  <Table.Td>
                    {new Date(app.applicationDate).toLocaleDateString()}
                  </Table.Td>

                  <Table.Td>{app.company?.name}</Table.Td>

                  {!isMobile && (
                    <Table.Td>
                      {app.notes ? (
                        <span
                          style={{
                            maxWidth: "200px",
                            display: "inline-block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {app.notes}
                        </span>
                      ) : (
                        "-"
                      )}
                    </Table.Td>
                  )}

                  <Table.Td>
                    <Group>
                      <Button
                        size={isMobile ? "xs" : "sm"}
                        onClick={() => handleEdit(app)}
                      >
                        Edit
                      </Button>

                      <Button
                        size={isMobile ? "xs" : "sm"}
                        color="red"
                        onClick={() => handleDelete(app._id)}
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

      {/* MODAL */}
      <Modal opened={opened} onClose={() => setOpened(false)} title="Application">
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Role *"
              name="roleTitle"
              placeholder="Enter role title"
              value={formData.roleTitle}
              onChange={handleChange}
              error={errors.roleTitle}
            />

            <Select
              label="Status"
              placeholder="Select status"
              value={formData.status}
              onChange={(v) =>
                setFormData((p) => ({ ...p, status: v }))
              }
              data={[
                "Applied",
                "Under Review",
                "Interview Scheduled",
                "Rejected",
                "Offered",
                "Accepted"
              ]}
            />

            <TextInput
              type="date"
              name="applicationDate"
              label="Application Date"
              placeholder="Select application date"
              value={formData.applicationDate}
              onChange={handleChange}
              error={errors.applicationDate}
            />

            <TextInput
              label="Salary Expectation"
              name="salaryExpectation"
              type="number"
              value={formData.salaryExpectation}
              onChange={handleChange}
              error={errors.salaryExpectation}
            />

            <Select
              placeholder="Select company"
              value={formData.company}
              label="Company"
              onChange={(v) =>
                setFormData((p) => ({ ...p, company: v }))
              }
              data={companies.map((c) => ({
                value: c._id,
                label: c.name
              }))}
              error={errors.company}
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

export default Applications;