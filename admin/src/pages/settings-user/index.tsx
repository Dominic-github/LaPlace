import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Card, Typography, message } from "antd";
import { useGetIdentity } from "@refinedev/core";

const { Title } = Typography;

export const UserSettingsPage = () => {
  const { data: user } = useGetIdentity<any>();
  const [form] = Form.useForm();

  const handleChangePassword = async (values: any) => {
    try {
      const response = await fetch("http://localhost:5002/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("Đổi mật khẩu thành công!");
        form.resetFields();
      } else {
        message.error(data.message || "Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      message.error("Lỗi khi đổi mật khẩu!");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Title level={3}>Cài đặt tài khoản</Title>
        <Title level={5} style={{ marginTop: "24px" }}>
          Đổi mật khẩu
        </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangePassword}
          style={{ maxWidth: "500px" }}
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>

          <Form.Item>
            <button
              type="submit"
              style={{
                padding: "8px 24px",
                backgroundColor: "#1c7ed6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Đổi mật khẩu
            </button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

