import type { ColumnsType } from 'antd/es/table';
import { Button, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, ApartmentOutlined } from '@ant-design/icons';

// guard
import { ActionsPassedGuardProps } from '../../guards/AccessGuard';
// hooks
import useDrawer from '../../hooks/useDrawer';
// models
import type { Role } from '../../models';
// redux
import { useAppSelector } from '../../redux/hooks';
import { selectAccessControl } from '../../redux/slices/accessControl';
// utils
import { capitalize } from '../../utils/formatString';

const { Text } = Typography;

const columns: ColumnsType<Role> = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (text) => <Text strong>{capitalize(text)}</Text>,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    ellipsis: {
      showTitle: false,
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ),
  },
];

const Roles = ({ actionsAllowed }: ActionsPassedGuardProps) => {
  const { roles } = useAppSelector(selectAccessControl);
  const { openDrawer } = useDrawer();
  const actionsAccessible: ColumnsType<Role> = [
    {
      title: 'Actions',
      dataIndex: '',
      render: (_, record) => {
        const { _id, name } = record;
        return (
          <Space size="middle" align="center">
            {actionsAllowed.includes('update') && (
              <Tag
                icon={<EditOutlined />}
                color="success"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  openDrawer({
                    key: 'roleForm',
                    title: `Update [${capitalize(name)}] role`,
                    props: { role: roles.find((role) => role._id === _id) },
                  })
                }
              >
                Update
              </Tag>
            )}
            {actionsAllowed.includes('delete') && (
              <Tag icon={<DeleteOutlined />} color="error" style={{ cursor: 'pointer' }}>
                Delete
              </Tag>
            )}
          </Space>
        );
      },
    },
  ];
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Space size="middle">
        {actionsAllowed.includes('create') && (
          <Button
            type="primary"
            icon={<ApartmentOutlined />}
            onClick={() =>
              openDrawer({
                key: 'roleForm',
                title: 'Create resource',
              })
            }
          >
            Create role
          </Button>
        )}
      </Space>
      <Table
        rowKey="_id"
        tableLayout="fixed"
        columns={actionsAllowed.length > 0 ? [...columns, ...actionsAccessible] : columns}
        dataSource={roles}
      />
    </Space>
  );
};

export default Roles;
