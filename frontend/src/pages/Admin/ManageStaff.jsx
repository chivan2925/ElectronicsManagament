import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Card, Typography, Input, Select, Tag, Statistic, Row, Col } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  TeamOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  UsergroupAddOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import AddStaffForm from './common/AddStaffForm'; 

const { Title, Text } = Typography;
const { Option } = Select;

const ManageStaff = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  
  const [dataSource, setDataSource] = useState([
    { id: 'NV001', name: 'Nguyễn Văn A', email: 'vana@gmail.com', phone: '0901234567', address: '123 Quận 1, TP.HCM', role: 'Quản lý' },
    { id: 'NV002', name: 'Lê Thị B', email: 'lib@gmail.com', phone: '0987654321', address: '456 Quận 7, TP.HCM', role: 'Nhân viên kho' },
    { id: 'NV003', name: 'Trần Văn C', email: 'vanc@gmail.com', phone: '0912345678', address: '789 Quận 3, TP.HCM', role: 'Nhân viên bán hàng' },
  ]);

  const handleSave = (values) => {
    if (editingStaff) {
      setDataSource(dataSource.map(item => item.id === editingStaff.id ? { ...item, ...values } : item));
      message.success('Cập nhật thành công!');
    } else {
      const newStaff = { id: `NV${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, ...values };
      setDataSource([...dataSource, newStaff]);
      message.success('Thêm mới thành công!');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setDataSource(dataSource.filter(item => item.id !== id));
    message.success('Đã xóa nhân viên');
  };

  const filteredData = dataSource.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = filterRole === 'All' || item.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const columns = [
    { title: 'Mã NV', dataIndex: 'id', key: 'id', width: 100, render: (id) => <Tag color="blue">{id}</Tag> },
    { title: 'Họ tên', dataIndex: 'name', key: 'name', render: t => <b>{t}</b> },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address', ellipsis: true },
    { 
      title: 'Chức vụ', 
      dataIndex: 'role', 
      key: 'role', 
      render: (role) => (
        <Tag color={role === 'Quản lý' ? 'volcano' : role === 'Nhân viên kho' ? 'green' : 'geekblue'}>
          {role.toUpperCase()}
        </Tag>
      ) 
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined style={{color: '#1890ff'}} />} onClick={() => { setEditingStaff(record); setIsModalOpen(true); }} />
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        
        {/* HEADER SECTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <Title level={3} style={{ margin: 0 }}><TeamOutlined /> Quản lý nhân viên</Title>
            
            {/* THỐNG KÊ NẰM DƯỚI CHỮ QUẢN LÝ NHÂN VIÊN */}
            <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
              <Space>
                <UsergroupAddOutlined style={{ color: '#8c8c8c' }} />
                <Text type="secondary">Tổng nhân sự:</Text>
                <Text strong color="blue">{dataSource.length}</Text>
              </Space>
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <Text type="secondary">Đang hiển thị:</Text>
                <Text strong>{filteredData.length}</Text>
              </Space>
            </div>
          </div>

          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />} 
            onClick={() => { setEditingStaff(null); setIsModalOpen(true); }}
            style={{ borderRadius: '8px', height: '45px', marginTop: '5px' }}
          >
            Thêm nhân viên mới
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <Input
            placeholder="Tìm theo mã hoặc tên..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            allowClear
            size="large"
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 400, borderRadius: '8px' }}
          />
          
          <Select 
            defaultValue="All" 
            size="large"
            style={{ width: 220 }} 
            onChange={(value) => setFilterRole(value)}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="All">Tất cả chức vụ</Option>
            <Option value="Quản lý">Quản lý</Option>
            <Option value="Nhân viên kho">Nhân viên kho</Option>
            <Option value="Nhân viên bán hàng">Nhân viên bán hàng</Option>
          </Select>
        </div>

        <Table 
          dataSource={filteredData} 
          columns={columns}
          rowKey="id"
          pagination={{ 
            pageSize: 8, 
            showTotal: (total) => `Tổng cộng ${total} nhân viên` 
          }}
        />

        <AddStaffForm
          open={isModalOpen}
          editingStaff={editingStaff}
          onCancel={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      </Card>
    </div>
  );
};

export default ManageStaff;