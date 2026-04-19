import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Text,
  Button,
  ActionIcon,
  useMantineColorScheme
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDashboard,
  IconBuilding,
  IconBriefcase,
  IconCalendar,
  IconLogout,
  IconSun,
  IconMoon
} from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AppLayout({ children }) {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const toggleColorScheme = () => {
    setColorScheme(dark ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ FIX: auto close sidebar
  const handleNavigate = (path) => {
    navigate(path);
    if (opened) toggle();
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      {/* HEADER */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} size="sm" />
            <Text fw={600}>Job Tracker</Text>
          </Group>

          <Group gap="sm">
            <ActionIcon
              variant="subtle"
              onClick={toggleColorScheme}
              size="lg"
              aria-label="Toggle color scheme"
            >
              {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>

            <Text size="sm">Hi, {user?.name}</Text>
          </Group>
        </Group>
      </AppShell.Header>

      {/* SIDEBAR */}
      <AppShell.Navbar
        p="md"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <NavLink
          label="Dashboard"
          leftSection={<IconDashboard size={18} />}
          active={location.pathname === "/dashboard"}
          onClick={() => handleNavigate("/dashboard")}
        />

        <NavLink
          label="Companies"
          leftSection={<IconBuilding size={18} />}
          active={location.pathname === "/companies"}
          onClick={() => handleNavigate("/companies")}
        />

        <NavLink
          label="Applications"
          leftSection={<IconBriefcase size={18} />}
          active={location.pathname === "/applications"}
          onClick={() => handleNavigate("/applications")}
        />

        <NavLink
          label="Interviews"
          leftSection={<IconCalendar size={18} />}
          active={location.pathname === "/interviews"}
          onClick={() => handleNavigate("/interviews")}
        />

        <Button
          mt="auto"
          color="red"
          leftSection={<IconLogout size={16} />}
          onClick={handleLogout}
          fullWidth
        >
          Logout
        </Button>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default AppLayout;