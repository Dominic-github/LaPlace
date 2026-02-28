import { Create, useForm } from '@refinedev/antd'
import { Form, Input } from 'antd'

export const TagCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: 'post-tags'
  })

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout='vertical'
      >
        <Form.Item
          label='Tên tag'
          name='name'
          rules={[{ required: true, message: 'Vui lòng nhập tên tag' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Slug'
          name='slug'
        >
          <Input placeholder='Để trống để tự động tạo từ tên' />
        </Form.Item>
      </Form>
    </Create>
  )
}
