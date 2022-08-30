import { useState, Key } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { Table, Space, Avatar, Image, Typography, Tag, Button, Modal } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, FolderAddOutlined } from '@ant-design/icons';

// config
import { appConfig } from '../../config';
// guard
import type { ActionsPassedGuardProps } from '../../guards/AccessGuard';
// models
import { Account } from '../../models';
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
                  src={distinguishImage(avatar_url)}
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

const AccountList = () => {
  const { actionsAllowed } = useOutletContext<ActionsPassedGuardProps>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const navigate = useNavigate();
  const { type } = useParams();
  const { isLoading, administrators, customers } = useAppSelector(selectAccount);
  let accounts: Account[] = [];
  switch (type) {
    case 'administrators':
      accounts = administrators;
      break;
    case 'customers':
      accounts = customers;
      break;
    default:
      break;
  }
  const actionsAccessible: ColumnsType<Omit<Account, 'type'>> = [
    {
      title: 'Actions',
      dataIndex: '',
      render: (_, record) => {
        const { name } = record;
        return (
          <Space size="middle" align="center">
            {actionsAllowed.includes('update') && (
              <Tag
                icon={<EditOutlined />}
                color="success"
                onClick={() => navigate(PATH_DASHBOARD.account.edit(type, record._id))}
                style={{ cursor: 'pointer' }}
              >
                Update
              </Tag>
            )}
            {actionsAllowed.includes('delete') && (
              <Tag
                icon={<DeleteOutlined />}
                color="error"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  Modal.confirm({
                    centered: true,
                    title: `Are you sure you want to delete [${name}]?`,
                    content: 'After deletion, the account will be saved to the recycle bin',
                    okButtonProps: {
                      danger: true,
                    },
                    okText: 'Delete',
                    onOk() {},
                  });
                }}
              >
                Delete
              </Tag>
            )}
          </Space>
        );
      },
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
        {actionsAllowed.includes('create') && (
          <Button type="primary" shape="round" icon={<FolderAddOutlined />} onClick={handleCreate}>
            Create account
          </Button>
        )}
        <Button type="dashed" shape="round" icon={<DeleteOutlined />} danger>
          Recycle bin
        </Button>
        {selectedRowKeys.length > 0 && (
          <Button type="primary" shape="round" danger icon={<DeleteOutlined />}>
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
        columns={actionsAllowed.length > 0 ? [...columns, ...actionsAccessible] : columns}
        dataSource={accounts}
      />
    </Space>
  );
};

export default AccountList;
