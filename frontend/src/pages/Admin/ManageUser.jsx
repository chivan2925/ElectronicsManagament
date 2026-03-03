import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Card, Typography, Input, Tag, Statistic, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, SearchOutlined, UsergroupAddOutlined, CheckCircleOutlined } from '@ant-design/icons';
import AddUserForm from './common/AddUserForm';

const { Title, Text } = Typography;

const ManageUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [dataSource, setDataSource] = useState([
    { id: 'USER001', name: 'Khách hàng A', email: 'khachA@gmail.com', phone: '0356789123', address: 'Quận 1, HCM', status: true, password: '123' },
    { id: 'USER002', name: 'Khách hàng B', email: 'khachB@gmail.com', phone: '0356789124', address: 'Quận 3, HCM', status: false, password: '123' },
  ]);

  const handleSave = (values) => {
    if (editingUser) {
      setDataSource(dataSource.map(u => u.id === editingUser.id ? { ...u, ...values } : u));
      message.success('Cập nhật người dùng thành công!');
    } else {
      const newUser = { id: `USER${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, ...values };
      setDataSource([...dataSource, newUser]);
      message.success('Thêm người dùng thành công!');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setDataSource(dataSource.filter(u => u.id !== id));
    message.success('Đã xóa tài khoản');
  };

  const filteredData = dataSource.filter(u => 
    u.name.toLowerCase().includes(searchText.toLowerCase()) || u.id.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: 'Mã ID', dataIndex: 'id', key: 'id', width: 110, render: (id) => <Tag color="orange">{id}</Tag> },
    { title: 'Họ tên', dataIndex: 'name', key: 'name', render: t => <b>{t}</b> },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address', ellipsis: true },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'ĐANG HOẠT ĐỘNG' : 'ĐÃ KHÓA'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined style={{color: '#1890ff'}} />} onClick={() => { setEditingUser(record); setIsModalOpen(true); }} />
          <Popconfirm title="Xóa người dùng này?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <Title level={3} style={{ margin: 0 }}><UserOutlined /> Quản lý người dùng</Title>
            <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
              <Space>
                <UsergroupAddOutlined style={{ color: '#8c8c8c' }} />
                <Text type="secondary">Tổng số tài khoản:</Text>
                <Text strong>{dataSource.length}</Text>
              </Space>
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <Text type="secondary">Đang hoạt động:</Text>
                <Text strong>{dataSource.filter(u => u.status).length}</Text>
              </Space>
            </div>
          </div>

          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />} 
            onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
            style={{ borderRadius: '8px', height: '45px' }}
          >
            Thêm người dùng
          </Button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <Input
            placeholder="Tìm theo mã hoặc tên khách hàng..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            allowClear
            size="large"
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 450, borderRadius: '8px' }}
          />
        </div>

        <Table 
          dataSource={filteredData} 
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showTotal: (t) => `Tổng ${t} người dùng` }}
        />

        <AddUserForm
          open={isModalOpen}
          editingUser={editingUser}
          onCancel={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      </Card>
    </div>
  );
};

export default ManageUser;