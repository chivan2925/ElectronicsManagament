import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const AddStaffForm = ({ open, onCancel, onSave, editingStaff }) => {
  const [form] = Form.useForm();

  // Đồng bộ dữ liệu khi mở Modal (Sửa hoặc Thêm mới)
  useEffect(() => {
    if (open) {
      if (editingStaff) {
        form.setFieldsValue(editingStaff);
      } else {
        form.resetFields();
      }
    }
  }, [open, editingStaff, form]);

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        onSave(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={editingStaff ? "CẬP NHẬT THÔNG TIN" : "THÊM NHÂN VIÊN MỚI"}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Lưu dữ liệu"
      cancelText="Đóng"
      width={650}
      centered
    >
      <Form form={form} layout="vertical" style={{ marginTop: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          
          <Form.Item name="name" label="Họ tên" rules={[{ required: true, message: 'Nhập họ tên!' }]}>
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
            <Input placeholder="email@example.com" />
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

          {/* ĐÂY LÀ PHẦN COMBOBOX (SELECT) */}
          <Form.Item 
            name="role" 
            label="Chức vụ" 
            rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}
          >
            <Select placeholder="Chọn chức vụ">
              <Option value="Quản lý">Quản lý</Option>
              <Option value="Nhân viên kho">Nhân viên kho</Option>
              <Option value="Nhân viên bán hàng">Nhân viên bán hàng</Option>
            </Select>
          </Form.Item>

        </div>

        <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Nhập địa chỉ!' }]}>
          <Input.TextArea rows={2} placeholder="Địa chỉ chi tiết..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddStaffForm;