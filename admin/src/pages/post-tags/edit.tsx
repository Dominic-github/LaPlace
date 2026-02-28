import { Edit, useForm } from '@refinedev/antd'
import { Form, Input } from 'antd'

export const TagEdit = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: 'post-tags'
  })

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  )
}
