import { ActionIcon, Menu, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';

export function ThemeSwitcher() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const getStoredScheme = () => {
    return localStorage.getItem('mantine-color-scheme') || 'auto';
  };

  const currentScheme = getStoredScheme();

  const handleSchemeChange = (scheme: 'light' | 'dark' | 'auto') => {
    localStorage.setItem('mantine-color-scheme', scheme);
    
    if (scheme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setColorScheme(mediaQuery.matches ? 'dark' : 'light');
    } else {
      setColorScheme(scheme);
    }
    
    // Force reload to apply changes
    window.location.reload();
  };

  const getIcon = () => {
    if (currentScheme === 'auto') return <IconDeviceDesktop size={20} />;
    if (currentScheme === 'dark') return <IconMoon size={20} />;
    return <IconSun size={20} />;
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="default" size="lg" aria-label="Chuyển đổi theme">
          {getIcon()}
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Chế độ hiển thị</Menu.Label>
        <Menu.Item
          leftSection={<IconSun size={16} />}
          onClick={() => handleSchemeChange('light')}
          bg={currentScheme === 'light' ? 'var(--mantine-color-blue-light)' : undefined}
        >
          Sáng
        </Menu.Item>
        <Menu.Item
          leftSection={<IconMoon size={16} />}
          onClick={() => handleSchemeChange('dark')}
          bg={currentScheme === 'dark' ? 'var(--mantine-color-blue-light)' : undefined}
        >
          Tối
        </Menu.Item>
        <Menu.Item
          leftSection={<IconDeviceDesktop size={16} />}
          onClick={() => handleSchemeChange('auto')}
          bg={currentScheme === 'auto' ? 'var(--mantine-color-blue-light)' : undefined}
        >
          Theo hệ thống
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

