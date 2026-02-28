import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export const SettingEdit = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "settings",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Key"
          name="key"
          rules={[{ required: true, message: "Vui lòng nhập key" }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Value"
          name="value"
          rules={[{ required: true, message: "Vui lòng nhập value" }]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>

        <Form.Item label="Nhóm" name="group">
          <Select>
            <Select.Option value="general">General</Select.Option>
            <Select.Option value="seo">SEO</Select.Option>
            <Select.Option value="shop">Shop</Select.Option>
            <Select.Option value="blog">Blog</Select.Option>
            <Select.Option value="email">Email</Select.Option>
            <Select.Option value="payment">Payment</Select.Option>
            <Select.Option value="social">Social</Select.Option>
            <Select.Option value="maintenance">Maintenance</Select.Option>
            <Select.Option value="media">Media</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Nhãn" name="label">
          <Input placeholder="Tên hiển thị" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={2} placeholder="Mô tả chi tiết" />
        </Form.Item>

        <Form.Item label="Loại" name="type">
          <Select>
            <Select.Option value="text">Text</Select.Option>
            <Select.Option value="textarea">Textarea</Select.Option>
            <Select.Option value="number">Number</Select.Option>
            <Select.Option value="boolean">Boolean</Select.Option>
            <Select.Option value="json">JSON</Select.Option>
            <Select.Option value="image">Image</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Edit>
  );
};

