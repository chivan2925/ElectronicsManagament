import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';

const { Option } = Select;

const AddUserForm = ({ open, onCancel, onSave, editingUser }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editingUser) {
        form.setFieldsValue(editingUser);
      } else {
        form.resetFields();
        form.setFieldsValue({ status: true }); // Mặc định trạng thái là hoạt động
      }
    }
  }, [open, editingUser, form]);

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        onSave(values);
      })
      .catch((info) => console.log('Validate Failed:', info));
  };

  return (
    <Modal
      title={editingUser ? "CẬP NHẬT NGƯỜI DÙNG" : "THÊM NGƯỜI DÙNG MỚI"}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Lưu thông tin"
      cancelText="Hủy"
      width={650}
      centered
    >
      <Form form={form} layout="vertical" style={{ marginTop: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item name="name" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
            <Input placeholder="user@gmail.com" />
          </Form.Item>

          <Form.Item 
            name="phone" 
            label="Số điện thoại" 
            rules={[
              { required: true, message: 'Nhập số điện thoại!' },
              { pattern: /^0\d{9}$/, message: 'SĐT phải bắt đầu bằng 0 và đủ 10 số!' }
            ]}
          >
            <Input placeholder="0xxxxxxxxx" maxLength={10} />
          </Form.Item>

          <Form.Item 
            name="password" 
            label="Mật khẩu" 
            rules={[{ required: !editingUser, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password placeholder="******" />
          </Form.Item>
        </div>

        <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
          <Input.TextArea rows={2} placeholder="Địa chỉ chi tiết..." />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái tài khoản" valuePropName="checked">
          <Switch checkedChildren="Hoạt động" unCheckedChildren="Khóa" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserForm;