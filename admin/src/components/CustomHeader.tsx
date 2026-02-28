import { useGetIdentity, useLogout } from "@refinedev/core";
import { Group, Avatar, Menu, Text, UnstyledButton, rem } from "@mantine/core";
import { IconChevronDown, IconLogout, IconUser, IconSettings } from "@tabler/icons-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CustomHeader: React.FC = () => {
  const { data: user } = useGetIdentity();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <div
      className="custom-header"
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "12px 32px",
        gap: "20px",
        height: "64px",
      }}
    >
      <ThemeSwitcher />

      {user && (
        <Menu
          width={260}
          position="bottom-end"
          transitionProps={{ transition: "pop-top-right" }}
          onClose={() => setUserMenuOpened(false)}
          onOpen={() => setUserMenuOpened(true)}
          withinPortal
        >
          <Menu.Target>
            <UnstyledButton
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                transition: "background-color 100ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--mantine-color-gray-1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Group gap={7}>
                <Avatar
                  src={user.avatar}
                  alt={user.firstName || user.email}
                  radius="xl"
                  size={32}
                  color="blue"
                >
                  {(user.firstName?.[0] || user.email?.[0] || "U").toUpperCase()}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={500} style={{ lineHeight: 1 }}>
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.email}
                  </Text>
                  <Text c="dimmed" size="xs" style={{ lineHeight: 1, marginTop: 4 }}>
                    {user.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
                  </Text>
                </div>
                <IconChevronDown
                  style={{
                    width: rem(16),
                    height: rem(16),
                    transition: "transform 150ms ease",
                    transform: userMenuOpened ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                  stroke={1.5}
                />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Tài khoản</Menu.Label>
            <Menu.Item
              leftSection={
                <IconUser style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              }
              onClick={() => navigate("/profile")}
            >
              Thông tin cá nhân
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              }
              onClick={() => navigate("/user-settings")}
            >
              Cài đặt
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item
              color="red"
              leftSection={
                <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              }
              onClick={() => logout()}
            >
              Đăng xuất
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </div>
  );
};

