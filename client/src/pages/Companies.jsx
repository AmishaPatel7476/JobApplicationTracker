import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../api/config";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Select } from "@mantine/core";
import {
  IconBuilding,
  IconMapPin,
  IconWorld,
  IconEdit,
  IconTrash
} from "@tabler/icons-react";

import {
  SimpleGrid,
  Paper,
  Text,
  Title,
  Group,
  Button,
  Modal,
  TextInput,
  Textarea,
  Stack,
  Pagination
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

function Companies() {
  const { token } = useAuth();

  const [opened, setOpened] = useState(false);
  const [companies, setCompanies] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    location: "",
    website: "",
    notes: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ================= FETCH =================
  const fetchCompanies = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/companies?search=${search}&sort=${sortBy}&page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      const pages = res.headers.get("X-Total-Pages");

      setTotalPages(Number(pages) || 1);

      if (!res.ok) throw new Error(data.message);

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
    fetchCompanies();
  }, [search, sortBy, page]);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy]);

  // ================= HANDLERS =================

  const handleChange = (e) => {
    setErrors({});
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value
    }));
  };

  const handleEdit = (c) => {
    setEditingId(c._id);
    setOpened(true);

    setFormData({
      name: c.name || "",
      industry: c.industry || "",
      location: c.location || "",
      website: c.website || "",
      notes: c.notes || ""
    });
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      name: "",
      industry: "",
      location: "",
      website: "",
      notes: ""
    });
    setErrors({});
    setOpened(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};

    // ✅ VALIDATION
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.industry.trim()) {
      newErrors.industry = "Industry is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ✅ FIX WEBSITE
    const payload = {
      ...formData,
      website:
        formData.website && !formData.website.startsWith("http")
          ? "https://" + formData.website
          : formData.website
    };

    setLoading(true);

    try {
      const url = editingId
        ? `${API_BASE_URL}/companies/${editingId}`
        : `${API_BASE_URL}/companies`;

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      notifications.show({
        color: "green",
        title: "Success",
        message: editingId
          ? "Company updated successfully"
          : "Company created successfully",
        icon: <IconCheck size={16} />
      });

      setOpened(false);
      setEditingId(null);

      setFormData({
        name: "",
        industry: "",
        location: "",
        website: "",
        notes: ""
      });

      fetchCompanies();
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
      const res = await fetch(`${API_BASE_URL}/companies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      notifications.show({
        color: "green",
        title: "Deleted",
        message: "Company deleted successfully",
        icon: <IconCheck size={16} />
      });

      fetchCompanies();
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
        <Title order={2}>Companies</Title>

        <Button leftSection={<IconPlus />} onClick={handleAddNew}>
          Add Company
        </Button>
      </Group>
      <Group grow>
        <TextInput
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search companies"
        />

        <Select
          value={sortBy}
          onChange={setSortBy}
          aria-label="Sort companies"
          data={[
            { value: "newest", label: "Newest First" },
            { value: "oldest", label: "Oldest First" },
            { value: "name_asc", label: "Name A-Z" },
            { value: "name_desc", label: "Name Z-A" }
          ]}
        />
      </Group>

      {/* GRID */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        {companies.length === 0 ? (
          <Text ta="center" c="dimmed">
            No companies found
          </Text>
        ) : (
          companies.map((c) => (
            <Paper
              key={c._id}
              p="lg"
              radius="lg"
              withBorder
              shadow="sm"
              style={{
                transition: "all 0.2s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <Stack gap="sm">
                
                {/* HEADER */}
                <Group justify="space-between">
                  <Group gap="xs">
                    <IconBuilding size={18} />
                    <Title order={4}>{c.name}</Title>
                  </Group>
                </Group>

                {/* META INFO */}
                <Stack gap={4}>
                  <Group gap="xs">
                    <IconBuilding size={14} color="gray" />
                    <Text size="sm" c="dimmed">
                      {c.industry}
                    </Text>
                  </Group>

                  <Group gap="xs">
                    <IconMapPin size={14} color="gray" />
                    <Text size="sm">{c.location}</Text>
                  </Group>

                  {c.website && (
                    <Group gap="xs">
                      <IconWorld size={14} color="gray" />
                      <Text
                        size="sm"
                        component="a"
                        href={c.website}
                        target="_blank"
                        c="blue"
                        style={{ wordBreak: "break-all" }}
                      >
                        {new URL(c.website).hostname}
                      </Text>
                    </Group>
                  )}
                </Stack>

                {/* NOTES */}
                {c.notes && (
                  <Text size="xs" c="dimmed" lineClamp={2}>
                    {c.notes}
                  </Text>
                )}

                {/* FOOTER ACTIONS */}
                <Group justify="space-between" mt="md">
                  <Button
                    size="xs"
                    variant="light"
                    leftSection={<IconEdit size={14} />}
                    onClick={() => handleEdit(c)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="xs"
                    color="red"
                    variant="light"
                    leftSection={<IconTrash size={14} />}
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </Button>
                </Group>
              </Stack>
            </Paper>
          ))
        )}
      </SimpleGrid>

      <Pagination value={page} onChange={setPage} total={totalPages} />

      {/* MODAL */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editingId ? "Edit Company" : "Add Company"}
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Name *"
              name="name"
              placeholder="Enter company name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

            <TextInput
              label="Industry *"
              name="industry"
              placeholder="Enter industry"
              value={formData.industry}
              onChange={handleChange}
              error={errors.industry}
            />

            <TextInput
              label="Location *"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
            />

            <TextInput
              label="Website"
              name="website"
              placeholder="Enter website"
              value={formData.website}
              onChange={handleChange}
            />

            <Textarea
              label="Notes"
              name="notes"
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

export default Companies;