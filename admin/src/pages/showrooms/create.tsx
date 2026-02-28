import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Switch } from "antd";

export const ShowroomCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "showrooms",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Tên showroom"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên showroom" }]}
        >
          <Input placeholder="Ví dụ: Showroom Hà Nội" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input.TextArea rows={2} placeholder="Địa chỉ đầy đủ" />
        </Form.Item>

        <Form.Item
          label="Điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input placeholder="0123456789" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
        >
          <Input type="email" placeholder="showroom@example.com" />
        </Form.Item>

        <Form.Item
          label="Kinh độ (Latitude)"
          name="latitude"
        >
          <Input type="number" step="0.000001" placeholder="21.028511" />
        </Form.Item>

        <Form.Item
          label="Vĩ độ (Longitude)"
          name="longitude"
        >
          <Input type="number" step="0.000001" placeholder="105.804817" />
        </Form.Item>

        <Form.Item
          label="Giờ mở cửa"
          name="openingHours"
        >
          <Input.TextArea rows={3} placeholder="Thứ 2 - Thứ 6: 8:00 - 18:00&#10;Thứ 7 - CN: 9:00 - 17:00" />
        </Form.Item>

        <Form.Item
          label="Hoạt động"
          name="isActive"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Create>
  );
};

