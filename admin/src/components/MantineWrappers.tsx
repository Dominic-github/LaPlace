// Wrapper components để tương thích giữa Ant Design và Mantine
import { List as MantineList, useTable as useMantineTable } from "@refinedev/mantine";
import { Table as AntTable } from "antd";
import { Table, ActionIcon, Group } from "@mantine/core";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { useNavigation, useDelete } from "@refinedev/core";

// Export Mantine List component
export const List = MantineList;

// Wrapper cho Table để tương thích với code cũ
export const TableWrapper = ({ children, ...props }: any) => {
  // Nếu là Ant Design Table, giữ nguyên
  if (props.dataSource) {
    return <AntTable {...props}>{children}</AntTable>;
  }
  
  // Nếu là Mantine Table
  return <Table {...props}>{children}</Table>;
};

// Export các components cần thiết
export { useMantineTable as useTable };

// Action buttons cho List pages
interface ActionButtonsProps {
  record: any;
  resource: string;
  showEdit?: boolean;
  showView?: boolean;
  showDelete?: boolean;
}

export function ActionButtons({ 
  record, 
  resource, 
  showEdit = true, 
  showView = false, 
  showDelete = true 
}: ActionButtonsProps) {
  const { edit, show } = useNavigation();
  const { mutate: deleteOne } = useDelete();

  return (
    <Group gap="xs">
      {showView && (
        <ActionIcon
          variant="light"
          color="blue"
          onClick={() => show(resource, record.id)}
        >
          <IconEye size={16} />
        </ActionIcon>
      )}
      {showEdit && (
        <ActionIcon
          variant="light"
          color="orange"
          onClick={() => edit(resource, record.id)}
        >
          <IconEdit size={16} />
        </ActionIcon>
      )}
      {showDelete && (
        <ActionIcon
          variant="light"
          color="red"
          onClick={() => {
            if (window.confirm("Bạn có chắc muốn xóa?")) {
              deleteOne({ resource, id: record.id });
            }
          }}
        >
          <IconTrash size={16} />
        </ActionIcon>
      )}
    </Group>
  );
}

