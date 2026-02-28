import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch } from "antd";

export const CurrencyEdit = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Mã tiền tệ"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã tiền tệ" }]}
        >
          <Input placeholder="VD: VND, USD, EUR" />
        </Form.Item>

        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input placeholder="VD: Vietnamese Dong" />
        </Form.Item>

        <Form.Item
          label="Ký hiệu"
          name="symbol"
          rules={[{ required: true, message: "Vui lòng nhập ký hiệu" }]}
        >
          <Input placeholder="VD: ₫, $, €" />
        </Form.Item>

        <Form.Item
          label="Tỷ giá (so với tiền tệ cơ sở)"
          name="exchangeRate"
          rules={[{ required: true, message: "Vui lòng nhập tỷ giá" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            step={0.000001}
            placeholder="VD: 1.0 (cho tiền tệ cơ sở)"
          />
        </Form.Item>

        <Form.Item
          label="Đặt làm mặc định"
          name="isDefault"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Kích hoạt"
          name="isActive"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Edit>
  );
};

