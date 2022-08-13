import { useState, Key } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { Table, Space, Avatar, Image, Typography, Tag, Button } from 'antd';
import {
  UserOutlined,
  FolderViewOutlined,
  EditOutlined,
  DeleteOutlined,
  ControlOutlined,
  FolderAddOutlined,
} from '@ant-design/icons';

// config
import { appConfig } from '../../config';
// models
import { AccessActionGuardProps, Account } from '../../models';
// redux
import { useAppSelector } from '../../redux/hooks';
import { selectAccount } from '../../redux/slices/account';
// routes
import { PATH_DASHBOARD } from '../../routes/path';
// utils
import { distinguishImage } from '../../utils/formatImage';

const { Text } = Typography;

const columns: ColumnsType<Omit<Account, 'type'>> = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (_, record) => {
      const { name, avatar_url } = record;
      return (
        <Space size="middle" align="center">
          <Avatar
            icon={!avatar_url && <UserOutlined />}
            src={
              avatar_url && (
                <Image
                  src={distinguishImage(['https'], avatar_url)}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = `${appConfig.public_image_url}/avatar.png`;
                  }}
                  style={{ width: '100%', height: '100%' }}
                />
              )
            }
          />
          <Text strong>{name}</Text>
        </Space>
      );
    },
  },
  {
    title: 'Phone number',
    dataIndex: 'phone_number',
    render: (text) => <a href={`tel:${text}`}>{text}</a>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    render: (text) => <a href={`mailto:${text}`}>{text}</a>,
  },
];

const AccountList = ({ currentActions, actions }: AccessActionGuardProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const type = pathname.split('/').pop();
  const { isLoading, ...rest } = useAppSelector(selectAccount);
  let accounts: Account[] = [];
  switch (type) {
    case 'administrators':
      accounts = rest.administrators;
      break;
    case 'customers':
      accounts = rest.customers;
      break;
    default:
      break;
  }
  const actionsAccessible: ColumnsType<Omit<Account, 'type'>> = [
    {
      title: 'Actions',
      dataIndex: '',
      render: () => (
        <Space size="middle" align="center">
          {actions.includes('read') && currentActions.includes('read') && (
            <Tag icon={<FolderViewOutlined />} style={{ cursor: 'pointer' }}>
              Read
            </Tag>
          )}
          {actions.includes('update') && currentActions.includes('update') && (
            <Tag icon={<EditOutlined />} color="success" style={{ cursor: 'pointer' }}>
              Update
            </Tag>
          )}
          {actions.includes('delete') && currentActions.includes('delete') && (
            <Tag icon={<DeleteOutlined />} color="error" style={{ cursor: 'pointer' }}>
              Delete
            </Tag>
          )}
          {/* Administrator account type */}
          {actions.includes('authorize') && currentActions.includes('authorize') && (
            <Tag icon={<ControlOutlined />} color="warning" style={{ cursor: 'pointer' }}>
              Authorize
            </Tag>
          )}
        </Space>
      ),
    },
  ];

  const handleCreate = () => {
    navigate(PATH_DASHBOARD.account.create(type));
  };
  const handleChangeSelectedRow = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Space size="middle">
        {actions.includes('create') && currentActions.includes('create') && (
          <Button type="primary" icon={<FolderAddOutlined />} onClick={handleCreate}>
            Create account
          </Button>
        )}
        {selectedRowKeys.length > 0 && (
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Delete selected accounts
          </Button>
        )}
      </Space>
      <Table
        rowKey="_id"
        loading={isLoading}
        rowSelection={{
          selectedRowKeys,
          onChange: handleChangeSelectedRow,
        }}
        columns={currentActions.length > 0 ? [...columns, ...actionsAccessible] : columns}
        dataSource={accounts}
      />
    </Space>
  );
};

export default AccountList;
