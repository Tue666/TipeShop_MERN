import type { ColumnsType } from 'antd/es/table';
import { Space, Button, Table, Tag, Tooltip, Typography } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  NodeExpandOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';

// guard
import type { ActionsPassedGuardProps } from '../../guards/AccessGuard';
// hooks
import useDrawer from '../../hooks/useDrawer';
// models
import type { Operation } from '../../models';
// redux
import { useAppSelector } from '../../redux/hooks';
import { selectAccessControl } from '../../redux/slices/accessControl';

const { Text } = Typography;

const columns: ColumnsType<Operation> = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (text) => <Tag>{text}</Tag>,
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
  {
    title: 'Status',
    dataIndex: 'status',
    render: (_, record) => {
      const { locked } = record;
      const status = {
        color: locked ? 'error' : 'success',
        text: locked ? (
          <Text strong type="danger">
            Locked <LockOutlined />
          </Text>
        ) : (
          <Text strong type="success">
            Available <UnlockOutlined />
          </Text>
        ),
      };
      return <Tag color={status.color}>{status.text}</Tag>;
    },
  },
];

const Operations = ({ actionsAllowed }: ActionsPassedGuardProps) => {
  const { operations } = useAppSelector(selectAccessControl);
  const { openDrawer } = useDrawer();
  const actionsAccessible: ColumnsType<Operation> = [
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
                    key: 'operationForm',
                    title: `Update [${name}] operation`,
                    props: { operation: operations.find((operation) => operation._id === _id) },
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
            icon={<NodeExpandOutlined />}
            onClick={() => openDrawer({ key: 'operationForm', title: 'Create operation' })}
          >
            Create operation
          </Button>
        )}
      </Space>
      <Table
        rowKey="_id"
        tableLayout="fixed"
        columns={actionsAllowed.length > 0 ? [...columns, ...actionsAccessible] : columns}
        dataSource={operations}
      />
    </Space>
  );
};

export default Operations;
